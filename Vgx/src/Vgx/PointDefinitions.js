

(function (lib) {

    var PointDefinitions = (function () {

        var PointDefinitions = {};

        Object.defineProperty(PointDefinitions, "type1", {
            get: function () {
                return new lib.Vgx.PointDefinition(
                    "type1",
                    [
                        {
                            type: "path",
                            data: "M 0.0,0.5 L 1.0,0.5 M 0.5,0.0 L 0.5,1.0"
                        },
                        {
                            type: "ellipse",
                            insertPointX: 0.5,
                            insertPointY: 0.5,
                            radiusX: 0.5,
                            radiusY: 0.5,
                            startAngle: 0,
                            endAngle: 2 * Math.PI
                        }
                    ],
                    0.5,
                    0.5
                )
            }
        });

        Object.defineProperty(PointDefinitions, "type2", {
            get: function () {
                return new lib.Vgx.PointDefinition(
                    "type2",
                    [
                        {
                            type: "path",
                            data: "M -0.353553390,-0.353553390 L 0.353553390,0.353553390 M -0.353553390,0.353553390 L 0.353553390,-0.353553390"
                        },
                        {
                            type: "ellipse",
                            insertPointX: 0.0,
                            insertPointY: 0.0,
                            radiusX: 0.5,
                            radiusY: 0.5,
                            startAngle: 0,
                            endAngle: 2 * Math.PI
                        }
                    ],
                    0.5,
                    0.5
                )
            }
        });

        return PointDefinitions;

    })();
    lib.Vgx.PointDefinitions = PointDefinitions;

})(library);