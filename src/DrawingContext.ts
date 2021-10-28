
namespace Vgx {

	export class DrawingContext {

		private _drawing: Drawing;
		private _canvas: Cgx.CanvasSurface;
		private _viewTransform: ViewTransform;

		private _graphics: Cgx.CoreGraphics;
		private _shadow: Shadow;
		private _scaleStyles = true;


		constructor(drawing: Drawing, canvas: Cgx.CanvasSurface, viewTransform: ViewTransform) {
			this._drawing = drawing;
			this._canvas = canvas;
			this._viewTransform = viewTransform;
			this._graphics = new Cgx.CoreGraphics(this._canvas);
			this._shadow = new Shadow();
		}


		public _beginRender() {
			this._graphics.pushTransform(this._viewTransform);
		}

		public _endRender() {
			this._graphics.popTransform();
		}

		public _getImageData() {
			this._graphics.getImageData(0, 0, this._canvas.width, this._canvas.height);
		}

		public _attachToDrawing(drawing: Drawing) {
			this._drawing = drawing;
		}

		public get drawing() { return this._drawing; }

		public get fillBrush() { return this._graphics.fillBrush; }
		public set fillBrush(v: BrushDefinition) { this._graphics.fillBrush = v; }

		

		public get fontFamily() { return this._graphics.fontFamily; }
		public set fontFamily(v: string) { this._graphics.fontFamily = v; }

		public get fontSize() { return this._graphics.fontSize; }
		public set fontSize(v: string) { this._graphics.fontSize = v; }

		

		public get scaleStyles() { return this._scaleStyles; }
		public set scaleStyles(v: boolean) { this._scaleStyles = v; }

		public get shadow() { return this._shadow; }
		public set shadow(v: Shadow) { 
			this._shadow = v;
			this._graphics.shadow = v; 
		}

		public get strokeBrush() { return this._graphics.strokeBrush; }
		public set strokeBrush(v: BrushDefinition) { this._graphics.strokeBrush = v; }

		public get strokeWidth() { 
			if (this._scaleStyles) {
				return this._graphics.strokeWidth;
			} else {
				return this._graphics.strokeWidth * this._viewTransform.viewZoom;
			}
		}
		public set strokeWidth(v: number) { 
			if (this._scaleStyles) {
				this._graphics.strokeWidth = v;
			} else {
				this._graphics.strokeWidth = v / this._viewTransform.viewZoom;
			}
		}

		public get textBaseline() { return this._graphics.textBaseline; }
		public set textBaseline(v: CanvasTextBaseline) { this._graphics.textBaseline = v; }
		




		public clear(fillBrush: BrushDefinition = null) {
			this._graphics.clear(fillBrush);
		}

		public drawArtboard(artboard: Artboard, background: BrushDefinition) {

			const originalStrokeBrush = this.strokeBrush;
			const originalStrokeWidth = this.strokeWidth;
			const originalShadow = this.shadow;
			const originalFillBrush = this.fillBrush;


			// this.strokeBrush = null;
			// this.fillBrush = "rgba(0,0,0,0.1)";
			// this._graphics.drawRectangle(2, 2, artboard.size.width, artboard.size.height);


			this.strokeBrush = null;
			if (artboard.shadow) {
				this.shadow = artboard.shadow;
				this.strokeBrush = null;
				this._graphics.drawRectangle(artboard.bounds.x, artboard.bounds.y, artboard.bounds.width, artboard.bounds.height);
				this.shadow = originalShadow;
			}

			this.strokeBrush = artboard.border;
			this.strokeWidth = artboard.borderWidth;
			this.fillBrush = background || "#ffffff";

			this._graphics.drawRectangle(artboard.bounds.x, artboard.bounds.y, artboard.bounds.width, artboard.bounds.height);
			

			this.strokeBrush = originalStrokeBrush;
			this.strokeWidth = originalStrokeWidth;
			
			this.fillBrush = originalFillBrush;
		}

