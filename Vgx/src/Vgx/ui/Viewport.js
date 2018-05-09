
/// <reference path="../Cgx/Renderer.js" />

/// <reference path="../extra/Events.js" />
/// <reference path="../engine/ViewTransform.js" />

/// <reference path="../../Cgx/Engine.js" />
/// <reference path="../DrawingContext.js" />

(function (lib) {

    var Viewport = (function () {

        function Viewport(optCanvas, optDrawing) {

            const ZOOM_STEP = 0.85;

            var _self = this;
            var _events = new lib.Extra.Events(this);

            var _htmlElement;
            var _canvas;
            var _drawing;

            var _drawingContext;
            var _viewTransform = new lib.Vgx.ViewTransform();

            var _isDirty = true;
            var _needRedraw = true;
            var _onDrag;
            var _lastMouseX;
            var _lastMouseY;
            var _nerverResized = true;
            var _autosize = true;
            var _width = 800;
            var _height = 600;

            var _hasDrawing = false;
            var _drawAxes = false;


            function init() {

                var drawing;

                _htmlElement = window.document.createElement("div");

                if (optCanvas instanceof HTMLCanvasElement) {
                    _canvas = optCanvas;
                }
                else {
                    _canvas = window.document.createElement("canvas");
                }

                _htmlElement.appendChild(_canvas);

                if (optDrawing instanceof lib.Vgx.Drawing) {
                    drawing = optDrawing;
                }
                else {
                    drawing = new lib.Vgx.Drawing();
                }

                _drawingContext = new lib.Vgx.DrawingContext(_drawing, _canvas, _viewTransform);
                _self.drawing = drawing;

                setupMouseEvents();
                window.addEventListener("resize", onResize);

                _viewTransform.setViewTarget(0, 0);

                requestAnimationFrame(onRender);
            }

            function setupMouseEvents() {
                _canvas.addEventListener("mousedown", onMouseDown);
                _canvas.addEventListener("mousemove", onMouseMove);
                _canvas.addEventListener("mouseup", onMouseUp);
                _canvas.addEventListener("wheel", onMouseWheel);
            }

            function checkNeedRedraw() {
                _needRedraw = _isDirty;
                if (_drawing && _drawing.isDirty) {
                    _needRedraw = true;
                    _drawing.isDirty = false;
                }
                _isDirty = false;
            }

            function invalidate() {
                _isDirty = true;
            }

            function render() {

                checkNeverResized();

                if (_needRedraw) {

                    if (_hasDrawing) {

                        if (_drawing.background) {
                            _drawingContext.clear(_drawing.background);
                        } else {
                            _drawingContext.clear();
                        }

                        _drawingContext._beginRender();

                        var children = _drawing.getChildren();
                        for (var i = 0; i < children.length; i++) {
                            var child = children[i];
                            if (child) {
                                if (child.visible) {
                                    // TODO: check view intersection
                                    child.draw(_drawingContext);
                                }
                            }
                        }

                        _drawingContext._endRender();
                    }

                    if (_self.drawAxes)
                        _drawingContext.drawAxes();
                }

                _needRedraw = false;
            }

            function handleViewChanged() {
                _events.raise("onViewChanged", { rect: getCurrentViewBounds() });
            }

            function getCurrentViewBounds() {
                return _viewTransform.getViewBounds();
            }

            function checkNeverResized() {
                if (_htmlElement.parentElement && _nerverResized) {
                    _nerverResized = false;
                    onResize(null);
                }
            }

            function onRender() {

                if (_htmlElement.parentElement != null) {
                    checkNeedRedraw();
                    if (_needRedraw) {
                        //console.log("redraw");
                        render();
                    }
                }

                requestAnimationFrame(onRender);
            }

            function onDrawingDirty() {
                invalidate();
            }

            function onMouseDown(e) {
                if (!_hasDrawing)
                    return;
                _lastMouseX = e.x;
                _lastMouseY = e.y;
                _onDrag = true;
            }

            function onMouseMove(e) {
                if (!_hasDrawing)
                    return;
                if (_onDrag) {
                    var cw = _viewTransform.localToGlobalPoint(e.x, e.y);
                    var lw = _viewTransform.localToGlobalPoint(_lastMouseX, _lastMouseY);
                    var difX = cw.x - lw.x;
                    var difY = cw.y - lw.y;
                    //if (!_viewTransform.isBottomUp)
                    //difY = -difY;
                    _self.move(-difX, -difY);
                }
                _lastMouseX = e.x;
                _lastMouseY = e.y;
            }

            function onMouseUp(e) {
                if (!_hasDrawing)
                    return;
                _onDrag = false;
            }

            function onMouseWheel(e) {
                if (!_hasDrawing)
                    return;
                //var sceneMousePos = _viewTransform.localToGlobalPoint(e.x, e.y);
                if (e.deltaY > 0) {
                    //_self.zoomFrom(ZOOM_STEP, sceneMousePos.x, sceneMousePos.y);
                    _self.zoom(ZOOM_STEP);
                }
                else {
                    //_self.zoomFrom(1 / ZOOM_STEP, sceneMousePos.x, sceneMousePos.y);
                    _self.zoom(1 / ZOOM_STEP);
                }
            }

            function onResize(e) {
                if (_autosize && _htmlElement.parentElement) {
                    _htmlElement.style.width = _htmlElement.parentElement.clientWidth + "px";
                    _htmlElement.style.height = _htmlElement.parentElement.clientHeight + "px";
                }
                else {
                    _htmlElement.style.width = _width + "px";
                    _htmlElement.style.height = _height + "px";
                }

                _canvas.width = _htmlElement.clientWidth;
                _canvas.height = _htmlElement.clientHeight;

                _isDirty = true;
                _viewTransform.setViewPixelSize(_canvas.width, _canvas.height);

                if (!_drawing)
                    return;
                invalidate();
            }

            function onDrawingChanged(oldValue, newValue) {
                if (oldValue != null) {
                    //oldValue.EntitiesCollectionChanged -= Entities_CollectionChanged;
                    oldValue._unregisterDirtyEventHandler(onDrawingDirty);
                }
                _hasDrawing = false;
                if (newValue != null) {
                    _hasDrawing = true;
                    _drawingContext.drawing = newValue;
                    //newValue.EntitiesCollectionChanged += Entities_CollectionChanged;
                    newValue._registerDirtyEventHandler(onDrawingDirty);
                }
                checkNeverResized();
            }
            

            


            //#region Properties

            Object.defineProperty(this, "autosize", {
                get: function () { return _autosize; },
                set: function (v) {
                    v = !!v;
                    if (_autosize != v) {
                        var oldValue = _autosize;
                        _autosize = v;
                        onResize(null);
                    }
                }
            });

            Object.defineProperty(this, "canvas", {
                get: function () { return _canvas; }
            });

            Object.defineProperty(this, "currentZoom", {
                get: function () { return _viewTransform.viewZoom; }
            });

            Object.defineProperty(this, "currentTargetX", {
                get: function () { return _viewTransform.viewTargetX; }
            });

            Object.defineProperty(this, "currentTargetY", {
                get: function () { return _viewTransform.viewTargetY; }
            });

            Object.defineProperty(this, "drawAxes", {
                get: function () { return _drawAxes; },
                set: function (v) {
                    _drawAxes = v;
                    invalidate();
                }
            });

            Object.defineProperty(this, "drawing", {
                get: function () { return _drawing; },
                set: function (v) {
                    if (_drawing != v) {
                        var oldValue = _drawing;
                        _drawing = v;
                        onDrawingChanged(oldValue, _drawing);
                    }
                }
            });

            Object.defineProperty(this, "height", {
                get: function () { return _autosize ? _htmlElement.height : _height; },
                set: function (v) {
                    if (_autosize) {
                        _height = v;
                    }
                    else {
                        if (_height != v) {
                            _height = v;
                            onResize(null);
                        }
                    }
                }
            });

            Object.defineProperty(this, "htmlElement", {
                get: function () { return _htmlElement; }
            });

            //Object.defineProperty(this, "orientation", {
            //    get: function () { return _viewTransform.isBottomUp ? ViewportOrientation.BOTTOM_UP : ViewportOrientation.TOP_DOWN; },
            //    set: function (v) {
            //        switch (v) {
            //            case ViewportOrientation.TOP_DOWN:
            //                _viewTransform.isBottomUp = false;
            //                break;
            //            case ViewportOrientation.BOTTOM_UP:
            //                _viewTransform.isBottomUp = true;
            //                break;
            //            default:
            //                throw new Error("invalid value");
            //        }
            //        invalidate();
            //    }
            //});

            Object.defineProperty(this, "scaleStyles", {
                get: function () { return _drawingContext.scaleStyles; },
                set: function (v) {
                    _drawingContext.scaleStyles = v;
                    invalidate();
                }
            });

            Object.defineProperty(this, "width", {
                get: function () { return _autosize ? _htmlElement.width : _width; },
                set: function (v) {
                    if (_autosize) {
                        _width = v;
                    }
                    else {
                        if (_width != v) {
                            _width = v;
                            onResize(null);
                        }
                    }
                }
            });

            //#endregion


            //#region Methods

            Object.defineProperty(this, "getCursorPosition", {
                value: function () {
                    return _viewTransform.localToGlobalPoint(_lastMouseX, _lastMouseY);
                }
            });

            Object.defineProperty(this, "getCurrentViewBounds", {
                value: function () {
                    return getCurrentViewBounds();
                }
            });

            Object.defineProperty(this, "redraw", {
                value: function () {
                    _isDirty = true;
                    onRender();
                }
            });

            Object.defineProperty(this, "move", {
                value: function (offsetX, offsetY) {
                    _viewTransform.moveViewTarget(offsetX, offsetY);
                    handleViewChanged();
                    invalidate();
                }
            });

            Object.defineProperty(this, "moveTo", {
                value: function (centerX, centerY) {
                    _viewTransform.setViewTarget(centerX, centerY);
                    handleViewChanged();
                    invalidate();
                }
            });

            Object.defineProperty(this, "zoom", {
                value: function (zoomIncrement) {
                    _viewTransform.setViewZoom(_viewTransform.viewZoom * zoomIncrement);
                    handleViewChanged();
                    invalidate();
                }
            });

            Object.defineProperty(this, "zoomTo", {
                value: function (zoomIncrement, centerX, centerY) {
                    _viewTransform.setViewZoomTo(_viewTransform.viewZoom * zoomIncrement, centerX, centerY);
                    handleViewChanged();
                    invalidate();
                }
            });

            Object.defineProperty(this, "zoomAt", {
                value: function (zoomFactor, centerX, centerY) {
                    _viewTransform.setViewZoomTo(zoomFactor, centerX, centerY);
                    handleViewChanged();
                    invalidate();
                }
            });

            Object.defineProperty(this, "zoomAll", {
                value: function () {
                    var drawingBounds = this.drawing.getBounds();
                    if (drawingBounds.width == 0 || drawingBounds.height == 0)
                        return;
                    var drawingAspectRatio = drawingBounds.height / drawingBounds.width;
                    var viewPixelWidth = _canvas.width;
                    var viewPixelHeight = _canvas.height;
                    var viewPixelBounds = new lib.Vgx.Rect(0, 0, viewPixelWidth, viewPixelHeight);
                    var viewAspectRatio = viewPixelHeight / viewPixelWidth;
                    var currentZoom = _viewTransform.viewZoom;
                    var viewGlobalBounds = _viewTransform.localToGlobalRect(viewPixelBounds.x, viewPixelBounds.y, viewPixelBounds.width, viewPixelBounds.height);
                    var zoomFactor = 1.0;
                    if (drawingAspectRatio > viewAspectRatio) {
                        // esegue il 'fit' in altezza
                        zoomFactor = viewGlobalBounds.height / drawingBounds.height;
                    }
                    else {
                        // esegue il 'fit' in larghezza
                        zoomFactor = viewGlobalBounds.width / drawingBounds.width;
                    }
                    var centerX = drawingBounds.x + (drawingBounds.width * 0.5);
                    var centerY = drawingBounds.y + (drawingBounds.height * 0.5);
                    zoomFactor *= 0.9;
                    if (lib.Vgx.MathUtils.isZero(zoomFactor))
                        zoomFactor = 0.1;
                    this.zoomAt(zoomFactor, centerX, centerY);
                }
            });

            //Object.defineProperty(this, "zoomFrom", {
            //    value: function (zoomFactor, x, y) {
            //        _viewTransform._setViewZoomFrom(zoomFactor, x, y);
            //        handleViewChanged();
            //        invalidate();
            //    }
            //});

            //#endregion


            //#region Events

            _events.create("onViewChanged");

            //#endregion


            // ctor
            init();
        }

        return Viewport;
    })();
    lib.Vgx.Viewport = Viewport;

})(library);