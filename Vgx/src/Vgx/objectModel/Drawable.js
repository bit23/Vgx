/// <reference path="Object.js" />

(function (lib) {

    var Drawable = (function () {

        function Drawable() {
            lib.Vgx.VgxObject.call(this);

            var _self = this;
            var _visible = true;
            var _appearanceDirty = true;
            var _geometryDirty = true;
            var _positionDirty = true;


            //Object.defineProperty(this, "_addedToDrawing", {
            //    value: function () {
            //        if (_appearanceDirty || _geometryDirty || _positionDirty) {
            //            _self.drawing.isDirty = true;
            //        }
            //    },
            //    configurable: true,
            //    enumerable: false
            //});



            Object.defineProperty(this, "appearanceDirty", {
                get: function () { return _appearanceDirty; },
                set: function (v) {
                    v = !!v;
                    _appearanceDirty = v;
                    if (v && _self.drawing)
                        _self.drawing.isDirty = true;
                }
            });

            Object.defineProperty(this, "geometryDirty", {
                get: function () { return _geometryDirty; },
                set: function (v) {
                    v = !!v;
                    _geometryDirty = v;
                    if (v && _self.drawing)
                        _self.drawing.isDirty = true;
                }
            });

            Object.defineProperty(this, "positionDirty", {
                get: function () { return _positionDirty; },
                set: function (v) {
                    v = !!v;
                    _positionDirty = v;
                    if (v && _self.drawing)
                        _self.drawing.isDirty = true;
                }
            });

            Object.defineProperty(this, "visible", {
                get: function () { return _visible; },
                set: function (v) {
                    if (_visible != v) {
                        _visible = v;
                        _self.appearanceDirty = true;
                        if (_self.drawing)
                            _self.drawing.isDirty = true;
                    }
                }
            });

            // @virtual
            Object.defineProperty(this, "draw", {
                configurable: true,
                value: function (drawingContext) { }
            });
        }

        Drawable.prototype = Object.create(lib.Vgx.VgxObject.prototype);
        Drawable.prototype.constructor = Drawable;

        return Drawable;
    })();
    lib.Vgx.Drawable = Drawable;

})(library);