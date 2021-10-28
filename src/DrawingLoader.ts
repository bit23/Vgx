
namespace Vgx {

	const customEntityNamePropertyKey = "name";
	const customEntityTypeNamePropertyKey = "typeName";
	const customEntityDefaultValuesPropertyKey = "defaultValues";

	export class DrawingLoader {

		private static resolveNamespace(nsparts: string[]) {
			let currentObject = window as any;
			for (const part of nsparts) {
				if (Reflect.has(currentObject, part)) {
					currentObject = Reflect.get(currentObject, part);
				} else {
					return null;
				}
			}
			return currentObject;
		}

		private static getVgxType(entityName: string) {
			let vgxNs = Vgx as any;
			const entityTypeDefinition = EntityTypeManager.getType(entityName);
			if (entityTypeDefinition == null) {
				return null;
			}
			
			const nsparts = entityTypeDefinition.typeName.split(".");
			const typeName = nsparts[nsparts.length - 1];
			let ns = vgxNs;
			if (nsparts.length > 1) {
				ns = DrawingLoader.resolveNamespace(nsparts.slice(0, nsparts.length - 1));
				if (ns == null) {
					return null;
				}
			}
			return Reflect.get(ns, typeName);
		}

		private static loadCustomEntities(jsonCustomEntities: DynamicObject) {
			const drawingCustomEntities = DictionaryObject.fromObject(jsonCustomEntities);
			for (const customEntity of drawingCustomEntities) {
				if (!Reflect.has(customEntity, customEntityNamePropertyKey))  continue;
				if (!Reflect.has(customEntity, customEntityTypeNamePropertyKey)) continue;
				const customEntityNameProperty = Reflect.get(customEntity, customEntityNamePropertyKey);
				const customEntityTypeNameProperty = Reflect.get(customEntity, customEntityTypeNamePropertyKey);
				const customEntityDefaultValuesProperty = Reflect.get(customEntity, customEntityDefaultValuesPropertyKey);
				EntityTypeManager.registerType(customEntityNameProperty, customEntityTypeNameProperty, customEntityDefaultValuesProperty);
			}
		}

		public static loadChildEntity(typeName: string, data: DynamicObject) {

			const type = DrawingLoader.getVgxType(typeName);

			if (typeof type !== "function") {
				throw new Error("invalid type name '" + typeName + "'");
			}

			// TODO: migliorare il check
			const instance = new type();
			if (instance == null) {
				throw new Error("invalid type name '" + typeName + "'");
			}

			(<VgxEntity>instance).loadData(data);

			return instance;
		}

		public static loadFromObject = function (jsonDrawing: any) {

			if (!("children" in jsonDrawing))
				throw new Error("missing 'children' element");

			var drawing = new Drawing();

			if ("customEntities" in jsonDrawing) {
				DrawingLoader.loadCustomEntities(jsonDrawing["customEntities"]);
			}

			for (const child of jsonDrawing.children) {
				//const instance = DrawingLoader.loadChildElement(child);
				const instance = DrawingLoader.loadChildEntity(child[0] as string, child[1]);
				drawing.addChild(instance);
			}

			if ("background" in jsonDrawing) {
				drawing.background = jsonDrawing["background"];
			}

			return drawing;
		}
	}
}