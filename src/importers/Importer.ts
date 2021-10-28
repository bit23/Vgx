
namespace Vgx {

    export abstract class Importer {

        public abstract load(source: any) : Promise<Drawing>;

        // virtual
        public async loadFile(url: string) : Promise<Drawing> {
            const response = await fetch(url);
		    const text = await response.text();
            return this.load(text);
        }
    }
}