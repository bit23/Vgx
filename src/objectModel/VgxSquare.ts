/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

	export class VgxSquare extends VgxFillableEntity {

		private _size = 0;
		private _cornersRadius = 0;

		constructor() {
			super();
		}


		//virtual override 
		protected _getBounds() {
			return new Rect(this.insertPointX, this.insertPointY, this._size, this._size);
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

		public get size() { return this._size; }
		public set size(v: number) { 
			if (this._size != v) {
				this._size = v;
				this.geometryDirty = true;
			}
		}

		public draw(drawingContext: DrawingContext) {
			drawingContext.drawSquare(this);
		}
	}
	
	EntityTypeManager.registerType("Square", "Vgx.VgxSquare");
}