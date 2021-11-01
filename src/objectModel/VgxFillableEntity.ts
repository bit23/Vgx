
namespace Vgx {
    export abstract class VgxFillableEntity extends VgxEntity implements VgxFillable {

        private _fill: BrushDefinition;

		constructor() {
			super();
			this._fill = "#000";
		}

        public get fill() { return this._getValue("fill", this._fill); }
		public set fill(v: BrushDefinition) {
			if (this._fill != v) {
				this._fill = v;
				this.appearanceDirty = true;
			}
		}
    }
}