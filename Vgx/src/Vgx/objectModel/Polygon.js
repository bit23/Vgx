
/// <reference path="../../Extra/Collection.js" />
/// <reference path="Entity.js" />

(function (lib) {

    var Polygon = (function () {
        function Polygon() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _points = new lib.Extra.Collection();

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
            //    }
            //});
            Object.defineProperty(this, "insertPointX", {
                configurable: false,
                get: function () { return _points.at(0).x; },
                set: function (v) {
                    var firstPoint = _points.at(0);
                    var dx = v - firstPoint.x;
                    _points.forEach(function (v, i, a) {
                        v.x += dx;
                    });
                }
            });
            Object.defineProperty(this, "insertPointY", {
                configurable: false,
                get: function () { return _points.at(0).y; },
                set: function (v) {
                    var firstPoint = _points.at(0);
                    var dy = v - firstPoint.y;
                    _points.forEach(function (v, i, a) {
                        v.y += dy;
                    });
                }
            });

            Object.defineProperty(this, "points", {
                get: function () { return _points; }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawPolygon(_self);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    return lib.Vgx.MathUtils.getPointsBounds(_points.toArray());
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        return lib.Vgx.MathUtils.getPointsBounds(_points.toArray());
            //    }
            //});
        }

        Polygon.prototype = Object.create(lib.Vgx.Entity.prototype);
        Polygon.prototype.constructor = Polygon;

        return Polygon;
    })();
    lib.Vgx.Polygon = Polygon;

})(library);