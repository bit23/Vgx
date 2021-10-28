
namespace SampleApps {
	
	export class DrawingRenderApp {

		public static start() {
			new DrawingRenderApp();
		}

		private _canvas: HTMLCanvasElement;
		private _viewTransform: Vgx.ViewTransform;
		private _drawing: Vgx.Drawing;
		private _drawingContext: Vgx.DrawingContext;

		constructor() {
			this._canvas = window.document.querySelector("#renderCanvas");
			this._viewTransform = new Vgx.ViewTransform();

			Vgx.HttpClient.downloadString("../../drawings/house.json", this._dowloadReady.bind(this));
		}

		private _dowloadReady(s: Vgx.HttpClient, e: any) {
			this._drawing = Vgx.Drawing.fromJSON(e.result);
			this._drawingContext = new Vgx.DrawingContext(this._drawing, this._canvas, this._viewTransform);
			this._draw();
		}

		private _draw() {

			//this._viewTransform.translate(400, 300);

			if (this._drawing.background) {
				this._drawingContext.clear(this._drawing.background);
			} else {
				this._drawingContext.clear();
			}

			var children = this._drawing.getChildren();
			for (const child of children) {
				if (<Vgx.VgxDrawable>child) {
					if ((<Vgx.VgxDrawable>child).visible) {
						(<Vgx.VgxDrawable>child).draw(this._drawingContext);
					}
				}
			}
		}
	}
}