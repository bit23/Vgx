
/// <reference path="../../Cgx/Engine.js" />
/// <reference path="../DrawingContext.js" />
/// <reference path="../ViewTransform.js" />
/// <reference path="Entity.js" />
/// <reference path="Drawing.js" />



(function (lib) {

    var Symbol = (function () {
        function Symbol() {
            lib.Vgx.Entity.call(this);

            var _self = this;
            var _needRedraw = true;
            var _symbolCachedImageBitmap = null;
            var _symbolDrawing = null;


            function createBufferedDrawingContext(drawing, width, height) {
                var canvas = lib.Cgx.Engine.createCanvasBuffer(width, height);
                var viewTransform = new lib.Vgx.ViewTransform();
                return new lib.Vgx.DrawingContext(drawing, canvas, viewTransform);
            }

            function drawSymbolCore(onCompleted) {

                if (_symbolCachedImageBitmap != null) {
                    _symbolCachedImageBitmap.close();
                    _symbolCachedImageBitmap = null;
                }

                if (_symbolDrawing == null) {
                    _symbolDrawing = new lib.Vgx.Drawing();
                } else {
                    _symbolDrawing.clear();
                }

                var bounds = _self.getBounds();
                var symbolDrawingContext = createBufferedDrawingContext(_symbolDrawing, bounds.width, bounds.height);
                symbolDrawingContext.clear();
                _self.drawSymbol(symbolDrawingContext);

                var imageData = symbolDrawingContext._getImageData();
                createImageBitmap(imageData).then((imageBitmap) => {
                    _symbolCachedImageBitmap = imageBitmap;
                    _self.appearanceDirty = true;
                });
            }



            // @override @sealed
            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {

                    if (_needRedraw) {
                        _needRedraw = false;
                        drawSymbolCore();
                    }

                    if (_symbolCachedImageBitmap != null) {
                        drawingContext.drawSymbol(_self.insertPointX, _self.insertPointY, _symbolCachedImageBitmap);
                        //drawingContext.drawVertex(_self.insertPointX, _self.insertPointY);
                    }
                }
            });



            // @virtual
            Object.defineProperty(this, "drawSymbol", {
                configurable: true,
                value: function (drawingContext) { }
            });
        }

        Symbol.prototype = Object.create(lib.Vgx.Entity.prototype);
        Symbol.prototype.constructor = Symbol;

        return Symbol;
    })();
    lib.Vgx.Symbol = Symbol;

})(library);