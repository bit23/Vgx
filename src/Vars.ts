
/// <reference path="PointDefinitions.ts" />


namespace Vgx {

	export class Vars {

		private static _pointType = PointDefinitions.type1;
        private static _pointSize = 20;

        private static _fontFamily = "Arial";
        private static _fontSize = 16;

        private static _vertexSize = 4;
        private static _vertexFill: number | string = "#ddeeff";
        private static _vertexStroke: number | string = "#8888ff";
        private static _vertexStrokeWidth = 1.3;


		public static readonly defaultStrokeStyle: number | string = "transparent";

		public static readonly defaultStrokeWidth: number = 0;

		public static readonly defaultFillStyle: number | string = 0xffffff;


		public static get pointType() { return this._pointType; }
		public static set pointType(v: PointDefinition) { this._pointType = v; }

		public static get pointSize() { return this._pointSize; }
		public static set pointSize(v: number) { this._pointSize = v; }

		public static get fontFamily() { return this._fontFamily; }
		public static set fontFamily(v: string) { this._fontFamily = v; }

		public static get fontSize() { return this._fontSize; }
		public static set fontSize(v: number) { this._fontSize = v; }

		public static get vertexSize() { return this._vertexSize; }
		public static set vertexSize(v: number) { this._vertexSize = v; }

		public static get vertexFillColor() { return this._vertexFill; }
		public static set vertexFillColor(v: number | string) { this._vertexFill = v; }

		public static get vertexStrokeColor() { return this._vertexStroke; }
		public static set vertexStrokeColor(v: number | string) { this._vertexStroke = v; }

		public static get vertexStrokeWidth() { return this._vertexStrokeWidth; }
		public static set vertexStrokeWidth(v: number) { this._vertexStrokeWidth = v; }
	}
}