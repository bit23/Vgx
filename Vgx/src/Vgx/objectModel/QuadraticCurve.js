
/// <reference path="../../Extra/Collection.js" />
/// <reference path="../MathUtils.js" />
/// <reference path="Entity.js" />


(function (lib) {

    var QuadraticCurve = (function () {
        function QuadraticCurve() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _points = new lib.Extra.Collection();
            var _controlsPoints = new lib.Extra.Collection();
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
            //        _controlsPoints.forEach(function (v, i, a) {
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
                    _controlsPoints.forEach(function (p, i, a) {
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
                    _controlsPoints.forEach(function (p, i, a) {
                        p.y += dy;
                    });
                }
            });

            Object.defineProperty(this, "points", {
                get: function () { return _points; }
            });

            Object.defineProperty(this, "controlPoints", {
                get: function () { return _controlsPoints; }
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
                    drawingContext.drawQuadraticCurve(_self);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var allBoundsPoints = new Array();
                    allBoundsPoints.concat(_points.toArray());
                    allBoundsPoints.concat(_controlsPoints.toArray());
                    return lib.Vgx.MathUtils.getPointsBounds(allBoundsPoints);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var allBoundsPoints = new Array();
            //        allBoundsPoints.concat(_points.toArray());
            //        allBoundsPoints.concat(_controlsPoints.toArray());
            //        return lib.Vgx.MathUtils.getPointsBounds(allBoundsPoints);
            //    }
            //});
        }

        QuadraticCurve.prototype = Object.create(lib.Vgx.Entity.prototype);
        QuadraticCurve.prototype.constructor = QuadraticCurve;

        /*QuadraticCurve.fromPoints = function (points, isClosed) {
            var quadraticCurveSegments = MathUtils.interpolatePointWithQuadraticCurves(points, isClosed);
            var result = new QuadraticCurve();
            result.points.add(points[0]);
            for (var i = 0; i < quadraticCurveSegments.length; i++) {
                var segment = quadraticCurveSegments[i];
                result.controlPoints1.add(segment.controlPoint);
                result.points.add(segment.endPoint);
            }
            return result;
        };*/

        return QuadraticCurve;
    })();
    lib.Vgx.QuadraticCurve = QuadraticCurve;

})(library);