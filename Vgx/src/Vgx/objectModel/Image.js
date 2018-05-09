/// <reference path="Entity.js" />

(function (lib) {

    var Image = (function () {
        function Image() {
            lib.Vgx.Entity.call(this);

            var _self = this;
            var _width = 0;
            var _height = 0;
            var _src = null;
            var _img = null;


            function init() {
                _img = new window.Image();
                _img.onload = onImageLoad;
            }


            function onImageLoad(e) {
                computeDimensions();
                _self.appearanceDirty = true;
                if (_self.drawing)
                    _self.drawing.isDirty = true;
            }

            function computeDimensions() {
                if (_width <= 0 && _height <= 0) {
                    // use natural size
                    _width = _img.naturalWidth;
                    _height = _img.naturalHeight;
                }
                else {
                    var aspect = _img.naturalHeight / _img.naturalWidth;
                    if (_width <= 0) {
                        _width = _height / aspect;
                    }
                    else if (_height <= 0) {
                        _height = _width * aspect;
                    }
                }
            }

            Object.defineProperty(this, "width", {
                get: function () { return _width; },
                set: function (v) {
                    if (_width != v) {
                        _width = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "height", {
                get: function () { return _height; },
                set: function (v) {
                    if (_height != v) {
                        _height = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "src", {
                get: function () { return _src; },
                set: function (v) {
                    if (_src != v) {
                        var oldValue = _src;
                        _src = v;
                        _img.src = _src;
                    }
                }
            });

            Object.defineProperty(this, "image", {
                get: function () { return _img; }
            });


            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawImage(_self);
                    //drawingContext.drawVertex(_self.insertPoint);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, _self.width, _self.height));
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY, _self.width, _self.height);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY, _self.width, _self.height);
            //    }
            //});


            // ctor
            init();
        }

        Image.prototype = Object.create(lib.Vgx.Entity.prototype);
        Image.prototype.constructor = Image;

        return Image;
    })();
    lib.Vgx.Image = Image;

})(library);