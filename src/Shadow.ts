
/// <reference path="ReactiveObject.ts" />

namespace Vgx {

	export class Shadow extends ReactiveObject implements Cgx.Shadow {

		public static isDefault(shadow: Shadow) {
			if (shadow._blur == 0) {
				if (shadow._color == "rgba(0,0,0,0)") {
					if (shadow._offsetX == 0) {
						if (shadow._offsetY == 0) {
							return true;
						}
					}
				}
			}
			return false;
		}

		private _blur = 0;
		private _color: string = "rgba(0,0,0,0)";
		private _offsetX = 0;
		private _offsetY = 0;

		constructor() {
			super();
		}


		public get blur () { return this._blur; }
        public set blur (v: number) {
			if (typeof (v) === "number") {
				if (this._blur != v) {
					this._blur = v;
					this._raisePropertyChanged("blur");
				}
			}
		}

		public get color () { return this._color; }
        public set color (v: string) {
			if (typeof (v) === "number" || typeof (v) === "string") {
				if (this._color != v) {
					this._color = v;
					this._raisePropertyChanged("color");
				}
			}
		}

		public get offsetX () { return this._offsetX; }
        public set offsetX (v: number) {
			if (typeof (v) === "number") {
				if (this._offsetX != v) {
					this._offsetX = v;
					this._raisePropertyChanged("offsetX");
				}
			}
		}

		public get offsetY () { return this._offsetY; }
        public set offsetY (v: number) {
			if (typeof (v) === "number") {
				if (this._offsetY != v) {
					this._offsetY = v;
					this._raisePropertyChanged("offsetY");
				}
			}
		}
	}
}