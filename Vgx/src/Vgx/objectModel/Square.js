/// <reference path="Entity.js" />

(function (lib) {

    var Square = (function () {

        function Square() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _size = 0;
            var _cornersRadius = 0;
            var _path = null;


            // @override
            Object.defineProperty(this, "_getPath", {
                configurable: false,
                value: function () {
                    if (_path == null || _self.geometryDirty) {
                        _path = new Path2D();
                        _path.rect(0, 0, _self.size, _self.size);
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
                        {
                            x: _self.insertPoint.x + _self.size,
                            y: _self.insertPoint.y + _self.size,
                        }
                    ]
                }
            });


            Object.defineProperty(this, "size", {
                get: function () { return _self._getValue("size", _size); },
                set: function (v) {
                    // TODO: handle binding
                    if (_size != v) {
                        _size = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "cornersRadius", {
                get: function () { return _self._getValue("cornersRadius", _cornersRadius); },
                set: function (v) {
                    if (_cornersRadius != v) {
                        _cornersRadius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawSquare(_self);
                    //drawingContext.drawVertex(_self.insertPointX, _self.insertPointY, _self.transform);
                    //drawingContext.drawVertex(_self.insertPointX + _self.size, _self.insertPointY + _self.size, _self.transform);
                    //drawingContext.drawVertices(_self._getVertices(), _self.transform);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY, _self.size, _self.size);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY, _self.size, _self.size);
            //    }
            //});


        }

        Square.prototype = Object.create(lib.Vgx.Entity.prototype);
        Square.prototype.constructor = Square;

        return Square;
    })();
    lib.Vgx.Square = Square;

})(library);