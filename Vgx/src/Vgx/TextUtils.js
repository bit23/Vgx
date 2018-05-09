
/// <reference path="../Cgx/Engine.js" />

(function (lib) {

    var TextUtils = (function () {

        var TextUtils = {};

        var _canvasBuffer = lib.Cgx.Engine.createCanvasBuffer(1, 1);
        var _context = _canvasBuffer.getContext("2d");


        function estimateFontHeight() {

            if (TextUtils.fastHeightEstimation) {
                return measureTextWidth("M");
            }
            else {
                throw new Error("not implemented");
            }
        };

        function measureTextWidth(text) {
            return _context.measureText(text).width;
        }


        Object.defineProperty(TextUtils, "measureText", {
            value: function (text, fontFamily, fontSize) {
                _context.font = fontSize + "px " + fontFamily;
                return {
                    width: measureTextWidth(text),
                    height: estimateFontHeight()
                };
            }
        });

        Object.defineProperty(TextUtils, "fastHeightEstimation", {
            value: true,
            writable: true
        });


        return TextUtils;
    })();
    lib.Vgx.TextUtils = TextUtils;

})(library);