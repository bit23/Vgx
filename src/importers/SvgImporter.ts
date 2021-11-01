
/// <reference path="Importer.ts" />
/// <reference path="ImportersManager.ts" />

namespace Vgx {

    

    export class SvgImporter extends Importer {

        private _svgNamespaces = ["http://www.w3.org/2000/svg"];
        private _defs: DictionaryObject<string, VgxEntity>;

        constructor() {
            super();
            this._defs = new DictionaryObject<string, VgxEntity>();
        }


        private tryParseNumber(str: string, fallbackValue: number = 0) {
            try {
                return parseFloat(str);
            } catch (error) {
                return fallbackValue;
            }
        }

        private tryParseTransform(str: string, fallbackValue: Cgx.Transform = null) {

            // matrix(<a> <b> <c> <d> <e> <f>)
            // (?<method>matrix)\((?<a>-*\d+(?:\.\d+)*)\s*(?<b>-*\d+(?:\.\d+)*)\s*(?<c>-*\d+(?:\.\d+)*)\s*(?<d>-*\d+(?:\.\d+)*)\s*(?<e>-*\d+(?:\.\d+)*)\s*(?<f>-*\d+(?:\.\d+)*)\s*\)

            // translate(<x> [<y>])
            // (?<method>translate)\((?<x>-*\d+(?:\.\d+)*)\s*(?<y>-*\d+(?:\.\d+)*)*\)

            // scale(<x> [<y>])
            // (?<method>scale)\((?<x>-*\d+(?:\.\d+)*)\s*(?<y>-*\d+(?:\.\d+)*)*\)

            // rotate(<a> [<x> <y>])
            // (?<method>rotate)\((?<angle>-*\d+(?:\.\d+)*)\s*(?<x>-*\d+(?:\.\d+)*)*\s*(?<y>-*\d+(?:\.\d+)*)*\)

            // skewX(<a>)
            // skewY(<a>)
            // (?<method>skew\w)\((?<x>-*\d+(?:\.\d+)*)\)

            const transformRegex = /(matrix)\((?<a>-*\d+(?:\.\d+)*)\s*(?<b>-*\d+(?:\.\d+)*)\s*(?<c>-*\d+(?:\.\d+)*)\s*(?<d>-*\d+(?:\.\d+)*)\s*(?<e>-*\d+(?:\.\d+)*)\s*(?<f>-*\d+(?:\.\d+)*)\s*\)|(translate)\((?<x>-*\d+(?:\.\d+)*)\s*(?<y>-*\d+(?:\.\d+)*)*\)|(scale)\((?<scaleX>-*\d+(?:\.\d+)*)\s*(?<scaleY>-*\d+(?:\.\d+)*)*\)|(rotate)\((?<angle>-*\d+(?:\.\d+)*)\s*(?<rotateX>-*\d+(?:\.\d+)*)*\s*(?<rotateY>-*\d+(?:\.\d+)*)*\)|(skew\w)\((?<skewValue>-*\d+(?:\.\d+)*)\)/igm;

            try {
                const result = new Cgx.Transform();
                const regexMatchArray = transformRegex.exec(str);
                const matchParts = regexMatchArray.filter(x => x != undefined);
                switch (matchParts[1]) {
                    case "matrix":
                        break;
                    case "translate":
                        result.translationX = this.tryParseNumber(matchParts[2]);
                        if (matchParts.length > 1){
                            result.translationY = this.tryParseNumber(matchParts[3]);
                        }
                        break;
                    case "scale":
                        result.scaleX = this.tryParseNumber(matchParts[2]);
                        if (matchParts.length > 1){
                            result.scaleY = this.tryParseNumber(matchParts[3]);
                        }
                        break;
                    case "rotate":
                        if (matchParts.length > 1){
                            result.translationX = this.tryParseNumber(matchParts[3]);
                        }
                        if (matchParts.length > 2){
                            result.translationY = this.tryParseNumber(matchParts[4]);
                        }
                        result.rotation = this.tryParseNumber(matchParts[2]);
                        break;
                    case "skewX":
                    case "skewY":
                        throw new Error("not implemented");
                        break;
                }
                return result;
            } catch (error) {
                return fallbackValue;
            }
        }


        private loadChildren(children: HTMLCollection) {
            const result: VgxEntity[] = [];
            for (const child of children) {
                if (this._svgNamespaces.indexOf(child.namespaceURI))
                console.dir(child.nodeType);
                const vgxEntity = this.loadSvgElement(child);
                if (vgxEntity) {
                    result.push(vgxEntity);
                }
            }
            return result;
        }


