
/// <reference path="VgxPolyline.ts" />

namespace Vgx {

    export class VgxPolygon extends VgxPolyline {

		constructor() {
			super();
		}

        public draw(drawingContext: DrawingContext) {
			drawingContext.drawPolygon(this);
		}
	}
	
	EntityTypeManager.registerType("Polygon", "Vgx.VgxPolygon");
}