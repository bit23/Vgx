/// <reference path="VgxEntity.ts" />

namespace Vgx {

	const degToRad = 0.017453292519943295;

	export class VgxArc extends VgxEntity {

		private _radius = 0;
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
			// TODO
			var xsa = Math.cos(this._startAngleRad) * this._radius;
			var ysa = Math.sin(this._startAngleRad) * this._radius;
			var xea = Math.cos(this._endAngleRad) * this._radius;
			var yea = Math.sin(this._endAngleRad) * this._radius;
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


		public get radius() { return this._radius; }
		public set radius(v: number) { 
			if (this._radius != v) {
				this._radius = v;
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
			drawingContext.drawArc(this);
		}
	}
	
	EntityTypeManager.registerType("Arc", "Vgx.VgxArc");
}