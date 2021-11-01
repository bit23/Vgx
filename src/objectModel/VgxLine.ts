/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

	export class VgxLine extends VgxEntity {

		//private _startPoint: Cgx.Point;
		private _endPoint: Cgx.Point;
		private _bounds: Rect;

		constructor() {
			super();
			// this._endPoint = {
			// 	x: 0,
			// 	y: 0
			// };
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
			const points = [this.startPoint, this.endPoint];
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

		// public get startPoint() { return this._startPoint; }
		// public set startPoint(v: Cgx.Point) { 
		// 	if (this._startPoint != v) {
		// 		this._startPoint = v;
		// 		this.updateBounds();
		// 		this.geometryDirty = true;
		// 	}
		// }
		public get startPoint() { return { x: this.insertPointX, y: this.insertPointY } };
		public set startPoint(v: Cgx.Point) { 
			this.insertPointX = v.x;
			this.insertPointY = v.y;
		}

		public get endPoint() { return this._endPoint; }
		public set endPoint(v: Cgx.Point) { 
			if (this._endPoint != v) {
				this._endPoint = v;
				this.updateBounds();
				this.geometryDirty = true;
			}
		}

		public draw(drawingContext: DrawingContext) {
			drawingContext.drawLine(this);
		}
	}
	
	EntityTypeManager.registerType("Line", VgxLine);
}