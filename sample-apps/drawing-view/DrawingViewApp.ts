
namespace SampleApps {
	
	export class DrawingViewApp {

		public static start() {
			new DrawingViewApp();
		}

		private _canvas: HTMLCanvasElement;
		private _viewTransform: Vgx.ViewTransform;
		private _drawing: Vgx.Drawing;
		private _drawingContext: Vgx.DrawingContext;
		private _view: Vgx.VgxView;

		constructor() {
			this._canvas = window.document.querySelector("#renderCanvas");
			this._viewTransform = new Vgx.ViewTransform();

			Vgx.HttpClient.downloadString("../../drawings/google-logo.json", this._dowloadReady.bind(this));
		}

		private _dowloadReady(s: Vgx.HttpClient, e: any) {

			this._view = new Vgx.VgxView();
			this._view.insertPointX = 100;
			this._view.insertPointY = 100;
			this._view.stroke = "#666666";
			this._view.strokeWidth = 2;
			this._view.clipBounds = new Vgx.Rect(0, 0, 250, 50);
			this._view.clip = true;

			this._drawing = Vgx.Drawing.fromJSON(e.result);
			for (const child of this._drawing.getChildren()) {
				this._view.children.add(child);
			}
			this._drawing.clear();

			this._drawing.addChild(this._view);
			this._drawing.background = "#ffffff";

			const artboardShadow = new Vgx.Shadow();
			artboardShadow.color = "rgba(0,0,0,0.1)";
			artboardShadow.offsetX = 3;
			artboardShadow.offsetY = 3;
			artboardShadow.blur = 3;

			const artboard = new Vgx.Artboard();
			artboard.bounds = Vgx.Rect.from({ x: 50, y: 50, width: 250, height: 150});
			artboard.background = "#cccccc";
			artboard.border = "#aaaaaa";
			artboard.borderWidth = 1.2;
			artboard.clipContent = true;
			artboard.shadow = artboardShadow;
			this._drawing.artboard = artboard;

			this._drawingContext = new Vgx.DrawingContext(this._drawing, this._canvas, this._viewTransform);
			this._drawingContext.drawDrawing(this._drawing);
			this._drawingContext.drawAxes();
		}
	}
}