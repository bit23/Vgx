/// <reference path="Entity.js" />

(function (lib) {

    var Triangle = (function () {
        function Triangle() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _point1;
            var _point2;
            var _point3;

            // @override @sealed
            //Object.defineProperty(this, "insertPoint", {
            //    configurable: false,
            //    get: function () { return _point1; },
            //    set: function (v) {
            //        var dx = v.x - _point1.x;
            //        var dy = v.y - _point1.y;
            //        _point1.x = v.x;
            //        _point1.y = v.y;
            //        _point2.x += dx;
            //        _point2.y += dy;
            //        _point3.x += dx;
            //        _point3.y += dy;
            //    }
            //});
            Object.defineProperty(this, "insertPointX", {
                configurable: false,
                get: function () { return _point1.x; },
                set: function (v) {
                    var dx = v - _point1.x;
                    _point1.x = v;
                    _point2.x += dx;
                    _point3.x += dx;
                }
            });
            Object.defineProperty(this, "insertPointY", {
                configurable: false,
                get: function () { return _point1.y; },
                set: function (v) {
                    var dy = v - _point1.y;
                    _point1.y = v;
                    _point2.y += dy;
                    _point3.y += dy;
                }
            });

            Object.defineProperty(this, "point1", {
                get: function () { return _point1; },
                set: function (v) {
                    if (_point1 != v) {
                        _point1 = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "point2", {
                get: function () { return _point2; },
                set: function (v) {
                    if (_point2 != v) {
                        _point2 = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "point3", {
                get: function () { return _point3; },
                set: function (v) {
                    if (_point3 != v) {
                        _point3 = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawTriangle(_self);
                    //drawingContext.drawVertex(_point1);
                    //drawingContext.drawVertex(_point2);
                    //drawingContext.drawVertex(_point3);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var minX = Number.MAX_VALUE;
                    var minY = Number.MAX_VALUE;
                    var maxX = Number.MIN_VALUE;
                    var maxY = Number.MIN_VALUE;
                    var points = [_point1, _point2, _point3];
                    for (var i = 0; i < points.length; i++) {
                        var p = points[i];
                        minX = Math.min(minX, p.x);
                        minY = Math.min(minY, p.y);
                        maxX = Math.max(maxX, p.x);
                        maxY = Math.max(maxY, p.y);
                    }
                    return new lib.Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var minX = Number.MAX_VALUE;
            //        var minY = Number.MAX_VALUE;
            //        var maxX = Number.MIN_VALUE;
            //        var maxY = Number.MIN_VALUE;
            //        var points = [_point1, _point2, _point3];
            //        for (var i = 0; i < points.length; i++) {
            //            var p = points[i];
            //            minX = Math.min(minX, p.x);
            //            minY = Math.min(minY, p.y);
            //            maxX = Math.max(maxX, p.x);
            //            maxY = Math.max(maxY, p.y);
            //        }
            //        return new lib.Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
            //    }
            //});
        }

        Triangle.prototype = Object.create(lib.Vgx.Entity.prototype);
        Triangle.prototype.constructor = Triangle;

        return Triangle;
    })();
    lib.Vgx.Triangle = Triangle;

})(library);