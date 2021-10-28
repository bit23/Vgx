
namespace Vgx {

    export class ScriptImporter extends Importer {

        public load(source: any): Promise<Drawing> {
            
            return new Promise<Drawing>((resolve, reject) => {
                try {
                    var drawing = new Drawing();
                    // eval(script);
                    // resolve(drawing);
        
                    const func = new Function("drawing", source);
                    func.call(null, drawing);
                    resolve(drawing);
                } 
                catch (err) {
                    reject(err);
                }
            });
        }
    }

    ImportersManager.registerType("script", "Vgx.ScriptImporter", ["text/javascript "]);
}