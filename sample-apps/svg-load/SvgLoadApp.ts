
namespace SampleApps {

	export class SvgLoadApp {

		public static start() {
			new SvgLoadApp();
		}

		private _canvas: HTMLCanvasElement;
		private _viewTransform: Vgx.ViewTransform;
		private _drawingContext: Vgx.DrawingContext;

		constructor() {
			this._canvas = window.document.querySelector("#renderCanvas");
			this._viewTransform = new Vgx.ViewTransform();

			this._loadSvg("../../drawings/test.svg")
				.then();
		}

		private _resolveImporter(fullTypeName: string) {
			const f = new Function(`return new ${fullTypeName}()`);
			return f() as Vgx.Importer;
		}

		private async _loadSvg(url: string) {

			const importerType = Vgx.ImportersManager.getTypeOrDefault("svg");
			const importer = this._resolveImporter(importerType.typeName);
			if (!importer) {
				throw new Error("importer not loaded");
			}

			const drawing = await importer.loadFile(url);
			//drawing.background = "rgb(127,127,127)";
			
			this._drawingContext = new Vgx.DrawingContext(drawing, this._canvas, this._viewTransform);
			this._drawingContext.drawDrawing(drawing);
		}
	}
}