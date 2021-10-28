/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

	export class VgxTriangle extends VgxFillableEntity {

		private _point1: Cgx.Point;
		private _point2: Cgx.Point;
		private _point3: Cgx.Point;
		private _bounds: Rect;

		constructor() {
			super();
		}


		//virtual override 
		protected _getBounds() {
			return this._bounds;
		}


		private updateBounds() {
			let minX = Number.MAX_VALUE;
			let minY = Number.MAX_VALUE;
			let maxX = Number.MIN_VALUE;
			let maxY = Number.MIN_VALUE;
			const points = [this._point1, this._point2, this._point3];
			for (const p of points) {
				if (p) {
					minX = Math.min(minX, p.x);
					minY = Math.min(minY, p.y);
					maxX = Math.max(maxX, p.x);
					maxY = Math.max(maxY, p.y);
				}
			}
			this._bounds = new Rect(minX, minY, maxX - minX, maxY - minY);
			// TODO store insertPoint
		}

		//abstract override
		public _getPath(): Path2D {
			// TODO
			return null;
		}

		public get point1() { return this._point1; }
		public set point1(v: Cgx.Point) { 
			if (this._point1 != v) {
				this._point1 = v;
				this.updateBounds();
				this.geometryDirty = true;
			}
		}

		public get point2() { return this._point2; }
		public set point2(v: Cgx.Point) { 
			if (this._point2 != v) {
				this._point2 = v;
				this.updateBounds();
				this.geometryDirty = true;
			}
		}

		public get point3() { return this._point3; }
		public set point3(v: Cgx.Point) { 
			if (this._point3 != v) {
				this._point3 = v;
				this.updateBounds();
				this.geometryDirty = true;
			}
		}

		public draw(drawingContext: DrawingContext) {
			drawingContext.drawTriangle(this);
		}
	}
	
	EntityTypeManager.registerType("Triangle", "Vgx.VgxTriangle");
}