		public drawArc (arc: VgxArc) {
			this._graphics.strokeBrush = arc.stroke;
			this.strokeWidth = arc.strokeWidth;
			this._graphics.shadow = arc.shadow;
			this._graphics.drawArc(arc.insertPointX, arc.insertPointY, arc.radius, arc.startAngleRad, arc.endAngleRad, arc.isAntiClockwise, arc.transform);
		}

		public drawLine (line: VgxLine) {
			this._graphics.strokeBrush = line.stroke;
			this.strokeWidth = line.strokeWidth;
			this._graphics.shadow = line.shadow;
			this._graphics.drawLine(line.insertPointX, line.insertPointY, line.endPoint.x, line.endPoint.y, line.transform);
		}

		public drawRectangle (rectangle: VgxRectangle) {
			this._graphics.strokeBrush = rectangle.stroke;
			this.strokeWidth = rectangle.strokeWidth;
			this._graphics.fillBrush = rectangle.fill;
			this._graphics.shadow = rectangle.shadow;
			if (rectangle.cornersRadius === 0) {
				this._graphics.drawRectangle(rectangle.insertPointX, rectangle.insertPointY, rectangle.width, rectangle.height, rectangle.transform);
			}
			else {
				this._graphics.drawRoundedRectangle(rectangle.insertPointX, rectangle.insertPointY, rectangle.width, rectangle.height, rectangle.cornersRadius, rectangle.transform);
			}
		}

		public drawSquare (square: VgxSquare) {
			this._graphics.strokeBrush = square.stroke;
			this.strokeWidth = square.strokeWidth;
			this._graphics.fillBrush = square.fill;
			this._graphics.shadow = square.shadow;
			if (square.cornersRadius === 0) {
				this._graphics.drawSquare(square.insertPointX, square.insertPointY, square.size, square.transform);
			}
			else {
				this._graphics.drawRoundedRectangle(square.insertPointX, square.insertPointY, square.size, square.size, square.cornersRadius, square.transform);
			}
		}

		public drawCircle (circle: VgxCircle) {
			this._graphics.strokeBrush = circle.stroke;
			this.strokeWidth = circle.strokeWidth;
			this._graphics.fillBrush = circle.fill;
			this._graphics.shadow = circle.shadow;
			this._graphics.drawCircle(circle.insertPointX, circle.insertPointY, circle.radius, circle.transform);
		}

		public drawEllipse (ellipse: VgxEllipse) {
			this._graphics.strokeBrush = ellipse.stroke;
			this.strokeWidth = ellipse.strokeWidth;
			this._graphics.fillBrush = ellipse.fill;
			this._graphics.shadow = ellipse.shadow;
			this._graphics.drawEllipse(ellipse.insertPointX, ellipse.insertPointY, ellipse.xRadius, ellipse.yRadius, ellipse.transform);
		}

		public drawPolyline (polyline: VgxPolyline) {
			this._graphics.strokeBrush = polyline.stroke;
			this.strokeWidth = polyline.strokeWidth;
			this._graphics.fillBrush = polyline.fill;
			this._graphics.shadow = polyline.shadow;
			// TODO polyline.points.toArray() convert to Iterable<Point>
			this._graphics.drawPolyline(polyline.points.toArray(), polyline.transform);
		}

		public drawPolygon (polygon: VgxPolygon) {
			this._graphics.strokeBrush = polygon.stroke;
			this.strokeWidth = polygon.strokeWidth;
			this._graphics.fillBrush = polygon.fill;
			this._graphics.shadow = polygon.shadow;
			// TODO polygon.points.toArray() convert to Iterable<Point>
			this._graphics.drawPolygon(polygon.points.toArray(), polygon.transform);
		}

		public drawTriangle (triangle: VgxTriangle) {
			this._graphics.strokeBrush = triangle.stroke;
			this.strokeWidth = triangle.strokeWidth;
			this._graphics.fillBrush = triangle.fill;
			this._graphics.shadow = triangle.shadow;
			this._graphics.drawTriangle(triangle.point1, triangle.point2, triangle.point3, triangle.transform);
		}

