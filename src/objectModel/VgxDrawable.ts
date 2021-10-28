
/// <reference path="VgxObject.ts" />


namespace Vgx {

	export abstract class VgxDrawable extends VgxObject {

        private _visible = true;
        private _appearanceDirty = true;
        private _geometryDirty = true;
        private _positionDirty = true;

		constructor() {
			super();
		}


		// @virtual
		public draw(drawingContext: DrawingContext) { }


		public get appearanceDirty() { return this._appearanceDirty; }
		public set appearanceDirty(v: boolean) {
			v = !!v;
			this._appearanceDirty = v;
			if (v && this.drawing)
				this.drawing.isDirty = true;
		}

		public get geometryDirty() { return this._geometryDirty; }
		public set geometryDirty(v: boolean) {
			v = !!v;
			this._geometryDirty = v;
			if (v && this.drawing)
				this.drawing.isDirty = true;
		}

		public get positionDirty() { return this._positionDirty; }
		public set positionDirty(v: boolean) {
			v = !!v;
			this._positionDirty = v;
			if (v && this.drawing)
				this.drawing.isDirty = true;
		}

		public get visible() { return this._visible; }
		public set visible(v: boolean) {
			if (this._visible != v) {
				this._visible = v;
				this.appearanceDirty = true;
				if (this.drawing) {
					this.drawing.isDirty = true;
				}
			}
		}
	}
}