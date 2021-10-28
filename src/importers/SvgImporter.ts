
/// <reference path="Importer.ts" />
/// <reference path="ImportersManager.ts" />

namespace Vgx {

    export class SvgImporter {

        constructor() {
        }

        private async loadSvgFile(url: string) : Promise<Drawing> {

            const response = await fetch(url);
		    const svgCode = await response.text();
            return this.loadSvgCode(svgCode);
        }

        private loadSvgCode(svgCode: string) : Drawing {

            const result = new Drawing();
            const parser = new DOMParser();
            const document = parser.parseFromString(svgCode, "image/svg+xml");

            // TODO

            return result;
        }

        public async loadSvg(svg: string) : Promise<Drawing> {
            if (svg.startsWith('<')) {
                return this.loadSvgCode(svg);
            }
            return this.loadSvgFile(svg);
        }
    }

    ImportersManager.registerType("svg", "Vgx.SvgImporter", ["image/svg+xml"]);
}