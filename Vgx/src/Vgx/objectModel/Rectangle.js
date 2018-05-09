/// <reference path="Entity.js" />

(function (lib) {

    var Rectangle = (function () {
        function Rectangle() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _width = 0;
            var _height = 0;
            var _cornersRadius = 0;
            var _path = null;
            var _cachedBounds = new lib.Vgx.Rect();


            //function updateCachedBounds() {
            //    var mtx = _self.transform.getMatrix().clone();
            //    mtx.offsetX = -(_self.insertPointX + _self.transform.originX);
            //    mtx.offsetY = -(_self.insertPointY + _self.transform.originY);
            //    _cachedBounds = mtx.transformRect(_self.insertPointX, _self.insertPointY, _self.width, _self.height);
            //}

            

            // abstract override
            Object.defineProperty(this, "_getPath", {
                configurable: false,
                value: function () {
                    if (_path == null || _self.geometryDirty) {
                        _path = new Path2D();
                        _path.rect(0, 0, _self.width, _self.height);
                    }
                    return _path;
                }
            });

            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY, _self.width, _self.height);
                }
            });

            // virtual override
            Object.defineProperty(this, "_getVertices", {
                configurable: false,
                value: function () {
                    return [
                        {
                            x: _self.insertPointX,
                            y: _self.insertPointY,
                        },
                        {
                            x: _self.insertPointX + _self.width,
                            y: _self.insertPointY + _self.height,
                        }
                    ]
                }
            });


            Object.defineProperty(this, "width", {
                get: function () { return _self._getValue("width", _width); },
                set: function (v) {
                    // TODO: handle binding
                    if (_width != v) {
                        _width = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "height", {
                get: function () { return _self._getValue("height", _height); },
                set: function (v) {
                    if (_height != v) {
                        _height = v;
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
                    drawingContext.drawRectangle(_self);
                    //drawingContext.drawVertex(_self.insertPointX, _self.insertPointY, _self.transform);
                    //drawingContext.drawVertex(_self.insertPointX + _self.width, _self.insertPointY + _self.height, _self.transform);
                    //drawingContext.drawVertices(_self._getVertices(), _self.transform);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        if (_self.geometryDirty) {
            //            updateCachedBounds();
            //        }
            //        return _cachedBounds;
            //    }
            //});


        }

        Rectangle.prototype = Object.create(lib.Vgx.Entity.prototype);
        Rectangle.prototype.constructor = Rectangle;

        return Rectangle;
    })();
    lib.Vgx.Rectangle = Rectangle;

})(library);