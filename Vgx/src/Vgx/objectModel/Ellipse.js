/// <reference path="Entity.js" />

(function (lib) {

    var Ellipse = (function () {

        function Ellipse() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _xRadius = 0;
            var _yRadius = 0;

            Object.defineProperty(this, "xRadius", {
                get: function () { return _xRadius; },
                set: function (v) {
                    if (_xRadius != v) {
                        _xRadius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "yRadius", {
                get: function () { return _yRadius; },
                set: function (v) {
                    if (_yRadius != v) {
                        _yRadius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawEllipse(_self);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, 0, -_self.yRadius));
                    //drawingContext.drawVertex(_self.insertPoint);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, _self.xRadius, 0));
                }
            });

            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var x = _self.insertPointX - _xRadius;
                    var y = _self.insertPointY - _yRadius;
                    var w = _xRadius * 2;
                    var h = _yRadius * 2;
                    return new lib.Vgx.Rect(x, y, w, h);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var x = _self.insertPointX - _xRadius;
            //        var y = _self.insertPointY - _yRadius;
            //        var w = _xRadius * 2;
            //        var h = _yRadius * 2;
            //        return new lib.Vgx.Rect(x, y, w, h);
            //    }
            //});
        }

        Ellipse.prototype = Object.create(lib.Vgx.Entity.prototype);
        Ellipse.prototype.constructor = Ellipse;

        return Ellipse;
    })();
    lib.Vgx.Ellipse = Ellipse;

})(library);