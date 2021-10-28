
/// <reference path="../core/DictionaryObject.ts" />


namespace Vgx {

	interface ImporterDefinition {
		name: string;
		typeName: string;
		mimeTypes: string[];
		defaultValues: DynamicObject;
	}

	export class ImportersManager {

		private static _defaultType: ImporterDefinition;
		private static _registeredTypes: DictionaryObject<string, ImporterDefinition> = new DictionaryObject();


		public static registerType(name: string, typeName: string, mimeTypes: string[] = null, defaultValues: DynamicObject = null) {
			if (this._registeredTypes.containsKey(name)) {
				throw new Error(`importer '${name}' already defined`);
			}
			const definition = { name, typeName, mimeTypes, defaultValues };
			this._registeredTypes.set(name, definition);
		}

		public static registerTypeAsDefault(name: string, typeName: string, mimeTypes: string[] = null, defaultValues: DynamicObject = null) {
			this.registerType(name, typeName, mimeTypes, defaultValues);
			this._defaultType = this._registeredTypes.get(name);
		}

		public static getDefault() {
			if (this._defaultType) {
				return this._defaultType;
			}
			if (this._registeredTypes.count > 0) {
				return this._registeredTypes.first;
			}
			return null;
		}

		public static getType(name: string, throwException: boolean = false) {
			if (!this._registeredTypes.containsKey(name)) {
				if (throwException) {
					throw new Error(`type '${name}' doesn't exists`);
				} else {
					return null;
				}
			}
			return this._registeredTypes.get(name);
		}

		public static getTypeOrDefault(name: string) {
			let type = this.getType(name, false);
			if (!type) {
				type = this.getDefault();
			}
			return type;
		}
	}
}