/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

	export class VgxText extends VgxFillableEntity {

		private _source: string;
		private _fontFamily: string;
		private _fontSize: number;
		private _alignment: CanvasTextAlign;
		private _baseline: CanvasTextBaseline = "alphabetic";
		private _textMeasure: Rect;

		constructor() {
			super();
		}


		//virtual override 
		protected _getBounds() {
			this._textMeasure = TextUtils.measureText(this.source, this.fontFamily, this.fontSize);
			const baselineOffset = this.getBaselineOffset(this._textMeasure);
			return new Rect(this.insertPointX, this.insertPointY - baselineOffset, this._textMeasure ? this._textMeasure.width : 0, this._textMeasure ? this._textMeasure.height : 0);
		}


		private getBaselineOffset(textMeasure: Rect) {
			switch (this._baseline) {
				case "top":
					return 0;
				case "hanging":
					// TODO:
					return textMeasure.height * 0.1951;
				case "middle":
					return textMeasure.height * 0.5;
				case "alphabetic":
					// TODO:
					return textMeasure.height * 0.8;
				case "ideographic":
				// TODO:
				case "bottom":
					return textMeasure.height;
				default:
					throw new Error("invalid textBaseline");
			}
		}

		//abstract override
		public _getPath(): Path2D {
			// TODO
			return null;
		}

		public get source() { return this._source; }
		public set source(v: string) { 
			if (this._source != v) {
				this._source = v;
				this.geometryDirty = true;
			}
		}

		public get fontFamily() { return this._fontFamily; }
		public set fontFamily(v: string) { 
			if (this._fontFamily != v) {
				this._fontFamily = v;
				this.geometryDirty = true;
			}
		}

		public get fontSize() { return this._fontSize; }
		public set fontSize(v: number) { 
			if (this._fontSize != v) {
				this._fontSize = v;
				this.geometryDirty = true;
			}
		}

		public get alignment() { return this._alignment; }
		public set alignment(v: CanvasTextAlign) { 
			if (this._alignment != v) {
				this._alignment = v;
				this.geometryDirty = true;
			}
		}

		public get baseline() { return this._baseline; }
		public set baseline(v: CanvasTextBaseline) { 
			if (this._baseline != v) {
				this._baseline = v;
				this.geometryDirty = true;
			}
		}

		public draw(drawingContext: DrawingContext) {
			drawingContext.drawText(this);
		}
	}
	
	EntityTypeManager.registerType("Text", VgxText);
}