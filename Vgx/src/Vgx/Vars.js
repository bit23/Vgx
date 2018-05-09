/// <reference path="PointDefinition.js" />
/// <reference path="DrawingContext.js" />

(function (lib) {

    var Vars = (function () {

        var Vars = {};

        var _pointType = lib.Vgx.PointDefinitions.type1;
        var _pointSize = 20;

        var _fontFamily = "Arial";
        var _fontSize = 16;

        var _vertexSize = 4;
        var _vertexFill = "#ddeeff";
        var _vertexStroke = "#8888ff";
        var _vertexStrokeWidth = 1.3;


        Object.defineProperty(Vars, "defaultStrokeStyle", {
            value: "transparent",
            writable: true
        });

        Object.defineProperty(Vars, "defaultStrokeWidth", {
            value: 0,
            writable: true
        });

        Object.defineProperty(Vars, "defaultFillStyle", {
            value: 0xffffff,
            writable: true
        });

        Object.defineProperty(Vars, "pointType", {
            get: function () { return _pointType; },
            set: function (v) {
                if (!(v instanceof lib.Vgx.PointDefinition))
                    return;
                _pointType = v;
            }
        });

        Object.defineProperty(Vars, "pointSize", {
            get: function () { return _pointSize; },
            set: function (v) {
                if (!v || typeof v !== "number")
                    return;
                _pointSize = v;
            }
        });

        Object.defineProperty(Vars, "fontFamily", {
            get: function () { return _fontFamily; },
            set: function (v) {
                if (!v || typeof v !== "string")
                    return;
                _fontFamily = v;
            }
        });

        Object.defineProperty(Vars, "fontSize", {
            get: function () { return _fontSize; },
            set: function (v) {
                if (!v || typeof v !== "number")
                    return;
                _fontSize = v;
            }
        });

        Object.defineProperty(Vars, "vertexSize", {
            get: function () { return _vertexSize; },
            set: function (v) {
                if (!v || typeof v !== "number")
                    return;
                _vertexSize = v;
            }
        });

        Object.defineProperty(Vars, "vertexFillColor", {
            get: function () { return _vertexFill; },
            set: function (v) {
                var valueType = typeof v;
                if (valueType !== "string" && valueType !== "number" && !(v instanceof Brush))
                    return;
                _vertexFill = v;
            }
        });

        Object.defineProperty(Vars, "vertexStrokeColor", {
            get: function () { return _vertexStroke; },
            set: function (v) {
                var valueType = typeof v;
                if (valueType !== "string" && valueType !== "number" && !(v instanceof Brush))
                    return;
                _vertexStroke = v;
            }
        });

        Object.defineProperty(Vars, "vertexStrokeWidth", {
            get: function () { return _vertexStrokeWidth; },
            set: function (v) {
                var valueType = typeof v;
                if (valueType !== "number")
                    return;
                _vertexStrokeWidth = v;
            }
        });

        return Vars;
    })();
    lib.Vgx.Vars = Vars;

})(library);