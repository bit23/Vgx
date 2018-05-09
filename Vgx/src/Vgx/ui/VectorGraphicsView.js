/// <reference path="Viewport.js" />
/// <reference path="ViewportsLayout.js" />

(function (lib) {

    var VectorGraphicsView = (function () {

        function VectorGraphicsView() {

            var _self = this;
            var _events = new lib.Extra.Events(this);
            var _htmlElement;
            var _viewports = new Array();
            var _currentViewport;
            var _drawing;
            var _hasDrawing = false;
            var _viewportsLayout = lib.Vgx.ViewportsLayout.ONE;
            var _viewportsSpace = 2;
            var _neverArranged = true;


            function init() {
                _htmlElement = window.document.createElement("div");
                _htmlElement.classList.add("VectorGraphicsView");
                _htmlElement.style.width = "100%";
                _htmlElement.style.height = "100%";
                addNewViewport();
                window.addEventListener("resize", function () { return arrangeLayout(); });
            }


            function arrangeLayout() {
                if (!_htmlElement.parentElement)
                    return;
                switch (_viewportsLayout) {
                    case lib.Vgx.ViewportsLayout.ONE:
                        break;
                    case lib.Vgx.ViewportsLayout.TWO_VERTICAL:
                        {
                            var width = (_htmlElement.offsetWidth - _viewportsSpace) * 0.5;
                            var height = _htmlElement.offsetHeight;
                            var viewportLeft = _viewports[0];
                            viewportLeft.width = width;
                            viewportLeft.height = height;
                            var viewportRight = _viewports[1];
                            viewportRight.width = width;
                            viewportRight.height = height;
                            viewportRight.htmlElement.style.left = (width + _viewportsSpace) + "px";
                            viewportRight.htmlElement.style.top = "0px";
                        }
                        break;
                    case lib.Vgx.ViewportsLayout.TWO_HORIZONTAL:
                        {
                            var width = _htmlElement.offsetWidth;
                            var height = (_htmlElement.offsetHeight - _viewportsSpace) * 0.5;
                            var viewportTop = _viewports[0];
                            viewportTop.width = width;
                            viewportTop.height = height;
                            var viewportBottom = _viewports[1];
                            viewportBottom.width = width;
                            viewportBottom.height = height;
                            viewportBottom.htmlElement.style.left = "0px";
                            viewportBottom.htmlElement.style.top = (height + _viewportsSpace) + "px";
                        }
                        break;
                }
                _neverArranged = false;
            }

            function addNewViewport() {
                var viewport = new lib.Vgx.Viewport();
                if (_drawing != null) {
                    viewport.drawing = _drawing;
                }
                addViewport(viewport);
            }

            function addViewport(viewport) {
                if (_viewports.indexOf(viewport) != -1)
                    return;
                viewport.htmlElement.classList.add("viewport");
                _viewports.push(viewport);
                _htmlElement.appendChild(viewport.htmlElement);
                setActiveViewport(viewport);
                arrangeLayout();
            }

            function removeLastViewport() {
                var viewport = _viewports.pop();
                viewport.htmlElement.remove();
                if (_currentViewport == viewport) {
                    _currentViewport = _viewports[_viewports.length - 1];
                }
            }

            function setActiveViewport(viewport) {
                _currentViewport = viewport;
            }

            function ensureViewportsCount(count) {
                if (count > _viewports.length) {
                    while (_viewports.length < count)
                        addNewViewport();
                }
                else if (count < _viewports.length) {
                    while (_viewports.length > count)
                        removeLastViewport();
                }
            }

            function checkNeverArranged() {
                if (_neverArranged) {
                    arrangeLayout();
                }
            }

            function onDrawingChanged(oldValue, newValue) {
                if (oldValue != null) {
                    // TODO
                }
                _hasDrawing = false;
                if (newValue != null) {
                    for (var i = 0; i < _viewports.length; i++) {
                        _viewports[i].drawing = newValue;
                    }
                }
                checkNeverArranged();
            }

            function onViewportsLayoutChanged(oldValue, newValue) {
                _neverArranged = true;
                switch (newValue) {
                    case 1://ViewportsLayout.ONE:
                        {
                            ensureViewportsCount(1);
                            _viewports[0].htmlElement.style.position = "relative";
                            _viewports[0].autosize = true;
                        }
                        break;
                    case 2: //ViewportsLayout.TWO_VERTICAL:
                    case 3://ViewportsLayout.TWO_HORIZONTAL:
                        {
                            ensureViewportsCount(2);
                            _viewports[0].htmlElement.style.position = "absolute";
                            _viewports[0].autosize = false;
                            _viewports[1].htmlElement.style.position = "absolute";
                            _viewports[1].autosize = false;
                        }
                        break;
                }
                arrangeLayout();

                _events.raise("onViewportsLayoutChanged", { layout: newValue });
            }




            Object.defineProperty(this, "htmlElement", {
                get: function () { return _htmlElement; }
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

            Object.defineProperty(this, "viewportsLayout", {
                get: function () { return _viewportsLayout; },
                set: function (v) {
                    if (_viewportsLayout != v) {
                        var oldValue = _viewportsLayout;
                        _viewportsLayout = v;
                        onViewportsLayoutChanged(oldValue, _viewportsLayout);
                    }
                }
            });

            Object.defineProperty(this, "viewportsSpace", {
                get: function () { return _viewportsSpace; },
                set: function (v) {
                    if (_viewportsSpace != v) {
                        _viewportsSpace = v;
                        arrangeLayout();
                    }
                }
            });

            Object.defineProperty(this, "viewportsCount", {
                get: function () { return _viewports.length; }
            });

            Object.defineProperty(this, "currentViewport", {
                get: function () { return _currentViewport; }
            });


            Object.defineProperty(this, "getViewport", {
                value: function (index) {
                    if (index < 0 || index >= _viewports.length)
                        return null;
                    return _viewports[index];
                }
            });

            //Object.defineProperty(this, "addNewViewport", {
            //    value: function () { addViewport(new Viewport()); }
            //});
            // ctor


            _events.create("onViewportsLayoutChanged");


            init();
        }

        return VectorGraphicsView;
    })();
    lib.Vgx.VectorGraphicsView = VectorGraphicsView;

})(library);