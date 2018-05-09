
/// <reference path="../Vars.js" />
/// <reference path="Symbol.js" />

(function (lib) {

    var Point = (function () {

        function Point(x, y) {
            lib.Vgx.Symbol.call(this);
            //lib.Vgx.Entity.call(this);

            var _self = this;

            this.insertPointX = x || 0;
            this.insertPointY = y || 0;


            function getPointDefinition() {
                var pointDefinition = lib.Vgx.Vars.pointType;
                if (_self.pointType != null && _self.pointType != "") {
                    if (_self.pointType in lib.Vgx.PointDefinitions) {
                        pointDefinition = lib.Vgx.PointDefinitions[_self.pointType];
                    }
                }
                return pointDefinition;
            }


            Object.defineProperty(this, "pointType", {
                writable: true,
                value: ""
            });


            // @override @sealed
            Object.defineProperty(this, "drawSymbol", {
                configurable: false,
                value: function (drawingContext) {
                    //drawingContext.drawPoint(_self);

                    var pointDefinition = getPointDefinition();
                    var pointPath = pointDefinition._getPath(); // TODO .clone()
                    pointPath.fill = null;
                    pointPath.stroke = _self.stroke;
                    pointPath.strokeWidth = _self.strokeWidth / lib.Vgx.Vars.pointSize;
                    pointPath.shadow = _self.shadow;
                    pointPath.transform.scaleX = lib.Vgx.Vars.pointSize;
                    pointPath.transform.scaleY = lib.Vgx.Vars.pointSize;

                    drawingContext.drawPath(pointPath);
                }
            });

            //// @override @sealed
            //Object.defineProperty(this, "draw", {
            //    configurable: false,
            //    value: function (drawingContext) {
            //        drawingContext.drawPoint(_self);
            //    }
            //});


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var halfSize = lib.Vgx.Vars.pointSize * 0.5;
                    var result = new lib.Vgx.Rect();
                    result.x = _self.insertPointX - halfSize;
                    result.y = _self.insertPointY - halfSize;
                    result.width = lib.Vgx.Vars.pointSize;
                    result.height = lib.Vgx.Vars.pointSize;
                    return result;
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        // TODO
            //        return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointX, 0, 0);
            //    }
            //});
        }

        Point.prototype = Object.create(Symbol.prototype);
        Point.prototype.constructor = Point;

        return Point;
    })();
    lib.Vgx.Point = Point;

})(library);