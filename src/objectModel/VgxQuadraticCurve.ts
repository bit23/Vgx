/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

    export class VgxQuadraticCurve extends VgxFillableEntity {

		private _points: ReactiveCollection<Cgx.Point>;
		private _controlPoints: ReactiveCollection<Cgx.Point>;
		private _bounds: Rect;

		constructor() {
			super();
			this._points = new ReactiveCollection();
			this._points.onCollectionChanged.add((s, e) => this.updateBounds());
			this._controlPoints = new ReactiveCollection();
            this.isClosed = true;
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
			// TODO include controlPoints
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
			if (Reflect.has(data, "controlPoints")) {
				this.controlPoints.clear();
				this.controlPoints.addRange(data.controlPoints);
			}
		}

		//abstract override
		public _getPath(): Path2D {
			// TODO
			return null;
		}

		public get points() { return this._points; }
		public get controlPoints() { return this._controlPoints; }

        public isClosed: boolean;

		public draw(drawingContext: DrawingContext) {
			drawingContext.drawQuadraticCurve(this);
		}
	}
	
	EntityTypeManager.registerType("QuadraticCurve", VgxQuadraticCurve);
}