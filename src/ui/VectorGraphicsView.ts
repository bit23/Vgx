
namespace Vgx {

    export interface ViewportsLayoutChangedEventArgs extends EventArgs
    {
        layout: ViewportsLayout;
    }

    export class VectorGraphicsView  {

        private _events = new EventsManager(this);
        private _htmlElement: HTMLElement;
        private _viewports: Array<Viewport> = new Array();
        private _currentViewport: Viewport;
        private _drawing: Drawing;
        private _hasDrawing = false;
        private _viewportsLayout = ViewportsLayout.ONE;
        private _viewportsSpace = 2;
        private _neverArranged = true;

        constructor() {
            this._htmlElement = window.document.createElement("div");
            this._htmlElement.classList.add("VectorGraphicsView");
            this._htmlElement.style.width = "100%";
            this._htmlElement.style.height = "100%";
			this.onViewportsLayoutChanged = new EventSet<VectorGraphicsView, ViewportsLayout>(this._events, "onViewportsLayoutChanged");
            this._addNewViewport();
            window.addEventListener("resize", () => this._arrangeLayout());
        }

        private _arrangeLayout() {
            if (!this._htmlElement.parentElement)
                return;
            switch (this._viewportsLayout) {
                case ViewportsLayout.ONE:
                    break;
                case ViewportsLayout.TWO_VERTICAL:
                    {
                        var width = (this._htmlElement.offsetWidth - this._viewportsSpace) * 0.5;
                        var height = this._htmlElement.offsetHeight;
                        var viewportLeft = this._viewports[0];
                        viewportLeft.width = width;
                        viewportLeft.height = height;
                        var viewportRight = this._viewports[1];
                        viewportRight.width = width;
                        viewportRight.height = height;
                        viewportRight.htmlElement.style.left = (width + this._viewportsSpace) + "px";
                        viewportRight.htmlElement.style.top = "0px";
                    }
                    break;
                case ViewportsLayout.TWO_HORIZONTAL:
                    {
                        var width = this._htmlElement.offsetWidth;
                        var height = (this._htmlElement.offsetHeight - this._viewportsSpace) * 0.5;
                        var viewportTop = this._viewports[0];
                        viewportTop.width = width;
                        viewportTop.height = height;
                        var viewportBottom = this._viewports[1];
                        viewportBottom.width = width;
                        viewportBottom.height = height;
                        viewportBottom.htmlElement.style.left = "0px";
                        viewportBottom.htmlElement.style.top = (height + this._viewportsSpace) + "px";
                    }
                    break;
            }
            this._neverArranged = false;
        }

        private _addNewViewport() {
            var viewport = new Viewport();
            if (this._drawing != null) {
                viewport.drawing = this._drawing;
            }
            this._addViewport(viewport);
        }

        private _addViewport(viewport: Viewport) {
            if (this._viewports.indexOf(viewport) != -1)
                return;
            viewport.htmlElement.classList.add("viewport");
            this._viewports.push(viewport);
            this._htmlElement.appendChild(viewport.htmlElement);
            this._setActiveViewport(viewport);
            this._arrangeLayout();
        }

        private _removeLastViewport() {
            var viewport = this._viewports.pop();
            viewport.htmlElement.remove();
            if (this._currentViewport == viewport) {
                this._currentViewport = this._viewports[this._viewports.length - 1];
            }
        }

        private _setActiveViewport(viewport: Viewport) {
            this._currentViewport = viewport;
        }

        private _ensureViewportsCount(count: number) {
            if (count > this._viewports.length) {
                while (this._viewports.length < count)
                    this._addNewViewport();
            }
            else if (count < this._viewports.length) {
                while (this._viewports.length > count)
                    this._removeLastViewport();
            }
        }

        private _checkNeverArranged() {
            if (this._neverArranged) {
                this._arrangeLayout();
            }
        }

        private _onDrawingChanged(oldValue: Drawing, newValue: Drawing) {
            if (oldValue != null) {
                // TODO
            }
            this._hasDrawing = false;
            if (newValue != null) {
				for (const viewport of this._viewports) {
					viewport.drawing = newValue;
				}
            }
            this._checkNeverArranged();
        }

        private _onViewportsLayoutChanged(oldValue: ViewportsLayout, newValue: ViewportsLayout) {
            this._neverArranged = true;
            switch (newValue) {
                case 1://ViewportsLayout.ONE:
                    {
                        this._ensureViewportsCount(1);
                        this._viewports[0].htmlElement.style.position = "relative";
                        this._viewports[0].autosize = true;
                    }
                    break;
                case 2: //ViewportsLayout.TWO_VERTICAL:
                case 3://ViewportsLayout.TWO_HORIZONTAL:
                    {
                        this._ensureViewportsCount(2);
                        this._viewports[0].htmlElement.style.position = "absolute";
                        this._viewports[0].autosize = false;
                        this._viewports[1].htmlElement.style.position = "absolute";
                        this._viewports[1].autosize = false;
                    }
                    break;
            }
            this._arrangeLayout();

            this._events.trigger("onViewportsLayoutChanged", { layout: newValue });
        }


        public get htmlElement() { return this._htmlElement; }

        public get drawing() { return this._drawing; }
        public set drawing(v: Drawing) {
            if (this._drawing != v) {
                var oldValue = this._drawing;
                this._drawing = v;
                this._onDrawingChanged(oldValue, this._drawing);
            }
        }

        public get viewportsLayout() { return this._viewportsLayout; }
        public set viewportsLayout(v: ViewportsLayout) {
            if (this._viewportsLayout != v) {
                var oldValue = this._viewportsLayout;
                this._viewportsLayout = v;
                this._onViewportsLayoutChanged(oldValue, this._viewportsLayout);
            }
        }

        public get viewportsSpace() { return this._viewportsSpace; }
        public set viewportsSpace(v: ViewportsLayout) {
            if (this._viewportsSpace != v) {
                this._viewportsSpace = v;
                this._arrangeLayout();
            }
        }

        public get viewportsCount() { return this._viewports.length; }

        public get currentViewport() { return this._currentViewport; }


        public getViewport(index: number) {
            if (index < 0 || index >= this._viewports.length)
                return null;
            return this._viewports[index];
        }



        public onViewportsLayoutChanged: EventSet<VectorGraphicsView, ViewportsLayout>
    }
}