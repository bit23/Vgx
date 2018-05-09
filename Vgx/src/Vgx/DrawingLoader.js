
(function (lib) {

    var DrawingLoader = (function () {

        function DrawingLoader() {

            this.loadChildElement = function (child) {

                var typeName = child[0];
                var type = Vgx[typeName];

                if (typeof type !== "function")
                    throw new Error("invalid type name '" + typeName + "'");

                // TODO: migliorare il check
                var instance = new type();
                if (instance == null)
                    throw new Error("invalid type name '" + typeName + "'");

                var childInfo = child[1];
                for (var n in childInfo) {
                    if (!childInfo.hasOwnProperty(n))
                        continue;
                    if (n in instance) {
                        instance[n] = childInfo[n];
                    }
                }

                switch (typeName) {
                    case "Polyline":
                    case "Polygon":
                        if ("points" in childInfo) {
                            for (var p = 0; p < childInfo.points.length; p++) {
                                instance.points.add(childInfo.points[p]);
                            }
                        }
                        break;
                    case "QuadraticCurve":
                        if ("points" in childInfo) {
                            for (var p = 0; p < childInfo.points.length; p++) {
                                instance.points.add(childInfo.points[p]);
                            }
                        }
                        if ("controlPoints" in childInfo) {
                            for (var p = 0; p < childInfo.controlPoints.length; p++) {
                                instance.controlPoints.add(childInfo.controlPoints[p]);
                            }
                        }
                        break;
                    case "CubicCurve":
                        if ("points" in childInfo) {
                            for (var p = 0; p < childInfo.points.length; p++) {
                                instance.points.add(childInfo.points[p]);
                            }
                        }
                        if ("controlPoints1" in childInfo) {
                            for (var p = 0; p < childInfo.controlPoints1.length; p++) {
                                instance.controlPoints1.add(childInfo.controlPoints1[p]);
                            }
                        }
                        if ("controlPoints2" in childInfo) {
                            for (var p = 0; p < childInfo.controlPoints2.length; p++) {
                                instance.controlPoints2.add(childInfo.controlPoints2[p]);
                            }
                        }
                        break;
                    case "Group":
                        if ("children" in childInfo) {
                            for (var c = 0; c < childInfo.children.length; c++) {
                                var childElement = this.loadChildElement(childInfo.children[c]);
                                if (childElement != null)
                                    instance.children.add(childElement);
                            }
                        }
                        break;
                    case "Path":
                        if ("figures" in childInfo) {
                            for (var f = 0; f < childInfo.figures.length; f++) {
                                var figure = childInfo.figures[f];
                                switch (figure.type) {
                                    case "arc":
                                        instance.addArc(figure.insertPointX, figure.insertPointY, figure.radius, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
                                        break;
                                    case "rect":
                                        instance.addRect(figure.insertPointX, figure.insertPointY, figure.width, figure.height);
                                        break;
                                    case "ellipse":
                                        instance.addRect(figure.insertPointX, figure.insertPointY, figure.radiusX, figure.radiusY, figure.rotation || 0, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
                                        break;
                                    case "path":
                                        instance.addFigure(figure.data);
                                        break;
                                }
                            }
                        }
                        break;
                }

                return instance;
            }

            this.loadFromObject = function (jdrawing) {

                if (!("children" in jdrawing))
                    throw new Error("missing 'children' element");

                var drawing = new lib.Vgx.Drawing();

                for (var i = 0; i < jdrawing.children.length; i++) {

                    var child = jdrawing.children[i];
                    var instance = this.loadChildElement(child);
                    drawing.addChild(instance);
                }

                if ("background" in jdrawing) {
                    drawing.background = jdrawing["background"];
                }

                return drawing;
            }
        }

        return new DrawingLoader();
    })();
    lib.Vgx.DrawingLoader = DrawingLoader;

})(library);