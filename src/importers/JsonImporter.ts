
/// <reference path="Importer.ts" />
/// <reference path="ImportersManager.ts" />

namespace Vgx {

    export class JsonImporter extends Importer {

        public load(source: any): Promise<Drawing> {
            return new Promise<Drawing>((resolve, reject) => {
                try {
                    let drawing: Drawing;
                    if (typeof(source) === "string") {
                        const jobject = JSON.parse(source) as DynamicObject;
                        drawing = DrawingLoader.loadFromObject(jobject);
                    }
                    else if (typeof(source) === "object") {
                        drawing = DrawingLoader.loadFromObject(source as DynamicObject);
                    }
                    else {
                        throw new Error(`unexpected type ${typeof(source)}`);
                    }
                    resolve(drawing);
                }
                catch(err) {
                    reject(err);
                }
            });
        }
    }

    ImportersManager.registerTypeAsDefault("json", "Vgx.JsonImporter", ["application/json"]);
}