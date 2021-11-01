/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

	export interface PathFigure {
		readonly path: Path2D;
		isEmpty: boolean;
	}

	export class VgxPath extends VgxFillableEntity {

		private _lastX: number;
		private _lastY: number;
		private _fillRule: CanvasFillRule;
		private _currentFigure: PathFigure;
		private _children: ReactiveCollection<Path2D>;
		private _bounds: Rect;

		constructor() {
			super();
			this._bounds = new Rect();
			this._fillRule = "nonzero";
			this._children = new ReactiveCollection();
			this._children.onCollectionChanged.add((s, e) => this.updateBounds());
		}


		private collectPath2D() {
			if (this._currentFigure != null && !this._currentFigure.isEmpty)
			this._children.add(this._currentFigure.path);
			this._currentFigure = null;
		}

		private createFigureObj(pathData: string = null) {
			if (pathData && typeof pathData === "string") {
				return {
					path: new Path2D(pathData),
					isEmpty: false
				};
			}
			else {
				return {
					path: new Path2D(),
					isEmpty: true
				};
			}
		}

		private createNewFigure(pathData: string = null) {

			let result: PathFigure = null;

			if (pathData && typeof pathData === "string") {
				result = this.createFigureObj(pathData);
			}

			if (this._currentFigure != null) {
				if (!this._currentFigure.isEmpty) {
					this.collectPath2D();
				}
			}

			if (!result) {
				result = this.createFigureObj();
			}

			this._currentFigure = result;
		}

		private ensureHasFigure() {
			if (!this._currentFigure)
				this.createNewFigure();
		}


		//virtual override 
		protected _getBounds() {
			return this._bounds;
		}

		// override
		protected _copyMembersValues(destination: VgxEntity): void {
			super._copyMembersValues(destination);
			(destination as VgxPath)._fillRule = this._fillRule;
			for (const path2D of this._children) {
				(destination as VgxPath)._children.addRange(this._children.toArray());
			}
		}

		private updateBounds() {
			// TODO
			var result = new Rect();
			result.x = this.insertPointX;
			result.y = this.insertPointY;
			return result;
			// TODO store insertPoint
		}

		//virtual override 
		public override loadData(data: DynamicObject) {
			super.loadData(data);
			if (Reflect.has(data, "figures")) {
				this._children.clear();
				for (const figure of data.figures) {
					switch (figure.type) {
						case "arc":
							this.addArc(figure.insertPointX, figure.insertPointY, figure.radius, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
							break;
						case "rect":
							this.addRect(figure.insertPointX, figure.insertPointY, figure.width, figure.height);
							break;
						case "ellipse":
							this.addEllipse(figure.insertPointX, figure.insertPointY, figure.radiusX, figure.radiusY, figure.rotation || 0, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
							break;
						case "path":
							this.addFigure(figure.data);
							break;
					}
				}
			}
		}

		//abstract override
		public _getPath(): Path2D {
			// TODO
			return null;
		}

		public get figures() { return this._children; }

		public get fillRule() { return this._fillRule; }
		public set fillRule(v: CanvasFillRule) { 
			if (this._fillRule != v) {
				this._fillRule = v;
				this.geometryDirty = true;
			}
		}

		
		public draw(drawingContext: DrawingContext) {
			drawingContext.drawPath(this);
		}


		public addArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean = false) {
			anticlockwise = !!anticlockwise;
			this.createNewFigure();
			this._currentFigure.path.arc(x, y, radius, startAngle, endAngle, anticlockwise);
			this._currentFigure.isEmpty = false;
			this.collectPath2D();
			this.geometryDirty = true;
		}

		public addFigure(pathData: string) {
			this.createNewFigure(pathData);
			this.collectPath2D();
			this.geometryDirty = true;
		}

		public addRect(x: number, y: number, width: number, height: number) {
			this.createNewFigure();
			this._currentFigure.path.rect(x, y, width, height);
			this._currentFigure.isEmpty = false;
			this.collectPath2D();
			this.geometryDirty = true;
		}

		public addEllipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise: boolean = false) {
			anticlockwise = !!anticlockwise;
			this.createNewFigure();
			this._currentFigure.path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
			this._currentFigure.isEmpty = false;
			this.collectPath2D();
			this.geometryDirty = true;
		}

		public arcTo(cpx: number, cpy: number, x: number, y: number, radius: number) {
			this.ensureHasFigure();
			this._currentFigure.path.arcTo(cpx, cpy, x, y, radius);
			this._currentFigure.isEmpty = false;
			this._lastX = x;
			this._lastY = y;
		}

		public beginNewFigure() {
			this.createNewFigure();
			this.geometryDirty = true;
		}

		public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
			this.ensureHasFigure();
			this._currentFigure.path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
			this._currentFigure.isEmpty = false;
			this._lastX = x;
			this._lastY = y;
		}

		public clear() {
			this._children.clear();
			this._currentFigure = null;
			this.geometryDirty = true;
		}

		public closeFigure() {
			if (this._currentFigure) {
				this._currentFigure.path.closePath();
				this.beginNewFigure();
			}
		}

		public endFigure() {
			this.collectPath2D();
			this.geometryDirty = true;
		}

		public horizontalLineTo(x: number) {
			this.ensureHasFigure();
			this._currentFigure.path.lineTo(x, this._lastY);
			this._currentFigure.isEmpty = false;
			this._lastX = x;
		}

		public lineTo(x: number, y: number) {
			this.ensureHasFigure();
			this._currentFigure.path.lineTo(x, y);
			this._currentFigure.isEmpty = false;
			this._lastX = x;
			this._lastY = y;
		}

		public moveTo(x: number, y: number) {
			this.ensureHasFigure();
			this._currentFigure.path.moveTo(x, y);
			this._currentFigure.isEmpty = false;
			this._lastX = x;
			this._lastY = y;
		}

		public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
			this.ensureHasFigure();
			this._currentFigure.path.quadraticCurveTo(cpx, cpy, x, y);
			this._currentFigure.isEmpty = false;
			this._lastX = x;
			this._lastY = y;
		}

		public verticalLineTo(y: number) {
			this.ensureHasFigure();
			this._currentFigure.path.lineTo(this._lastX, y);
			this._currentFigure.isEmpty = false;
			this._lastY = y;
		}
	}
	
	EntityTypeManager.registerType("Path", VgxPath);
}