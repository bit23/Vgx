

(function (lib) {

    var PointDefinition = (function () {

        function PointDefinition(id, figures) {

            var _id = id;
            var _figures = figures;
            var _vgxPath = null;


            function buildPath() {
                _vgxPath = new lib.Vgx.Path();
                // *** copied from DrawingLoader.js
                for (var f = 0; f < _figures.length; f++) {
                    var figure = _figures[f];
                    switch (figure.type) {
                        case "arc":
                            _vgxPath.addArc(figure.insertPointX, figure.insertPointY, figure.radius, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
                            break;
                        case "rect":
                            _vgxPath.addRect(figure.insertPointX, figure.insertPointY, figure.width, figure.height);
                            break;
                        case "ellipse":
                            _vgxPath.addEllipse(figure.insertPointX, figure.insertPointY, figure.radiusX, figure.radiusY, figure.rotation || 0, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
                            break;
                        case "path":
                            _vgxPath.addFigure(figure.data);
                            break;
                    }
                }
                // ***
            }

            Object.defineProperty(this, "_getPath", {
                value: function () {
                    if (_vgxPath == null) {
                        buildPath();
                    }
                    return _vgxPath;
                }
            });


            Object.defineProperty(this, "id", {
                get: function () { return _id; }
            });

            Object.defineProperty(this, "anchorX", { value: 0, writable: true });
            Object.defineProperty(this, "anchorY", { value: 0, writable: true });
        }

        return PointDefinition;

    })();
    lib.Vgx.PointDefinition = PointDefinition;

})(library);

//(function (lib) {

//    var PointDefinition = (function () {

//        function PointDefinition(id, onDrawHandler) {

//            Object.defineProperty(this, "id", {
//                get: function () { return id; }
//            });

//            Object.defineProperty(this, "draw", {
//                get: function () { return onDrawHandler; }
//            });
//        }

//        return PointDefinition;
//    })();
//    lib.Vgx.PointDefinition = PointDefinition;

//})(library);