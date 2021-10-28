// /// <reference path="VgxFillableEntity.ts" />

// namespace Vgx {

// 	export abstract class VgxSymbol extends VgxFillableEntity {

// 		private _symbolDrawing: Drawing;
// 		private _symbolCachedImageBitmap: ImageBitmap;
// 		private _needRedraw = true;
// 		private _bounds: Rect;

// 		constructor() {
// 			super();
// 		}


// 		private createBufferedDrawingContext(drawing: Drawing, width: number, height: number) {
// 			var canvas = Cgx.Engine.createCanvas(width, height);
// 			var viewTransform = new ViewTransform();
// 			return new DrawingContext(drawing, canvas, viewTransform);
// 		}

// 		private drawSymbolCore(onCompleted: () => void = null) {

// 			if (this._symbolCachedImageBitmap != null) {
// 				this._symbolCachedImageBitmap.close();
// 				this._symbolCachedImageBitmap = null;
// 			}

// 			if (this._symbolDrawing == null) {
// 				this._symbolDrawing = new Drawing();
// 			} else {
// 				this._symbolDrawing.clear();
// 			}

// 			var bounds = this.getBounds();
// 			var symbolDrawingContext = this.createBufferedDrawingContext(this._symbolDrawing, bounds.width, bounds.height);
// 			symbolDrawingContext.clear();
// 			this.drawSymbol(symbolDrawingContext);

// 			var imageData = symbolDrawingContext._getImageData();
// 			createImageBitmap(imageData).then((imageBitmap) => {
// 				this._symbolCachedImageBitmap = imageBitmap;
// 				this.appearanceDirty = true;
// 				if (typeof onCompleted === "function") {
// 					onCompleted();
// 				}
// 			});
// 		}

// 		//virtual override 
// 		protected _getBounds() {
// 			return this._bounds;
// 		}


// 		private updateBounds() {
// 			let minX = Number.MAX_VALUE;
// 			let minY = Number.MAX_VALUE;
// 			let maxX = Number.MIN_VALUE;
// 			let maxY = Number.MIN_VALUE;
// 			const points = [this._startPoint, this._endPoint];
// 			for (const p of points) {
// 				minX = Math.min(minX, p.x);
// 				minY = Math.min(minY, p.y);
// 				maxX = Math.max(maxX, p.x);
// 				maxY = Math.max(maxY, p.y);
// 			}
// 			this._bounds = new Rect(minX, minY, maxX - minX, maxY - minY);
// 			// TODO store insertPoint
// 		}

// 		//abstract override
// 		public _getPath(): Path2D {
// 			// TODO
// 			return null;
// 		}


// 		public draw(drawingContext: DrawingContext) {
// 			if (this._needRedraw) {
// 				this._needRedraw = false;
// 				this.drawSymbolCore();
// 			}
// 			if (this._symbolCachedImageBitmap != null) {
// 				drawingContext.drawSymbol(this);
// 				//drawingContext.drawVertex(_self.insertPointX, _self.insertPointY);
// 			}
// 		}

// 		public abstract drawSymbol(drawingContext: DrawingContext) : void;
// 	}
// }