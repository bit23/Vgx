
/// <reference path="../../Extra/Collection.js" />
/// <reference path="../MathUtils.js" />
/// <reference path="Entity.js" />


(function (lib) {

    var CubicCurve = (function () {

        function CubicCurve() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _points = new lib.Extra.Collection();
            var _controlsPoints1 = new lib.Extra.Collection();
            var _controlsPoints2 = new lib.Extra.Collection();
            var _isClosed = false;

            // @override @sealed
            //Object.defineProperty(this, "insertPoint", {
            //    configurable: false,
            //    get: function () { return _points.at(0); },
            //    set: function (v) {
            //        var firstPoint = _points.at(0);
            //        var dx = v.x - firstPoint.x;
            //        var dy = v.y - firstPoint.y;
            //        _points.forEach(function (v, i, a) {
            //            v.x += dx;
            //            v.y += dy;
            //        });
            //        _controlsPoints1.forEach(function (v, i, a) {
            //            v.x += dx;
            //            v.y += dy;
            //        });
            //        _controlsPoints2.forEach(function (v, i, a) {
            //            v.x += dx;
            //            v.y += dy;
            //        });
            //    }
            //});
            Object.defineProperty(this, "insertPointX", {
                configurable: false,
                get: function () { return _points.length > 0 ? _points.at(0).x : 0; },
                set: function (v) {
                    var firstPoint = _points.at(0);
                    var dx = v - firstPoint.x;
                    _points.forEach(function (p, i, a) {
                        p.x += dx;
                    });
                    _controlsPoints1.forEach(function (p, i, a) {
                        p.x += dx;
                    });
                    _controlsPoints2.forEach(function (p, i, a) {
                        p.x += dx;
                    });
                }
            });
            Object.defineProperty(this, "insertPointY", {
                configurable: false,
                get: function () { return _points.length > 0 ? _points.at(0).y : 0; },
                set: function (v) {
                    var firstPoint = _points.at(0);
                    var dy = v - firstPoint.y;
                    _points.forEach(function (p, i, a) {
                        p.y += dy;
                    });
                    _controlsPoints1.forEach(function (p, i, a) {
                        p.y += dy;
                    });
                    _controlsPoints2.forEach(function (p, i, a) {
                        p.y += dy;
                    });
                }
            });


            Object.defineProperty(this, "points", {
                get: function () { return _points; }
            });

            Object.defineProperty(this, "controlPoints1", {
                get: function () { return _controlsPoints1; }
            });

            Object.defineProperty(this, "controlPoints2", {
                get: function () { return _controlsPoints2; }
            });

            Object.defineProperty(this, "isClosed", {
                get: function () { return _isClosed; },
                set: function (v) {
                    v = !!v;
                    if (_isClosed != v) {
                        _isClosed = v;
                        _self.geometryDirty = true;
                    }
                }
            });


            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawCubicCurve(_self);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var allBoundsPoints = new Array();
                    allBoundsPoints.concat(_points.toArray());
                    allBoundsPoints.concat(_controlsPoints1.toArray());
                    allBoundsPoints.concat(_controlsPoints2.toArray());
                    return lib.Vgx.MathUtils.getPointsBounds(allBoundsPoints);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var allBoundsPoints = new Array();
            //        allBoundsPoints.concat(_controlsPoints1.toArray());
            //        allBoundsPoints.concat(_controlsPoints2.toArray());
            //        return lib.Vgx.MathUtils.getPointsBounds(allBoundsPoints);
            //    }
            //});
        }

        CubicCurve.prototype = Object.create(lib.Vgx.Entity.prototype);
        CubicCurve.prototype.constructor = CubicCurve;

        Object.defineProperty(CubicCurve, "fromPoints", {
            value: function (points, isClosed) {
                var cubicCurveSegments = lib.Vgx.MathUtils.interpolatePointWithCubicCurves(points, isClosed);
                var result = new CubicCurve();
                result.points.add(points[0]);
                for (var i = 0; i < cubicCurveSegments.length; i++) {
                    var segment = cubicCurveSegments[i];
                    result.controlPoints1.add(segment.firstControlPoint);
                    result.controlPoints2.add(segment.secondControlPoint);
                    result.points.add(segment.endPoint);
                }
                return result;
            }
        });

        return CubicCurve;
    })();
    lib.Vgx.CubicCurve = CubicCurve;

})(library);