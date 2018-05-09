/// <reference path="../Vars.js" />
/// <reference path="Entity.js" />

(function (lib) {

    var Text = (function () {

        function Text() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _fontFamily = lib.Vgx.Vars.fontFamily;
            var _fontSize = lib.Vgx.Vars.fontSize;
            var _text = "";
            var _textAlign = "left";
            var _textBaseline = "alphabetic";
            var _textMeasure = null;


            function getBaselineOffset(textMetrics) {
                switch (_textBaseline) {
                    case "top":
                        return 0;
                    case "hanging":
                        // TODO:
                        return textMetrics.height * 0.1951;
                    case "middle":
                        return textMetrics.height * 0.5;
                    case "alphabetic":
                        // TODO:
                        return textMetrics.height * 0.8;
                    case "ideographic":
                    // TODO:
                    case "bottom":
                        return textMetrics.height;
                    default:
                        throw new Error("invalid textBaseline");
                }
            }


            // @override
            Object.defineProperty(this, "_getPath", {
                configurable: false,
                value: function () {
                    if (_path == null || _self.geometryDirty) {
                        //_path = new Path2D();
                        //_path.rect(0, 0, _self.width, _self.height);
                        throw new Error("not implemented");
                    }
                    return _path;
                }
            });

            // @override
            Object.defineProperty(this, "_getVertices", {
                configurable: false,
                value: function () {
                    return [
                        {
                            x: _self.insertPointX,
                            y: _self.insertPointY,
                        }
                        /*, TODO
                        {
                            x: _self.insertPoint.x + _self.width,
                            y: _self.insertPoint.y + _self.height,
                        }*/
                    ]
                }
            });


            Object.defineProperty(this, "fontFamily", {
                get: function () { return _fontFamily; },
                set: function (v) {
                    if (typeof v !== "string")
                        return;
                    if (_fontFamily != v) {
                        _fontFamily = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "fontSize", {
                get: function () { return _fontSize; },
                set: function (v) {
                    if (typeof v !== "number")
                        return;
                    if (_fontSize != v) {
                        _fontSize = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "text", {
                get: function () { return _text; },
                set: function (v) {
                    if (typeof v !== "string" && typeof v !== "undefined")
                        return;
                    if (_text != v) {
                        _text = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "textAlign", {
                get: function () { return _textAlign; },
                set: function (v) {
                    if (_textAlign != v) {
                        _textAlign = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "textBaseline", {
                get: function () { return _textBaseline; },
                set: function (v) {
                    // "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom"
                    /*
                    "top"
                    The text baseline is the top of the em square.
                    "hanging"
                    The text baseline is the hanging baseline. (Used by Tibetan and other Indic scripts.)
                    "middle"
                    The text baseline is the middle of the em square.
                    "alphabetic" (default value)
                    The text baseline is the normal alphabetic baseline.
                    "ideographic"
                    The text baseline is the ideographic baseline; this is the bottom of the body of the characters, if the main body of characters protrudes beneath the alphabetic baseline. (Used by Chinese, Japanese and Korean scripts.)
                    "bottom"
                    The text baseline is the bottom of the bounding box. This differs from the ideographic baseline in that the ideographic baseline doesn't consider descenders.
                    */
                    if (_textBaseline != v) {
                        _textBaseline = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawText(_self, true);
                    //drawingContext.drawVertices(
                    //    [
                    //        _self.insertPoint,
                    //        { x: _self.insertPoint.x + _textMeasure.width, y: _self.insertPoint.y /*+ _self.fontSize*/ }
                    //    ],
                    //    _self.transform,
                    //    _self.insertPoint.x,
                    //    _self.insertPoint.y
                    //);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    _textMeasure = lib.Vgx.TextUtils.measureText(_self.text, _self.fontFamily, _self.fontSize);
                    var baselineOffset = getBaselineOffset(_textMeasure);
                    return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY - baselineOffset, _textMeasure ? _textMeasure.width : 0, _textMeasure ? _textMeasure.height : 0);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        // TODO:
            //        _textMeasure = lib.Vgx.TextUtils.measureText(_self.text, _self.fontFamily, _self.fontSize);
            //        var baselineOffset = getBaselineOffset(_textMeasure);
            //        return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY - baselineOffset, _textMeasure ? _textMeasure.width : 0, _textMeasure ? _textMeasure.height : 0);
            //    }
            //});
        }

        Text.prototype = Object.create(lib.Vgx.Entity.prototype);
        Text.prototype.constructor = Text;

        return Text;
    })();
    lib.Vgx.Text = Text;

})(library);