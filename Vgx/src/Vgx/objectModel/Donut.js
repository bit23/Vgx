/// <reference path="Entity.js" />

(function (lib) {

    var Donut = (function () {

        function Donut() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _degToRad = 0.017453292519943295;

            var _self = this;
            var _startRadius = 0;
            var _endRadius = 0;
            var _startAngle = 0;
            var _endAngle = 0;
            var _startAngleRad = 0;
            var _endAngleRad = 0;
            var _isAntiClockwise = false;


            Object.defineProperty(this, "startRadius", {
                get: function () { return _startRadius; },
                set: function (v) {
                    if (_startRadius != v) {
                        _startRadius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "endRadius", {
                get: function () { return _endRadius; },
                set: function (v) {
                    if (_endRadius != v) {
                        _endRadius = v;
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

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawDonut(_self);
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
                    var xsa = Math.cos(_startAngleRad) * _endRadius;
                    var ysa = Math.sin(_startAngleRad) * _endRadius;
                    var xea = Math.cos(_endAngleRad) * _endRadius;
                    var yea = Math.sin(_endAngleRad) * _endRadius;
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

        Donut.prototype = Object.create(lib.Vgx.Entity.prototype);
        Donut.prototype.constructor = Donut;

        return Donut;
    })();
    lib.Vgx.Donut = Donut;

})(library);