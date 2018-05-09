/// <reference path="Entity.js" />

(function (lib) {

    var Line = (function () {
        function Line() {
            lib.Vgx.Entity.call(this);

            var _self = this;
            var _startPoint = { x: 0, y: 0 };
            var _endPoint = { x: 0, y: 0 };
            var _path = null;


            // @override
            Object.defineProperty(this, "_getPath", {
                configurable: false,
                value: function () {
                    if (_path == null || _self.geometryDirty) {
                        _path = new Path2D();
                        _path.moveTo(0, 0);
                        _path.lineTo(_self.endPoint.x - _self.insertPoint.x, _self.endPoint.y - _self.insertPoint.y);
                    }
                    return _path;
                }
            });

            // @override
            Object.defineProperty(this, "_getVertices", {
                configurable: false,
                value: function () {
                    return [
                        _self.insertPoint,
                        _self.endPoint
                    ]
                }
            });

            // @override @sealed
            //Object.defineProperty(this, "insertPoint", {
            //    configurable: false,
            //    get: function () { return _startPoint; },
            //    set: function (v) {
            //        var dx = v.x - _startPoint.x;
            //        var dy = v.y - _startPoint.y;
            //        _startPoint.x = v.x;
            //        _startPoint.y = v.y;
            //        _endPoint.x += dx;
            //        _endPoint.y += dy;
            //    }
            //});
            Object.defineProperty(this, "insertPointX", {
                configurable: false,
                get: function () { return _startPoint.x; },
                set: function (v) {
                    var dx = v - _startPoint.x;
                    _startPoint.x = v;
                    _endPoint.x += dx;
                }
            });
            Object.defineProperty(this, "insertPointY", {
                configurable: false,
                get: function () { return _startPoint.y; },
                set: function (v) {
                    var dy = v - _startPoint.y;
                    _startPoint.y = v;
                    _endPoint.y += dy;
                }
            });

            Object.defineProperty(this, "startPoint", {
                get: function () { return _startPoint; },
                set: function (v) {
                    if (_startPoint != v) {
                        _startPoint = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "endPoint", {
                get: function () { return _endPoint; },
                set: function (v) {
                    if (_endPoint != v) {
                        _endPoint = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawLine(_self);
                    //drawingContext.drawVertices([_self.startPoint, _self.endPoint], _self.transform, _self.startPoint.x, _self.startPoint.y);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var minX = Math.min(_self.startPoint.x, _self.endPoint.x);
                    var minY = Math.min(_self.startPoint.y, _self.endPoint.y);
                    var maxX = Math.max(_self.startPoint.x, _self.endPoint.x);
                    var maxY = Math.max(_self.startPoint.y, _self.endPoint.y);
                    return new lib.Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var minX = Math.min(_self.startPoint.x, _self.endPoint.x);
            //        var minY = Math.min(_self.startPoint.y, _self.endPoint.y);
            //        var maxX = Math.max(_self.startPoint.x, _self.endPoint.x);
            //        var maxY = Math.max(_self.startPoint.y, _self.endPoint.y);
            //        return new lib.Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
            //    }
            //});
        }

        Line.prototype = Object.create(lib.Vgx.Entity.prototype);
        Line.prototype.constructor = Line;

        return Line;
    })();
    lib.Vgx.Line = Line;

})(library);