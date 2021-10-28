
/// <reference path="ReactiveObject.ts" />


namespace Vgx {

	export class Artboard extends ReactiveObject {

		private _clipContent: boolean;
		private _background: BrushDefinition = "#aaaaaa";
		private _border: BrushDefinition = "#666666";
		private _borderWidth: number = 1;
		private _shadow: Shadow;
		private _bounds: Rect;

		constructor() {
			super();
		}

		public get border() { return this._border; }
		public set border(v: BrushDefinition) { 
			if (this._border != v) {
				this._border = v; 
				this._raisePropertyChanged("border");
			}
		}

		public get borderWidth() { return this._borderWidth; }
		public set borderWidth(v: number) { 
			if (this._borderWidth != v) {
				this._borderWidth = v; 
				this._raisePropertyChanged("borderWidth");
			}
		}

		public get background() { return this._background; }
		public set background(v: BrushDefinition) { 
			if (this._background != v) {
				this._background = v; 
				this._raisePropertyChanged("background");
			}
		}

		public get shadow() { return this._shadow; }
		public set shadow(v: Shadow) { 
			if (this._shadow != v) {
				this._shadow = v; 
				this._raisePropertyChanged("shadow");
			}
		}

		public get clipContent() { return this._clipContent; }
		public set clipContent(v: boolean) { 
			v = !!v;
			if (this._clipContent != v) {
				this._clipContent = v; 
				this._raisePropertyChanged("clipContent");
			}
		}

		public get bounds() { return this._bounds; }
		public set bounds(v: Rect) { 
			if (this._bounds != v) {
				this._bounds = v; 
				this._raisePropertyChanged("bounds");
			}
		} 
	}
}