		public drawQuad (quad: VgxQuad) {
			this._graphics.strokeBrush = quad.stroke;
			this.strokeWidth = quad.strokeWidth;
			this._graphics.fillBrush = quad.fill;
			this._graphics.shadow = quad.shadow;
			this._graphics.drawQuad(quad.point1, quad.point2, quad.point3, quad.point4, quad.transform);
		}

		public drawCubicCurve (cubicCurve: VgxCubicCurve) {
			this._graphics.strokeBrush = cubicCurve.stroke;
			this.strokeWidth = cubicCurve.strokeWidth;
			this._graphics.fillBrush = cubicCurve.fill;
			this._graphics.shadow = cubicCurve.shadow;
			// TODO cubicCurve.points.toArray() convert to Iterable<Point>
			this._graphics.drawCubicCurve(cubicCurve.points.toArray(), cubicCurve.controlPoints1.toArray(), cubicCurve.controlPoints2.toArray(), cubicCurve.isClosed, cubicCurve.transform);
		}

		public drawQuadraticCurve (quadraticCurve: VgxQuadraticCurve) {
			this._graphics.strokeBrush = quadraticCurve.stroke;
			this.strokeWidth = quadraticCurve.strokeWidth;
			this._graphics.fillBrush = quadraticCurve.fill;
			this._graphics.shadow = quadraticCurve.shadow;
			// TODO quadraticCurve.points.toArray() convert to Iterable<Point>
			this._graphics.drawQuadraticCurve(quadraticCurve.points.toArray(), quadraticCurve.controlPoints.toArray(), quadraticCurve.isClosed, quadraticCurve.transform);
		}

		public drawImage (image: VgxImage) {
			this._graphics.strokeBrush = image.stroke;
			this.strokeWidth = image.strokeWidth;
			this._graphics.shadow = image.shadow;
			this._graphics.drawImage(image.source, image.insertPointX, image.insertPointY, image.width, image.height, image.transform);
		}

		public drawText (text: VgxText, measure: boolean = false) {
			this._graphics.strokeBrush = text.stroke;
			this.strokeWidth = text.strokeWidth;
			this._graphics.fillBrush = text.fill;
			this._graphics.shadow = text.shadow;
			this._graphics.fontFamily = text.fontFamily;
			this._graphics.fontSize = text.fontSize + "px";
			this._graphics.textAlign = text.alignment;
			this._graphics.textBaseline = text.baseline;
			this._graphics.drawText(text.insertPointX, text.insertPointY, text.source, text.transform);
			if (measure)
            	return this._graphics.measureText(text.source);
		}

		public drawPath (path: VgxPath) {
			this._graphics.strokeBrush = path.stroke;
			this.strokeWidth = path.strokeWidth;
			this._graphics.fillBrush = path.fill;
			this._graphics.shadow = path.shadow;
			for (const path2D of path.figures) {
				this._graphics.drawPath2D(path.insertPointX, path.insertPointY, path2D, path.fillRule, path.transform);
			}
		}

		public drawPie (pie: VgxPie) {
			this._graphics.strokeBrush = pie.stroke;
			this.strokeWidth = pie.strokeWidth;
			this._graphics.fillBrush = pie.fill;
			this._graphics.shadow = pie.shadow;
			this._graphics.drawPie(pie.insertPointX, pie.insertPointY, pie.radius, pie.startAngleRad, pie.endAngleRad, pie.isAntiClockwise, pie.transform);
		}

		public drawDonut (donut: VgxDonut) {
			this._graphics.strokeBrush = donut.stroke;
			this.strokeWidth = donut.strokeWidth;
			this._graphics.fillBrush = donut.fill;
			this._graphics.shadow = donut.shadow;
			this._graphics.drawDonut(donut.insertPointX, donut.insertPointY, donut.startRadius, donut.endRadius, donut.startAngleRad, donut.endAngleRad, donut.isAntiClockwise, donut.transform);
		}

		public drawGroup (group: VgxGroup) {
			this._graphics.strokeBrush = group.stroke;
			this.strokeWidth = group.strokeWidth;
			this._graphics.fillBrush = group.fill;
			this._graphics.shadow = group.shadow;

			var t = new Cgx.Transform();
			t.translationX = group.insertPointX;
			t.translationY = group.insertPointY;
			this._graphics.pushTransform(t);

			// for (const child of group.children) {
			// 	if (<VgxDrawable>child) {
			// 		if ((<VgxDrawable>child).visible) {
			// 			(<VgxDrawable>child).draw(this);
			// 		}
			// 	}
			// }
			this._drawEntityCollection(group.children);

			this._graphics.popTransform();
		}

