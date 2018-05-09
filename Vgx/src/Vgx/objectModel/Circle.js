/// <reference path="Entity.js" />

(function (lib) {

    var Circle = (function () {

        function Circle() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _radius = 0;

            Object.defineProperty(this, "radius", {
                get: function () { return _radius; },
                set: function (v) {
                    if (_radius != v) {
                        _radius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawCircle(_self);
                    //drawingContext.drawVertex(_self.insertPointX, _self.insertPointY, _self.transform);
                }
            });

            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var x = _self.insertPointX - _radius;
                    var y = _self.insertPointY - _radius;
                    var w = _radius * 2;
                    var h = _radius * 2;
                    return new lib.Vgx.Rect(x, y, w, h);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var x = _self.insertPointX - _radius;
            //        var y = _self.insertPointY - _radius;
            //        var w = _radius * 2;
            //        var h = _radius * 2;
            //        return new lib.Vgx.Rect(x, y, w, h);
            //    }
            //});
        }

        Circle.prototype = Object.create(lib.Vgx.Entity.prototype);
        Circle.prototype.constructor = Circle;

        return Circle;
    })();
    lib.Vgx.Circle = Circle;

})(library);