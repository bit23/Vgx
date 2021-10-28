/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

	export class VgxImage extends VgxEntity {

		private _width = 0;
		private _height = 0;
		private _cornersRadius = 0;
		private _source: CanvasImageSource;

		constructor() {
			super();
		}


		//virtual override 
		protected _getBounds() {
			return new Rect(this.insertPointX, this.insertPointY, this._width, this._height);
		}


		//abstract override
		public _getPath(): Path2D {
			// TODO
			return null;
		}

		public get cornersRadius() { return this._cornersRadius; }
		public set cornersRadius(v: number) { 
			if (this._cornersRadius != v) {
				this._cornersRadius = v;
				this.geometryDirty = true;
			}
		}

		public get height() { return this._height; }
		public set height(v: number) { 
			if (this._height != v) {
				this._height = v;
				this.geometryDirty = true;
			}
		}

		public get width() { return this._width; }
		public set width(v: number) { 
			if (this._width != v) {
				this._width = v;
				this.geometryDirty = true;
			}
		}

		public get source() { return this._source; }
		public set source(v: CanvasImageSource) { 
			if (this._source != v) {
				this._source = v;
				this.appearanceDirty = true;
			}
		}

		public draw(drawingContext: DrawingContext) {
			drawingContext.drawImage(this);
		}
	}
	
	EntityTypeManager.registerType("Image", "Vgx.VgxImage");
}