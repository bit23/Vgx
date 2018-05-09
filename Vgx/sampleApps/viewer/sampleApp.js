
(function (window, undefined) {

    var UIElement = (function () {

        function UIElement(optHTMLElement) {

            var _self = this;
            var _htmlElement;


            function _init() {
                if (typeof optHTMLElement !== "undefined") {
                    if (optHTMLElement instanceof HTMLElement) {
                        _htmlElement = optHTMLElement;
                    }
                    else if (typeof optHTMLElement === "string") {
                        _htmlElement = window.document.createElement(optHTMLElement);
                        if (_htmlElement == null) {
                            throw new Error("invalid html tag");
                        }
                    }
                    else if (optHTMLElement instanceof UIElement) {
                        _htmlElement = window.document.createElement(optHTMLElement.htmlElement.tagName);
                    }
                    else {
                        throw new Error("invalid argument");
                    }
                }
                else {
                    _htmlElement = window.document.createElement("div");
                }

                _htmlElement.classList.add("UIElement");
            }


            Object.defineProperty(this, "htmlElement", { get: function () { return _htmlElement; } });


            _init();
        }

        return UIElement;

    })();

    var ViewportMenu = (function () {

        function ViewportMenu(viewport) {

            var ZOOM_FACTOR = 0.85;

            var _self = this;
            var _viewport = viewport;
            var _htmlElement;

            function _init() {

                _htmlElement = window.document.createElement("div");
                _htmlElement.classList.add("viewportMenu");


                var menuGroupShowAxes = window.document.createElement("div");
                menuGroupShowAxes.classList.add("menuGroup");

                var lblShowAxes = window.document.createElement("label");
                lblShowAxes.classList.add("menuElement");
                lblShowAxes.classList.add("label");
                lblShowAxes.setAttribute("for", "checkShowAxes");
                lblShowAxes.innerText = "Show axes ";

                var checkShowAxes = window.document.createElement("input");
                checkShowAxes.classList.add("menuElement");
                checkShowAxes.setAttribute("type", "checkbox");
                checkShowAxes.setAttribute("name", "checkShowAxes");
                checkShowAxes.checked = _viewport.drawAxes;
                checkShowAxes.addEventListener("change", (e) => {
                    _viewport.drawAxes = e.target.checked;
                });

                menuGroupShowAxes.appendChild(lblShowAxes);
                lblShowAxes.appendChild(checkShowAxes);


                var separator1 = window.document.createElement("div");
                separator1.classList.add("menuElement");
                separator1.classList.add("separator");


                var menuGroupScaleStyles = window.document.createElement("div");
                menuGroupScaleStyles.classList.add("menuGroup");

                var lblScaleStyles = window.document.createElement("label");
                lblScaleStyles.classList.add("menuElement");
                lblScaleStyles.classList.add("label");
                lblScaleStyles.setAttribute("for", "checkScaleStyles");
                lblScaleStyles.innerText = "Scale styles ";

                var checkScaleStyles = window.document.createElement("input");
                checkScaleStyles.classList.add("menuElement");
                checkScaleStyles.setAttribute("type", "checkbox");
                checkScaleStyles.setAttribute("name", "checkScaleStyles");
                checkScaleStyles.checked = _viewport.scaleStyles;
                checkScaleStyles.addEventListener("change", (e) => {
                    _viewport.scaleStyles = e.target.checked;
                });

                menuGroupScaleStyles.appendChild(lblScaleStyles);
                lblScaleStyles.appendChild(checkScaleStyles);


                var separator2 = window.document.createElement("div");
                separator2.classList.add("menuElement");
                separator2.classList.add("separator");


                var menuGroupButtons = window.document.createElement("div");
                menuGroupButtons.classList.add("menuGroup");

                var btnZoomMinus = window.document.createElement("button");
                btnZoomMinus.classList.add("menuButton");
                btnZoomMinus.setAttribute("title", "Zoom Out");
                btnZoomMinus.style["background-image"] = "url(resources/zoom_minus.png)";
                btnZoomMinus.addEventListener("click", (e) => _viewport.zoom(ZOOM_FACTOR));

                var btnZoomPlus = window.document.createElement("button");
                btnZoomPlus.classList.add("menuButton");
                btnZoomPlus.setAttribute("title", "Zoom In");
                btnZoomPlus.style["background-image"] = "url(resources/zoom_plus.png)";
                btnZoomPlus.addEventListener("click", (e) => _viewport.zoom(1 / ZOOM_FACTOR) );

                var btnZoomAll = window.document.createElement("button");
                btnZoomAll.classList.add("menuButton");
                btnZoomAll.setAttribute("title", "Zoom All");
                btnZoomAll.style["background-image"] = "url(resources/zoom_all.png)";
                btnZoomAll.addEventListener("click", (e) => _viewport.zoomAll());

                menuGroupButtons.appendChild(btnZoomMinus);
                menuGroupButtons.appendChild(btnZoomPlus);
                menuGroupButtons.appendChild(btnZoomAll);


                _htmlElement.appendChild(menuGroupShowAxes);
                _htmlElement.appendChild(separator1);
                _htmlElement.appendChild(menuGroupScaleStyles);
                _htmlElement.appendChild(separator2);
                _htmlElement.appendChild(menuGroupButtons);
            }


            Object.defineProperty(this, "htmlElement", { get: function () { return _htmlElement; } });

            Object.defineProperty(this, "viewport", { get: function () { return _viewport; } });


            _init();
        }

        return ViewportMenu;

    })();


    var _menuBar;
    var _mainView;
    var _vectorGraphicsView;
    var _selectDrawing;
    var _selectBackground;
    //var _selectOrientation;
    var _selectViewports;
    var _menuViewports = [];


    window.addEventListener("DOMContentLoaded", () => {

        initializeUI();

        //Vgx.HttpClient.downloadString("../drawings/all-shapes.json", (s, e) => {
        //    var drawing = Vgx.Drawing.fromJSON(e.result);
        //    drawing.background = _selectBackground.options[0].value;
        //    _vectorGraphicsView.drawing = drawing;

        //    _vectorGraphicsView.currentViewport.zoomAll();
        //    //_vectorGraphicsView.currentViewport.zoomAt(1, 0, 0);
        //});
        var optionParts = _selectDrawing.options[0].value.split("|");
        var url = optionParts[0];
        var type = optionParts[1];
        loadDrawing(url, type);

        onWindowResize();
    });

    function loadDrawing(url, type) {
        
        Vgx.HttpClient.downloadString(url, (s, e) => {
            var drawing;
            if (type == "script") {
                drawing = Vgx.Drawing.fromScript(e.result);
            } else {
                drawing = Vgx.Drawing.fromJSON(e.result);
            }
            if (drawing.background) {
                var option = document.createElement("option");
                option.value = drawing.background;
                option.innerText = drawing.background;
                _selectBackground.options.add(option);
                _selectBackground.selectedIndex = _selectBackground.options.length - 1;
            } else {
                drawing.background = _selectBackground.options[0].value;
            }
            _vectorGraphicsView.drawing = drawing;
            //_vectorGraphicsView.currentViewport.zoomAll();
        });
    }

    function initializeUI() {

        _menuBar = window.document.querySelector("#menuBar");
        _mainView = window.document.querySelector("#mainView");

        _vectorGraphicsView = new Vgx.VectorGraphicsView();
        _vectorGraphicsView.onViewportsLayoutChanged.addHandler(onViewportsLayoutChanged);
        _vectorGraphicsView.viewportsLayout = Vgx.ViewportsLayout.ONE;
        _vectorGraphicsView.viewportsSpace = 4;
        _vectorGraphicsView.currentViewport.scaleStyles = true;
        //_vectorGraphicsView.currentViewport.drawAxes = true;
        onViewportsLayoutChanged(_vectorGraphicsView, {});
        _mainView.appendChild(_vectorGraphicsView.htmlElement);


        _selectDrawing = window.document.querySelector("#selectDrawing");
        _selectDrawing.addEventListener("change", (e) => {
            var args = _selectDrawing.value.split("|");
            loadDrawing(args[0], args[1]);
        });

        _selectBackground = window.document.querySelector("#selectBackground");
        _selectBackground.addEventListener("change", (e) => {
            _vectorGraphicsView.drawing.background = _selectBackground.value;
        });

        //_selectOrientation = window.document.querySelector("#selectOrientation");
        //_selectOrientation.addEventListener("change", (e) => {
        //    for (var i = 0; i < _vectorGraphicsView.viewportsCount; i++) {
        //        var viewport = _vectorGraphicsView.getViewport(i);
        //        viewport.orientation = _selectOrientation.selectedIndex + 1;
        //    }
        //});

        _selectViewports = window.document.querySelector("#selectViewports");
        _selectViewports.addEventListener("change", (e) => {
            _vectorGraphicsView.viewportsLayout = _selectViewports.selectedIndex + 1;
        });

        window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
        _mainView.style["padding-top"] = _menuBar.clientHeight + "px";
    }

    function onViewportsLayoutChanged(sender, e) {
        var updatedMenuViewports = [];
        for (var i = 0; i < _vectorGraphicsView.viewportsCount; i++) {
            var viewport = _vectorGraphicsView.getViewport(i);
            //if (_selectOrientation) {
            //    viewport.orientation = _selectOrientation.selectedIndex + 1;
            //}
            if (_menuViewports.indexOf(viewport) == -1) {
                addViewportMenu(viewport);
            }
            updatedMenuViewports.push(viewport);
        }
        _menuViewports = updatedMenuViewports;
    }

    function addViewportMenu(viewport) {
        var viewportMenu = new ViewportMenu(viewport);
        viewport.htmlElement.appendChild(viewportMenu.htmlElement);
    }

})(this || window);