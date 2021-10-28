
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

		// public static loadChildElement(jsonDrawingChild: any) {

		// 	const typeName = jsonDrawingChild[0] as string;
		// 	const type = DrawingLoader.getVgxType(typeName);

		// 	if (typeof type !== "function")
		// 		throw new Error("invalid type name '" + typeName + "'");

		// 	// TODO: migliorare il check
		// 	var instance = new type();
		// 	if (instance == null)
		// 		throw new Error("invalid type name '" + typeName + "'");

		// 	var childInfo = jsonDrawingChild[1];
		// 	for (var n in childInfo) {
		// 		if (!(Reflect.has(instance, n)))
		// 			continue;
		// 		const propDesc = Object.getOwnPropertyDescriptor(instance, n);
		// 		if (propDesc && (!propDesc.writable || !propDesc.get)) {
		// 			// TODO log error: readonly property
		// 		}
		// 		else {
		// 			Reflect.set(instance, n, childInfo[n]);
		// 		}
		// 	}

		// 	switch (typeName) {
		// 		case "Polyline":
		// 		case "Polygon":
		// 			if ("points" in childInfo) {
		// 				for (const p of childInfo.points) {
		// 					instance.points.add(p);
		// 				}
		// 			}
		// 			break;
		// 		case "QuadraticCurve":
		// 			if ("points" in childInfo) {
		// 				for (const p of childInfo.points) {
		// 					instance.points.add(p);
		// 				}
		// 			}
		// 			if ("controlPoints" in childInfo) {
		// 				for (const p of childInfo.controlPoints) {
		// 					instance.points.add(p);
		// 				}
		// 			}
		// 			break;
		// 		case "CubicCurve":
		// 			if ("points" in childInfo) {
		// 				for (const p of childInfo.points) {
		// 					instance.points.add(p);
		// 				}
		// 			}
		// 			if ("controlPoints1" in childInfo) {
		// 				for (const p of childInfo.controlPoints1) {
		// 					instance.points.add(p);
		// 				}
		// 			}
		// 			if ("controlPoints2" in childInfo) {
		// 				for (const p of childInfo.controlPoints2) {
		// 					instance.points.add(p);
		// 				}
		// 			}
		// 			break;
		// 		case "Group":
		// 			if ("children" in childInfo) {
		// 				for (const childItem of childInfo.children) {
		// 					var childElement = DrawingLoader.loadChildElement(childItem);
		// 					if (childElement != null)
		// 						instance.children.add(childElement);
		// 				}
		// 			}
		// 			break;
		// 		case "Path":
		// 			if ("figures" in childInfo) {
		// 				for (const figure of childInfo.figures) {
		// 					switch (figure.type) {
		// 						case "arc":
		// 							instance.addArc(figure.insertPointX, figure.insertPointY, figure.radius, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
		// 							break;
		// 						case "rect":
		// 							instance.addRect(figure.insertPointX, figure.insertPointY, figure.width, figure.height);
		// 							break;
		// 						case "ellipse":
		// 							instance.addEllipse(figure.insertPointX, figure.insertPointY, figure.radiusX, figure.radiusY, figure.rotation || 0, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
		// 							break;
		// 						case "path":
		// 							instance.addFigure(figure.data);
		// 							break;
		// 					}
		// 				}
		// 			}
		// 			break;
		// 	}

		// 	return instance;
		// }

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