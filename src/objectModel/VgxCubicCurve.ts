/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

    export class VgxCubicCurve extends VgxFillableEntity {

		private _points: ReactiveCollection<Cgx.Point>;
		private _controlPoints1: ReactiveCollection<Cgx.Point>;
		private _controlPoints2: ReactiveCollection<Cgx.Point>;
		private _bounds: Rect;

		constructor() {
			super();
			this._points = new ReactiveCollection();
			this._points.onCollectionChanged.add((s, e) => this.updateBounds());
			this._controlPoints1 = new ReactiveCollection();
			this._controlPoints2 = new ReactiveCollection();
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
			if (Reflect.has(data, "controlPoints1")) {
				this.controlPoints1.clear();
				this.controlPoints1.addRange(data.controlPoints1);
			}
			if (Reflect.has(data, "controlPoints2")) {
				this.controlPoints2.clear();
				this.controlPoints2.addRange(data.controlPoints2);
			}
		}

		//abstract override
		public _getPath(): Path2D {
			// TODO
			return null;
		}

		public get points() { return this._points; }
		public get controlPoints1() { return this._controlPoints1; }
		public get controlPoints2() { return this._controlPoints2; }

        public isClosed: boolean;

		public draw(drawingContext: DrawingContext) {
			drawingContext.drawCubicCurve(this);
		}
	}
	
	EntityTypeManager.registerType("CubicCurve", "Vgx.VgxCubicCurve");
}