
/// <reference path="core/DictionaryObject.ts" />


namespace Vgx {

	interface EntityTypeDefinition {
		name: string;
		ctor: Function;
		//typeName: string;
		defaultValues: DynamicObject;
	}

	export class EntityTypeManager {

		private static _registeredTypes: DictionaryObject<string, EntityTypeDefinition> = new DictionaryObject();

		public static registerType(name: string, ctor: Function, defaultValues: DynamicObject = null) {
			if (this._registeredTypes.containsKey(name)) {
				throw new Error(`type '${name}' already defined`);
			}
			const definition = { name, ctor, defaultValues };
			this._registeredTypes.set(name, definition);
		}

		// public static registerType(name: string, typeName: string, defaultValues: DynamicObject = null) {
		// 	if (this._registeredTypes.containsKey(name)) {
		// 		throw new Error(`type '${name}' already defined`);
		// 	}
		// 	const definition = { name, typeName, defaultValues };
		// 	this._registeredTypes.set(name, definition);
		// }

		public static getByName(name: string, throwException: boolean = false) {
			if (!this._registeredTypes.containsKey(name)) {
				if (throwException) {
					throw new Error(`type '${name}' doesn't exists`);
				} else {
					return null;
				}
			}
			return this._registeredTypes.get(name);
		}

		public static getByTypeConstructor(ctor: Function, throwException: boolean = false) {
			for (const entry of this._registeredTypes) {
				if (entry.value.ctor === ctor) {
					return entry;
				}
			}
			return null;
		}
	}
}