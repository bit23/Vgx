
namespace Vgx {

	export class PointDefinition {

		private _id: string;
		private _figures: any[];
		private _vgxPath: VgxPath;

		constructor(id: string, figures: any[]) {
			this._id = id;
			this._figures = figures;
		}

		private _buildPath() {
			this._vgxPath = new VgxPath();
			// *** copied from DrawingLoader.js
			for (const figure of this._figures) {
				switch (figure.type) {
					case "arc":
						this._vgxPath.addArc(figure.insertPointX, figure.insertPointY, figure.radius, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
						break;
					case "rect":
						this._vgxPath.addRect(figure.insertPointX, figure.insertPointY, figure.width, figure.height);
						break;
					case "ellipse":
						this._vgxPath.addEllipse(figure.insertPointX, figure.insertPointY, figure.radiusX, figure.radiusY, figure.rotation || 0, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
						break;
					case "path":
						this._vgxPath.addFigure(figure.data);
						break;
				}
			}
			// ***
		}

		public anchorX = 0;
		public anchorY = 0;

		public get id() { return this._id; }

		public getPath() {
			if (this._vgxPath == null) {
				this._buildPath();
			}
			return this._vgxPath;
		}
	}
}