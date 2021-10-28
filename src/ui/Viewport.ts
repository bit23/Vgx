
namespace Vgx {

    export interface ViewChangedEventArgs extends EventArgs
    {
        rect: Rect;
    }

    export class Viewport {
        
        private readonly ZOOM_STEP = 0.85;

        private _events = new EventsManager(this);

        private _htmlElement: HTMLElement;
        private _canvas: Cgx.CanvasSurface;
        private _drawing: Drawing;
        private _drawingContext: DrawingContext;
        private _viewTransform = new ViewTransform();
        private _isDirty = true;
        private _needRedraw = true;
        private _onDrag: boolean;
        private _lastMouseX: number;
        private _lastMouseY: number;
        private _nerverResized = true;
        private _autosize = true;
        private _width = 800;
        private _height = 600;
        private _hasDrawing = false;
        private _drawAxes = false;


        constructor(canvas?: Cgx.CanvasSurface, drawing?: Drawing) {

            this._htmlElement = window.document.createElement("div");

            if (canvas instanceof HTMLCanvasElement) {
                this._canvas = canvas;
            }
            else {
                this._canvas = window.document.createElement("canvas");
            }

            this._htmlElement.appendChild(this._canvas);

            if (drawing == null) {
                drawing = new Drawing();
            }

            this._drawingContext = new DrawingContext(this._drawing, this._canvas, this._viewTransform);
            this.drawing = drawing;

            this._setupMouseEvents();
            window.addEventListener("resize", this._onResize.bind(this));

            this._viewTransform.setViewTarget(0, 0);

            requestAnimationFrame(this._onRender.bind(this));
        }

        private _setupMouseEvents() {
            this._canvas.addEventListener("mousedown", this._onMouseDown.bind(this));
            this._canvas.addEventListener("mousemove", this._onMouseMove.bind(this));
            this._canvas.addEventListener("mouseup", this._onMouseUp.bind(this));
            this._canvas.addEventListener("wheel", this._onMouseWheel.bind(this));
        }

        private _checkNeedRedraw() {
            this._needRedraw = this._isDirty;
            if (this._drawing && this._drawing.isDirty) {
                this._needRedraw = true;
                this._drawing.isDirty = false;
            }
            this._isDirty = false;
        }

        private _invalidate() {
            this._isDirty = true;
        }

        private _render() {

            this._checkNeverResized();

            if (this._needRedraw) {

                if (this._hasDrawing) {
					this._drawingContext.drawDrawing(this._drawing);
                }

                if (this.drawAxes) {
                	this._drawingContext.drawAxes();
				}
            }

            this._needRedraw = false;
        }

        private _handleViewChanged() {
            this._events.trigger("onViewChanged", { rect: this.getCurrentViewBounds() });
        }

        private _checkNeverResized() {
            if (this._htmlElement.parentElement && this._nerverResized) {
                this._nerverResized = false;
                this._onResize(null);
            }
        }

        private _onRender() {

            if (this._htmlElement.parentElement != null) {
                this._checkNeedRedraw();
                if (this._needRedraw) {
                    //console.log("redraw");
                    this._render();
                }
            }

            requestAnimationFrame(this._onRender.bind(this));
        }

        private _onDrawingDirty() {
            this._invalidate();
        }

        private _onMouseDown(e: MouseEvent) {
            if (!this._hasDrawing)
                return;
            this._lastMouseX = e.x;
            this._lastMouseY = e.y;
            this._onDrag = true;
        }

        private _onMouseMove(e: MouseEvent) {
            if (!this._hasDrawing)
                return;
            if (this._onDrag) {
                var cw = this._viewTransform.localToGlobalPoint(e.x, e.y);
                var lw = this._viewTransform.localToGlobalPoint(this._lastMouseX, this._lastMouseY);
                var difX = cw.x - lw.x;
                var difY = cw.y - lw.y;
                //if (!_viewTransform.isBottomUp)
                //difY = -difY;
                this.move(-difX, -difY);
            }
            this._lastMouseX = e.x;
            this._lastMouseY = e.y;
        }

        private _onMouseUp(e: MouseEvent) {
            if (!this._hasDrawing)
                return;
                this._onDrag = false;
        }

        private _onMouseWheel(e: WheelEvent) {
            if (!this._hasDrawing)
                return;
            //var sceneMousePos = _viewTransform.localToGlobalPoint(e.x, e.y);
            if (e.deltaY > 0) {
                //_self.zoomFrom(ZOOM_STEP, sceneMousePos.x, sceneMousePos.y);
                this.zoom(this.ZOOM_STEP);
            }
            else {
                //_self.zoomFrom(1 / ZOOM_STEP, sceneMousePos.x, sceneMousePos.y);
                this.zoom(1 / this.ZOOM_STEP);
            }
        }

        private _onResize(e: UIEvent) {
            if (this._autosize && this._htmlElement.parentElement) {
                this._htmlElement.style.width = this._htmlElement.parentElement.clientWidth + "px";
                this._htmlElement.style.height = this._htmlElement.parentElement.clientHeight + "px";
            }
            else {
                this._htmlElement.style.width = this._width + "px";
                this._htmlElement.style.height = this._height + "px";
            }

            this._canvas.width = this._htmlElement.clientWidth;
            this._canvas.height = this._htmlElement.clientHeight;

            this._isDirty = true;
            this._viewTransform.setViewPixelSize(this._canvas.width, this._canvas.height);

            if (!this._drawing)
                return;
            this._invalidate();
        }

