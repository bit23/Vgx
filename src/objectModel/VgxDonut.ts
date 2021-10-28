/// <reference path="VgxEntity.ts" />

namespace Vgx {

	const degToRad = 0.017453292519943295;

	export class VgxDonut extends VgxFillableEntity {

		private _startRadius = 0;
		private _endRadius = 0;
		private _startAngle = 0;
		private _endAngle = 0;
		private _startAngleRad = 0;
		private _endAngleRad = 0;
		private _isAntiClockwise = false;

		constructor() {
			super();
		}


		//virtual override 
		protected _getBounds() {
			let radius = Math.max(this._startRadius, this._endRadius);
			var xsa = Math.cos(this._startAngleRad) * radius;
			var ysa = Math.sin(this._startAngleRad) * radius;
			var xea = Math.cos(this._endAngleRad) * radius;
			var yea = Math.sin(this._endAngleRad) * radius;
			var x1 = Math.min(xsa, xea);
			var y1 = Math.min(ysa, yea);
			var x2 = Math.max(xsa, xea);
			var y2 = Math.max(ysa, yea);
			return new Rect(this.insertPointX + x1, this.insertPointY + y1, x2 - x1, y2 - y1);
		}


		//abstract override
		public _getPath(): Path2D {
			// TODO
			return null;
		}


		public get startRadius() { return this._startRadius; }
		public set startRadius(v: number) { 
			if (this._startRadius != v) {
				this._startRadius = v;
				this.geometryDirty = true;
			}
		}

		public get endRadius() { return this._endRadius; }
		public set endRadius(v: number) { 
			if (this._endRadius != v) {
				this._endRadius = v;
				this.geometryDirty = true;
			}
		}

		public get startAngle() { return this._startAngle; }
		public set startAngle(v: number) { 
			if (this._startAngle != v) {
				this._startAngle = v;
				this._startAngleRad = v * degToRad;
				this.geometryDirty = true;
			}
		}

		public get startAngleRad() { return this._startAngleRad; }
		public set startAngleRad(v: number) { 
			if (this._startAngleRad != v) {
				this._startAngleRad = v;
				this._startAngle = v / degToRad;
				this.geometryDirty = true;
			}
		}

		public get endAngle() { return this._endAngle; }
		public set endAngle(v: number) { 
			if (this._endAngle != v) {
				this._endAngle = v;
				this._endAngleRad = v * degToRad;
				this.geometryDirty = true;
			}
		}

		public get endAngleRad() { return this._endAngleRad; }
		public set endAngleRad(v: number) { 
			if (this._endAngleRad != v) {
				this._endAngleRad = v;
				this._endAngle = v / degToRad;
				this.geometryDirty = true;
			}
		}

		public get isAntiClockwise() { return this._isAntiClockwise; }
		public set isAntiClockwise(v: boolean) { 
			if (this._isAntiClockwise != v) {
				this._isAntiClockwise = v;
				this.geometryDirty = true;
			}
		}


		public draw(drawingContext: DrawingContext) {
			drawingContext.drawDonut(this);
		}
	}
	
	EntityTypeManager.registerType("Donut", "Vgx.VgxDonut");
}