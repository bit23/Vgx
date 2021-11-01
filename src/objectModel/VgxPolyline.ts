/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

	export class VgxPolyline extends VgxFillableEntity {

		private _points: ReactiveCollection<Cgx.Point>;
		private _bounds: Rect;

		constructor() {
			super();
			this._points = new ReactiveCollection();
			this._points.onCollectionChanged.add((s, e) => this.updateBounds());
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
			for (const p of this._points) {
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

		//virtual override 
		public override loadData(data: DynamicObject) {
			super.loadData(data);
			if (Reflect.has(data, "points")) {
				this.points.clear();
				this.points.addRange(data.points);
			}
		}

		//abstract override
		public _getPath(): Path2D {
			// TODO
			return null;
		}

		public get points() { return this._points; }

		public draw(drawingContext: DrawingContext) {
			drawingContext.drawPolyline(this);
		}
	}
	
	EntityTypeManager.registerType("Polyline", VgxPolyline);
}