        private readBaseProperties(node: SVGElement, entity: VgxEntity)  {
            if (node.hasAttribute("id")) {
                entity.id = node.getAttribute("id");
            }
            if (node.hasAttribute("transform")) {
                entity.transform = this.tryParseTransform(node.getAttribute("transform"), new Cgx.Transform());
            }
        }

        private readGraphicProperties(node: SVGElement, entity: VgxEntity)  {
            if ((<VgxFillableEntity>entity) && node.hasAttribute("fill")) {
                (<VgxFillableEntity>entity).fill = node.getAttribute("fill");
            }
            if (node.hasAttribute("stroke")) {
                entity.stroke = node.getAttribute("stroke");
            }
            if (node.hasAttribute("stroke-width")) {
                entity.strokeWidth = this.tryParseNumber(node.getAttribute("stroke-width"), 0);
            }
        }

        private readInsertProperties(node: SVGElement, entity: VgxEntity)  {
            if (node.hasAttribute("x")) {
                entity.insertPointX = this.tryParseNumber(node.getAttribute("x"), 0);
            }
            if (node.hasAttribute("y")) {
                entity.insertPointY = this.tryParseNumber(node.getAttribute("y"), 0);
            }
        }

        private readTextProperties(node: SVGElement, entity: VgxText)  {
            entity.source = node.textContent;
            if (node.hasAttribute("font-family")) {
                entity.fontFamily = node.getAttribute("font-family");
            }
            if (node.hasAttribute("font-size")) {
                entity.fontSize = this.tryParseNumber(node.getAttribute("font-size"), 0);
            }
        }

        
        private storeDefs(node: SVGDefsElement) {
            const children = this.loadChildren(node.children);
            for (const child of children) {
                this._defs.set(child.id, child);
            }
        }

        private loadGroup(node: SVGGElement) {
            const result = new VgxGroup();
            this.readBaseProperties(node, result);
            const children = this.loadChildren(node.children);
            result.children.addRange(children);
            return result;
        }

        private loadPath(node: SVGPathElement) {
            const result = new VgxPath();
            this.readBaseProperties(node, result);
            this.readInsertProperties(node, result);
            this.readGraphicProperties(node, result);
            if (node.hasAttribute("d")) {
                result.addFigure(node.getAttribute("d"));
            }
            return result;
        }

        private loadText(node: SVGTextElement) {
            const result = new VgxText();
            this.readBaseProperties(node, result);
            this.readInsertProperties(node, result);
            this.readGraphicProperties(node, result);
            this.readTextProperties(node, result);
            return result;
        }

        private loadUse(node: SVGUseElement) {
            let result: VgxEntity;
            if (node.hasAttribute("xlink:href")) {
                const href = node.getAttribute("xlink:href");
                const refEntity = this._defs.get(href.substr(1));
                result = refEntity.clone();
            }
            this.readBaseProperties(node, result);
            this.readInsertProperties(node, result);
            this.readGraphicProperties(node, result);
            return result;
        }

        private loadSvgElement(child: Element) {
            switch(child.localName) {
                case "defs": {
                    this.storeDefs(child as SVGDefsElement);
                    break;
                }
                case "g": {
                    return this.loadGroup(child as SVGGElement);
                }
                case "path": {
                    return this.loadPath(child as SVGPathElement);
                }
                case "text": {
                    return this.loadText(child as SVGTextElement);
                }
                case "use": {
                    return this.loadUse(child as SVGUseElement);
                }
            }
        }


        
        private loadSvgCode(svgCode: string) : Drawing {

            let drawing: Drawing = new Drawing();
            let parent: Drawing | VgxView = drawing;

            const parser = new DOMParser();
            const document = parser.parseFromString(svgCode, "image/svg+xml");

            const svgElement = document.documentElement;

            if (svgElement.hasAttribute("width") && svgElement.hasAttribute("height")) {
                const widthValue = this.tryParseNumber(svgElement.getAttribute("width"), 0);
                const heightValue = this.tryParseNumber(svgElement.getAttribute("height"), 0);
                if (widthValue && heightValue) {
                    const view = new VgxView();
                    view.clipBounds = new Rect(0, 0, widthValue, heightValue);
                    view.clip = true;
                    parent = view;
                    drawing.addChild(parent); 
                }
            }

            const children = this.loadChildren(svgElement.children);
            if (parent instanceof Drawing) {
                for (const child of children) {
                    parent.addChild(child);
                }
            }
            else {
                parent.children.addRange(children);
            }

            return drawing;
        }

        public load(source: any): Promise<Drawing> {

            return new Promise<Drawing>((resolve, reject) => {
                try {
                    const svgDrawing = this.loadSvgCode(source);
                    resolve(svgDrawing);
                } 
                catch (err) {
                    reject(err);
                }
            });
        }
    }

    ImportersManager.registerType("svg", "Vgx.SvgImporter", ["image/svg+xml"]);
}