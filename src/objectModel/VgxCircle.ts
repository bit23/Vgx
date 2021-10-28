/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

	export class VgxCircle extends VgxFillableEntity {

		private _radius = 0;

		constructor() {
			super();
		}


		//virtual override 
		protected _getBounds() {
			var x = this.insertPointX - this._radius;
			var y = this.insertPointY -this. _radius;
			var w = this._radius * 2;
			var h = this._radius * 2;
			return new Rect(x, y, w, h);
		}


		//abstract override
		public _getPath(): Path2D {
			// TODO
			return null;
		}

		public get radius() { return this._radius; }
		public set radius(v: number) { 
			if (this._radius != v) {
				this._radius = v;
				this.geometryDirty = true;
			}
		}

		public draw(drawingContext: DrawingContext) {
			drawingContext.drawCircle(this);
		}
	}
	
	EntityTypeManager.registerType("Circle", "Vgx.VgxCircle");
}