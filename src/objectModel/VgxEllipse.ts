/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

	export class VgxEllipse extends VgxFillableEntity {

		private _xRadius = 0;
		private _yRadius = 0;

		constructor() {
			super();
		}


		//virtual override 
		protected _getBounds() {
			const x = this.insertPointX - this._xRadius;
			const y = this.insertPointY - this._yRadius;
			const w = this._xRadius * 2;
			const h = this._yRadius * 2;
			return new Rect(x, y, w, h);
		}


		//abstract override
		public _getPath(): Path2D {
			// TODO
			return null;
		}

		public get xRadius() { return this._xRadius; }
		public set xRadius(v: number) { 
			if (this._xRadius != v) {
				this._xRadius = v;
				this.geometryDirty = true;
			}
		}

		public get yRadius() { return this._yRadius; }
		public set yRadius(v: number) { 
			if (this._yRadius != v) {
				this._yRadius = v;
				this.geometryDirty = true;
			}
		}

		public draw(drawingContext: DrawingContext) {
			drawingContext.drawEllipse(this);
		}
	}
	
	EntityTypeManager.registerType("Ellipse", VgxEllipse);
}