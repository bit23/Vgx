/// <reference path="Entity.js" />

(function (lib) {

    var Arc = (function () {

        function Arc() {
            lib.Vgx.Entity.call(this);

            var _degToRad = 0.017453292519943295;

            var _self = this;
            var _radius = 0;
            var _startAngle = 0;
            var _endAngle = 0;
            var _startAngleRad = 0;
            var _endAngleRad = 0;
            var _isAntiClockwise = false;


            Object.defineProperty(this, "radius", {
                get: function () { return _radius; },
                set: function (v) {
                    if (_radius != v) {
                        _radius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "startAngle", {
                get: function () { return _startAngle; },
                set: function (v) {
                    if (_startAngle != v) {
                        _startAngle = v;
                        _startAngleRad = v * _degToRad;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "startAngleRad", {
                get: function () { return _startAngleRad; }
            });

            Object.defineProperty(this, "endAngle", {
                get: function () { return _endAngle; },
                set: function (v) {
                    if (_endAngle != v) {
                        _endAngle = v;
                        _endAngleRad = v * _degToRad;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "endAngleRad", {
                get: function () { return _endAngleRad; }
            });

            Object.defineProperty(this, "isAntiClockwise", {
                get: function () { return _isAntiClockwise; },
                set: function (v) {
                    if (_isAntiClockwise != v) {
                        _isAntiClockwise = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            //var boundsRect = new lib.Vgx.Rectangle();
            //boundsRect.stroke = "magenta";
            //boundsRect.strokeWidth = 2;
            //boundsRect.fill = null;

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawArc(_self);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, 0, -_self.radius));
                    //drawingContext.drawVertex(_self.insertPoint);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, _self.radius, 0));

                    //var bounds = _self.getBounds();
                    //boundsRect.insertPointX = bounds.x;
                    //boundsRect.insertPointY = bounds.y;
                    //boundsRect.width = bounds.width;
                    //boundsRect.height = bounds.height;
                    //drawingContext.drawRectangle(boundsRect);
                }
            });

            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    // TODO
                    var xsa = Math.cos(_startAngleRad) * _radius;
                    var ysa = Math.sin(_startAngleRad) * _radius;
                    var xea = Math.cos(_endAngleRad) * _radius;
                    var yea = Math.sin(_endAngleRad) * _radius;
                    var x1 = Math.min(xsa, xea);
                    var y1 = Math.min(ysa, yea);
                    var x2 = Math.max(xsa, xea);
                    var y2 = Math.max(ysa, yea);
                    return new lib.Vgx.Rect(_self.insertPointX + x1, _self.insertPointY + y1, x2 - x1, y2 - y1);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        // TODO
            //        var xsa = Math.cos(_startAngleRad) * _radius;
            //        var ysa = Math.sin(_startAngleRad) * _radius;
            //        var xea = Math.cos(_endAngleRad) * _radius;
            //        var yea = Math.sin(_endAngleRad) * _radius;

            //        var x1 = Math.min(xsa, xea);
            //        var y1 = Math.min(ysa, yea);
            //        var x2 = Math.max(xsa, xea);
            //        var y2 = Math.max(ysa, yea);

            //        return new lib.Vgx.Rect(_self.insertPointX + x1, _self.insertPointY + y1, x2 - x1, y2 - y1);
            //    }
            //});
        }

        Arc.prototype = Object.create(lib.Vgx.Entity.prototype);
        Arc.prototype.constructor = Arc;

        return Arc;
    })();
    lib.Vgx.Arc = Arc;

})(library);