		public drawView (view: VgxView) {
			this._graphics.strokeBrush = view.stroke;
			this.strokeWidth = view.strokeWidth;
			this._graphics.fillBrush = view.fill;
			this._graphics.shadow = view.shadow;

			const hasClipBounds = view.clip && !Rect.isEmpty(view.clipBounds);

			var t = new Cgx.Transform();
			t.translationX = view.insertPointX;
			t.translationY = view.insertPointY;
			this._graphics.pushTransform(t);

			if (hasClipBounds)
			{
				this._graphics.clipRect(view.clipBounds.x, view.clipBounds.y, view.clipBounds.width, view.clipBounds.height);
			}

			// for (const child of view.children) {
			// 	if (<VgxDrawable>child) {
			// 		if ((<VgxDrawable>child).visible) {
			// 			(<VgxDrawable>child).draw(this);
			// 		}
			// 	}
			// }
			this._drawEntityCollection(view.children);

			if (hasClipBounds)
			{
				this._graphics.strokeBrush = view.stroke;
				this.strokeWidth = view.strokeWidth;
				this._graphics.drawRectangle(view.clipBounds.x, view.clipBounds.y, view.clipBounds.width, view.clipBounds.height);
			}

			this._graphics.popTransform();
		}

		public drawAxes () {
			var localOrigin = this._viewTransform.globalToLocalPoint(0, 0);
			this.strokeWidth = 1;
			this._graphics.strokeBrush = "rgba(255,0,0,0.5)";
			this._graphics.drawLine(0, localOrigin.y, this._graphics.canvasBuffer.width, localOrigin.y);
			this._graphics.strokeBrush = "rgba(0,255,0,0.5)";
			this._graphics.drawLine(localOrigin.x, 0, localOrigin.x, this._graphics.canvasBuffer.height);
		}

		// public drawSymbol (symbol: VgxSymbol) {
		// 	this._graphics.strokeBrush = symbol.stroke;
		// 	this.strokeWidth = symbol.strokeWidth;
		// 	this._graphics.fillBrush = symbol.fill;
		// 	this._graphics.shadow = symbol.shadow;
		// 	this._graphics.drawSymbol(symbol.insertPointX, symbol.insertPointY, symbol.width, symbol.height, symbol.data);
		// }


		public drawDrawing(drawing: Drawing) {

			if (!drawing.artboard) {
				if (drawing.background) {
					this.clear(drawing.background);
				} else {
					this.clear();
				}
			}
			else {
				this.clear(drawing.artboard.background);
			}

			this._beginRender();

			if (drawing.artboard) {
				this.drawArtboard(drawing.artboard, drawing.background);
				if (drawing.artboard.clipContent) {
					this._graphics.clipRect(drawing.artboard.bounds.x, drawing.artboard.bounds.y, drawing.artboard.bounds.width, drawing.artboard.bounds.height);
				}
			}

			var children = drawing.getChildren();
			// for (const child of children) {
			// 	if (<VgxDrawable>child) {
			// 		if ((<VgxDrawable>child).visible) {
			// 			// TODO: check view intersection
			// 			(<VgxDrawable>child).draw(this);
			// 		}
			// 	}
			// }
			this._drawEntityCollection(children);

			this._endRender();
		}

		private _drawEntityCollection(collection: VgxEntityCollection) {
			for (const child of collection) {
				if (<VgxDrawable>child) {
					if ((<VgxDrawable>child).visible) {
						// TODO: check view intersection
						(<VgxDrawable>child).draw(this);
					}
				}
			}
		}


		public measureText(text: string) { return this._graphics.measureText(text); }

		public pushTransform(transform: Transform) { return this._graphics.pushTransform(transform); }

		public popTransform() { return this._graphics.popTransform(); }
	}
}