        private _onDrawingChanged(oldValue: Drawing, newValue: Drawing) {
            if (oldValue != null) {
                //oldValue.EntitiesCollectionChanged -= Entities_CollectionChanged;
                oldValue.unregisterDirtyEventHandler(this._onDrawingDirty.bind(this));
            }
            this._hasDrawing = false;
            if (newValue != null) {
                this._hasDrawing = true;
                this._drawingContext._attachToDrawing(newValue);
                //newValue.EntitiesCollectionChanged += Entities_CollectionChanged;
                newValue.registerDirtyEventHandler(this._onDrawingDirty.bind(this));
            }
            this._checkNeverResized();
        }



        public get autosize() { return this._autosize; }
        public set autosize(v: boolean) {
            v = !!v;
            if (this._autosize != v) {
                this._autosize = v;
                this._onResize(null);
            }
        }

        public get canvas() { return this._canvas; }

        public get currentZoom() { return this._viewTransform.viewZoom; }

        public get currentTargetX() { return this._viewTransform.viewTargetX; }

        public get currentTargetY() { return this._viewTransform.viewTargetY; }

        public get drawAxes() { return this._drawAxes; }
        public set drawAxes(v: boolean) {
            v = !!v;
            if (this._drawAxes != v) {
                this._drawAxes = v;
                this._invalidate();
            }
        }

        public get drawing() { return this._drawing; }
        public set drawing(v: Drawing) {
            if (this._drawing != v) {
                const oldValue = this._drawing;
                this._drawing = v;
                this._onDrawingChanged(oldValue, this._drawing);
            }
        }

        public get height() { return this._autosize ? this._htmlElement.offsetHeight : this._height; }
        public set height(v: number) {
            if (this._autosize) {
                this._height = v;
            }
            else {
                if (this._height != v) {
                    this._height = v;
                    this._onResize(null);
                }
            }
        }

        public get htmlElement() { return this._htmlElement; }

        public get scaleStyles() { return this._drawingContext.scaleStyles; }
        public set scaleStyles(v: boolean) {
            v = !!v;
            this._drawingContext.scaleStyles = v;
            this._invalidate();
        }

        public get width() { return this._autosize ? this._htmlElement.offsetWidth : this._width; }
        public set width(v: number) {
            if (this._autosize) {
                this._width = v;
            }
            else {
                if (this._width != v) {
                    this._width = v;
                    this._onResize(null);
                }
            }
        }


        public getCursorPosition() {
            return this._viewTransform.localToGlobalPoint(this._lastMouseX, this._lastMouseY);
        }

        public getCurrentViewBounds() {
            return this._viewTransform.getViewBounds();
        }

        public redraw() {
            this._isDirty = true;
            this._onRender();
        }

        public move(offsetX: number, offsetY: number) {
            this._viewTransform.moveViewTarget(offsetX, offsetY);
            this._handleViewChanged();
            this._invalidate();
        }

        public moveTo(centerX: number, centerY: number) {
            this._viewTransform.setViewTarget(centerX, centerY);
            this._handleViewChanged();
            this._invalidate();        
        }

        public zoom(zoomIncrement: number) {
            this._viewTransform.setViewZoom(this._viewTransform.viewZoom * zoomIncrement);
            this._handleViewChanged();
            this._invalidate();        
        }

        public zoomTo(zoomIncrement: number, centerX: number, centerY: number) {
            this._viewTransform.setViewZoomTo(this._viewTransform.viewZoom * zoomIncrement, centerX, centerY);
            this._handleViewChanged();
            this._invalidate();        
        }

        public zoomAt(zoomFactor: number, centerX: number, centerY: number) {
            this._viewTransform.setViewZoomTo(zoomFactor, centerX, centerY);
            this._handleViewChanged();
            this._invalidate();        
        }

        public zoomAll() {
            var drawingBounds = this.drawing.getBounds();
            if (drawingBounds.width == 0 || drawingBounds.height == 0)
                return;
            var drawingAspectRatio = drawingBounds.height / drawingBounds.width;
            var viewPixelWidth = this._canvas.width;
            var viewPixelHeight = this._canvas.height;
            var viewPixelBounds = new Rect(0, 0, viewPixelWidth, viewPixelHeight);
            var viewAspectRatio = viewPixelHeight / viewPixelWidth;
            var currentZoom = this._viewTransform.viewZoom;
            var viewGlobalBounds = this._viewTransform.localToGlobalRect(viewPixelBounds.x, viewPixelBounds.y, viewPixelBounds.width, viewPixelBounds.height);
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
            if (MathUtils.isZero(zoomFactor))
                zoomFactor = 0.1;
            this.zoomAt(zoomFactor, centerX, centerY);        
        }


        public onViewChanged: EventSet<Viewport, ViewChangedEventArgs>;
    }
}