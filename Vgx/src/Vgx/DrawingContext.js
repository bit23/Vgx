
/// <reference path="../Cgx/CoreGraphics.js" />
/// <reference path="objectModel/Drawing.js" />
/// <reference path="ViewTransform.js" />

(function (lib) {

    var DrawingContext = (function () {

        function DrawingContext(drawing, canvas, viewTransform) {

            var _self = this;
            var _canvas = canvas;
            var _drawing = drawing;
            var _viewTransform = viewTransform;
            var _graphics;

            var _scaleStyles = true;
            var _fill = 0xffffffff;
            var _stroke = 0xff000000;
            var _strokeWidth = 1;
            var _shadow;
            var _fontSize = 16;
            var _fontFamily = "Arial";


            function _init() {
                _graphics = new lib.Cgx.CoreGraphics(_canvas);
                _self.shadow = new lib.Vgx.Shadow();
            }


            Object.defineProperty(this, "_beginRender", {
                enumerable: false,
                value: function () {
                    _self.pushTransform(_viewTransform);
                }
            });

            Object.defineProperty(this, "_endRender", {
                enumerable: false,
                value: function () {
                    _self.popTransform();
                }
            });

            Object.defineProperty(this, "_getImageData", {
                enumerable: false,
                value: function () {
                    return _graphics.getImageData();
                }
            });



            Object.defineProperty(this, "drawing", {
                get: function () { return _drawing; }
            });

            Object.defineProperty(this, "scaleStyles", {
                get: function () { return _scaleStyles; },
                set: function (v) {
                    _scaleStyles = !!v;
                }
            });

            Object.defineProperty(this, "shadow", {
                get: function () { return _graphics.getShadow(); },
                set: function (v) {
                    _graphics.setShadow(v);
                }
            });

            Object.defineProperty(this, "fillBrush", {
                get: function () { return _graphics.getFillBrush(); },
                set: function (v) {
                    _graphics.setFillBrush(v);
                }
            });

            Object.defineProperty(this, "strokeBrush", {
                get: function () { return _graphics.getStrokeBrush(); },
                set: function (v) {
                    _graphics.setStrokeBrush(v);
                }
            });

            Object.defineProperty(this, "strokeWidth", {
                get: function () {
                    if (_scaleStyles) {
                        return _graphics.getStrokeWidth();
                    } else {
                        return _graphics.getStrokeWidth() * _viewTransform.viewZoom;
                    }
                },
                set: function (v) {
                    if (_scaleStyles) {
                        _graphics.setStrokeWidth(v);
                    } else {
                        _graphics.setStrokeWidth(v / _viewTransform.viewZoom);
                    }
                }
            });

            Object.defineProperty(this, "fontFamily", {
                get: function () { return _graphics.getFontFamily(); },
                set: function (v) {
                    _graphics.setFontFamily(v);
                }
            });

            Object.defineProperty(this, "fontSize", {
                get: function () { return _graphics.getFontSize(); },
                set: function (v) {
                    _graphics.setFontSize(v);
                }
            });

            Object.defineProperty(this, "textBaseline", {
                get: function () { return _graphics.getTextBaseline(); },
                set: function (v) {
                    _graphics.setTextBaseline(v);
                }
            });


            Object.defineProperty(this, "clear", {
                value: function (optFillBrush) { _graphics.clear(optFillBrush); }
            });




            Object.defineProperty(this, "drawArc", {
                value: function (vgxArc) {
                    _graphics.setStrokeBrush(vgxArc.stroke);
                    _self.strokeWidth = vgxArc.strokeWidth;
                    _graphics.setShadow(vgxArc.shadow);
                    _graphics.drawArc(vgxArc.insertPointX, vgxArc.insertPointY, vgxArc.radius, vgxArc.startAngleRad, vgxArc.endAngleRad, vgxArc.isAntiClockwise, vgxArc.transform);
                }
            });

            Object.defineProperty(this, "drawLine", {
                value: function (vgxLine) {
                    _graphics.setStrokeBrush(vgxLine.stroke);
                    _self.strokeWidth = vgxLine.strokeWidth;
                    _graphics.setShadow(vgxLine.shadow);
                    //_graphics.drawPath2D(vgxLine.insertPointX, vgxLine.insertPointY, vgxLine._getPath(), null, vgxLine.transform);
                    _graphics.drawLine(vgxLine.insertPointX, vgxLine.insertPointY, vgxLine.endPoint.x, vgxLine.endPoint.y, vgxLine.transform);
                }
            });

            Object.defineProperty(this, "drawRectangle", {
                value: function (vgxRectangle) {
                    _graphics.setFillBrush(vgxRectangle.fill);
                    _graphics.setStrokeBrush(vgxRectangle.stroke);
                    _self.strokeWidth = vgxRectangle.strokeWidth;
                    _graphics.setShadow(vgxRectangle.shadow);
                    if (vgxRectangle.cornersRadius === 0) {
                        _graphics.drawRectangle(vgxRectangle.insertPointX, vgxRectangle.insertPointY, vgxRectangle.width, vgxRectangle.height, vgxRectangle.transform);
                    }
                    else {
                        _graphics.drawRoundedRectangle(vgxRectangle.insertPointX, vgxRectangle.insertPointY, vgxRectangle.width, vgxRectangle.height, vgxRectangle.cornersRadius, vgxRectangle.transform);
                    }
                }
            });

            Object.defineProperty(this, "drawSquare", {
                value: function (vgxSquare) {
                    _graphics.setFillBrush(vgxSquare.fill);
                    _graphics.setStrokeBrush(vgxSquare.stroke);
                    _self.strokeWidth = vgxSquare.strokeWidth;
                    _graphics.setShadow(vgxSquare.shadow);
                    if (vgxSquare.cornersRadius === 0) {
                        _graphics.drawSquare(vgxSquare.insertPointX, vgxSquare.insertPointY, vgxSquare.size, vgxSquare.transform);
                    }
                    else {
                        _graphics.drawRoundedRectangle(vgxSquare.insertPointX, vgxSquare.insertPointY, vgxSquare.size, vgxSquare.size, vgxSquare.cornersRadius, vgxSquare.transform);
                    }
                }
            });

            Object.defineProperty(this, "drawCircle", {
                value: function (vgxCircle) {
                    _graphics.setFillBrush(vgxCircle.fill);
                    _graphics.setStrokeBrush(vgxCircle.stroke);
                    _self.strokeWidth = vgxCircle.strokeWidth;
                    _graphics.setShadow(vgxCircle.shadow);
                    _graphics.drawCircle(vgxCircle.insertPointX, vgxCircle.insertPointY, vgxCircle.radius, vgxCircle.transform);
                }
            });

            Object.defineProperty(this, "drawEllipse", {
                value: function (vgxEllipse) {
                    _graphics.setFillBrush(vgxEllipse.fill);
                    _graphics.setStrokeBrush(vgxEllipse.stroke);
                    _self.strokeWidth = vgxEllipse.strokeWidth;
                    _graphics.setShadow(vgxEllipse.shadow);
                    _graphics.drawEllipse(vgxEllipse.insertPointX, vgxEllipse.insertPointY, vgxEllipse.xRadius, vgxEllipse.yRadius, vgxEllipse.transform);
                }
            });

            Object.defineProperty(this, "drawPolyline", {
                value: function (vgxPolyline) {
                    _graphics.setStrokeBrush(vgxPolyline.stroke);
                    _self.strokeWidth = vgxPolyline.strokeWidth;
                    _graphics.setShadow(vgxPolyline.shadow);
                    _graphics.drawPolyline(vgxPolyline.points.toArray(), vgxPolyline.transform);
                }
            });

            Object.defineProperty(this, "drawPolygon", {
                value: function (vgxPolygon) {
                    _graphics.setFillBrush(vgxPolygon.fill);
                    _graphics.setStrokeBrush(vgxPolygon.stroke);
                    _self.strokeWidth = vgxPolygon.strokeWidth;
                    _graphics.setShadow(vgxPolygon.shadow);
                    _graphics.drawPolygon(vgxPolygon.points.toArray(), vgxPolygon.transform);
                }
            });

            Object.defineProperty(this, "drawTriangle", {
                value: function (vgxTriangle) {
                    _graphics.setFillBrush(vgxTriangle.fill);
                    _graphics.setStrokeBrush(vgxTriangle.stroke);
                    _self.strokeWidth = vgxTriangle.strokeWidth;
                    _graphics.setShadow(vgxTriangle.shadow);
                    _graphics.drawTriangle(vgxTriangle.point1, vgxTriangle.point2, vgxTriangle.point3, vgxTriangle.transform);
                }
            });

            Object.defineProperty(this, "drawQuad", {
                value: function (vgxQuad) {
                    _graphics.setFillBrush(vgxQuad.fill);
                    _graphics.setStrokeBrush(vgxQuad.stroke);
                    _self.strokeWidth = vgxQuad.strokeWidth;
                    _graphics.setShadow(vgxQuad.shadow);
                    _graphics.drawQuad(vgxQuad.point1, vgxQuad.point2, vgxQuad.point3, vgxQuad.point4, vgxQuad.transform);
                }
            });

            Object.defineProperty(this, "drawCubicCurve", {
                value: function (vgxCubicCurve) {
                    _graphics.setFillBrush(vgxCubicCurve.fill);
                    _graphics.setStrokeBrush(vgxCubicCurve.stroke);
                    _self.strokeWidth = vgxCubicCurve.strokeWidth;
                    _graphics.setShadow(vgxCubicCurve.shadow);
                    _graphics.drawCubicCurve(vgxCubicCurve.points.toArray(), vgxCubicCurve.controlPoints1.toArray(), vgxCubicCurve.controlPoints2.toArray(), vgxCubicCurve.isClosed, vgxCubicCurve.transform);
                }
            });

            Object.defineProperty(this, "drawQuadraticCurve", {
                value: function (vgxQuadraticCurve) {
                    _graphics.setFillBrush(vgxQuadraticCurve.fill);
                    _graphics.setStrokeBrush(vgxQuadraticCurve.stroke);
                    _self.strokeWidth = vgxQuadraticCurve.strokeWidth;
                    _graphics.setShadow(vgxQuadraticCurve.shadow);
                    _graphics.drawQuadraticCurve(vgxQuadraticCurve.points.toArray(), vgxQuadraticCurve.controlPoints.toArray(), vgxQuadraticCurve.isClosed, vgxQuadraticCurve.transform);
                }
            });

            Object.defineProperty(this, "drawImage", {
                value: function (vgxImage) {
                    _graphics.setStrokeBrush(vgxImage.stroke);
                    _self.strokeWidth = vgxImage.strokeWidth;
                    _graphics.setShadow(vgxImage.shadow);
                    _graphics.drawImage(vgxImage.image, vgxImage.insertPointX, vgxImage.insertPointY, vgxImage.width, vgxImage.height, vgxImage.transform);
                }
            });

            Object.defineProperty(this, "drawText", {
                value: function (vgxText, optMeasure) {
                    optMeasure = !!optMeasure;
                    _graphics.setFillBrush(vgxText.fill);
                    _graphics.setStrokeBrush(vgxText.stroke);
                    _self.strokeWidth = vgxText.strokeWidth;
                    _graphics.setShadow(vgxText.shadow);
                    _graphics.setFontFamily(vgxText.fontFamily);
                    _graphics.setFontSize(vgxText.fontSize);
                    _graphics.setTextAlign(vgxText.textAlign);
                    _graphics.setTextBaseline(vgxText.textBaseline);
                    _graphics.drawText(vgxText.insertPointX, vgxText.insertPointY, vgxText.text, vgxText.transform);
                    if (optMeasure)
                        return _graphics.measureText(vgxText.text);
                }
            });

            Object.defineProperty(this, "drawPath", {
                value: function (vgxPath) {
                    _graphics.setFillBrush(vgxPath.fill);
                    _graphics.setStrokeBrush(vgxPath.stroke);
                    _self.strokeWidth = vgxPath.strokeWidth;
                    _graphics.setShadow(vgxPath.shadow);
                    var listPath2D = vgxPath.figures;
                    for (var i = 0; i < listPath2D.length; i++) {
                        _graphics.drawPath2D(vgxPath.insertPointX, vgxPath.insertPointY, listPath2D[i], vgxPath.fillRule, vgxPath.transform);
                    }
                }
            });

            Object.defineProperty(this, "drawPie", {
                value: function (vgxPie) {
                    _graphics.setFillBrush(vgxPie.fill);
                    _graphics.setStrokeBrush(vgxPie.stroke);
                    _self.strokeWidth = vgxPie.strokeWidth;
                    _graphics.setShadow(vgxPie.shadow);
                    _graphics.drawPie(vgxPie.insertPointX, vgxPie.insertPointY, vgxPie.radius, vgxPie.startAngleRad, vgxPie.endAngleRad, vgxPie.isAntiClockwise, vgxPie.transform);
                }
            });

            Object.defineProperty(this, "drawDonut", {
                value: function (vgxDonut) {
                    _graphics.setFillBrush(vgxDonut.fill);
                    _graphics.setStrokeBrush(vgxDonut.stroke);
                    _self.strokeWidth = vgxDonut.strokeWidth;
                    _graphics.setShadow(vgxDonut.shadow);
                    _graphics.drawDonut(vgxDonut.insertPointX, vgxDonut.insertPointY, vgxDonut.startRadius, vgxDonut.endRadius, vgxDonut.startAngleRad, vgxDonut.endAngleRad, vgxDonut.isAntiClockwise, vgxDonut.transform);
                }
            });

            Object.defineProperty(this, "drawGroup", {
                value: function (vgxGroup) {
                    //_graphics.setFillBrush(vgxGroup.fill);
                    //_graphics.setStrokeBrush(vgxGroup.stroke);
                    //_self.strokeWidth = vgxGroup.strokeWidth;
                    //_graphics.setShadow(vgxGroup.shadow);
                    //vgxGroup.children.forEach(function (v, i, o) {
                    //    v.draw(drawingContext);
                    //})
                    //var listPath2D = vgxPath._getInternalPaths();
                    //for (var i = 0; i < listPath2D.length; i++) {
                    //    _graphics.drawPath2D(vgxPath.insertPointX, vgxPath.insertPointX, listPath2D[i], vgxPath.optFillRule, vgxPath.optTransform);
                    //}

                    _self.strokeWidth = vgxGroup.strokeWidth;
                    _graphics.setStrokeBrush(vgxGroup.stroke);
                    _graphics.setFillBrush(vgxGroup.fill);
                    _graphics.setShadow(vgxGroup.shadow);

                    var t = new lib.Cgx.Transform();
                    t.translationX = vgxGroup.insertPointX;
                    t.translationY = vgxGroup.insertPointY;
                    _graphics.pushTransform(t);
                    vgxGroup.children.forEach(function (v, i, o) {
                        v.draw(_self);
                    });
                    _graphics.popTransform();
                }
            });

            //var _pointTransform = new lib.Cgx.Transform();
            //Object.defineProperty(this, "drawPoint", {
            //    value: function (vgxPoint) {

            //        _graphics.setFillBrush(null);
            //        _graphics.setStrokeBrush(vgxPoint.stroke);
            //        _self.strokeWidth = vgxPoint.strokeWidth / lib.Vgx.Vars.pointSize;
            //        _graphics.setShadow(vgxPoint.shadow);

            //        var pointType = lib.Vgx.Vars.pointType;
            //        if (vgxPoint.pointType != null && vgxPoint.pointType != "") {
            //            if (vgxPoint.pointType in lib.Vgx.PointDefinitions) {
            //                pointType = lib.Vgx.PointDefinitions[vgxPoint.pointType];
            //            }
            //        }

            //        _pointTransform.scaleX = _pointTransform.scaleY = lib.Vgx.Vars.pointSize;

            //        var translation = lib.Vgx.Vars.pointSize * 0.5;
            //        var pointPath = pointType._getPath();
            //        var listPath2D = pointPath.figures;
            //        for (var i = 0; i < listPath2D.length; i++) {
            //            _graphics.drawPath2D(vgxPoint.insertPointX, vgxPoint.insertPointY, listPath2D[i], pointPath.fillRule, _pointTransform);
            //        }
            //    }
            //});


            Object.defineProperty(this, "drawAxes", {
                value: function () {
                    var localOrigin = _viewTransform.globalToLocalPoint(0, 0);
                    _graphics.setStrokeWidth(1);
                    _graphics.setStrokeBrush("rgba(255,0,0,0.5)");
                    _graphics.drawLine(0, localOrigin.y, _canvas.width, localOrigin.y);
                    _graphics.setStrokeBrush("rgba(0,255,0,0.5)");
                    _graphics.drawLine(localOrigin.x, 0, localOrigin.x, _canvas.height);
                }
            });

            Object.defineProperty(this, "drawSymbol", {
                value: function (x, y, symbolData) { _graphics.drawSymbol(x, y, symbolData); }
            });

            //Object.defineProperty(this, "drawVertex", {
            //    value: function (x, y, optTransform, optTransformOriginX, optTransformOriginY) {
            //        _graphics.drawVertex(x, y, optTransform, optTransformOriginX, optTransformOriginY);
            //    }
            //});

            //Object.defineProperty(this, "drawVertices", {
            //    value: function (points, optTransform, optTransformOriginX, optTransformOriginY) {
            //        _graphics.drawVertices(points, optTransform, optTransformOriginX, optTransformOriginY);
            //    }
            //});




            Object.defineProperty(this, "measureText", {
                value: function (text) { return _graphics.measureText(text); }
            });



            Object.defineProperty(this, "pushTransform", {
                value: function (transform) {
                    _graphics.pushTransform(transform);
                }
            });

            //Object.defineProperty(this, "getTransform", {
            //    value: function () {
            //        return _graphics.getTransform();
            //    }
            //});

            Object.defineProperty(this, "popTransform", {
                value: function () {
                    return _graphics.popTransform();
                }
            });


            _init();
        }

        return DrawingContext;

    })();
    lib.Vgx.DrawingContext = DrawingContext;

})(library);