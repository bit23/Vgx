namespace SampleApps {

	export class UIElement {

		private _htmlElement: HTMLElement;

		constructor(htmlElement?: UIElement | HTMLElement | string) {
			if (typeof htmlElement !== "undefined") {
				if (htmlElement instanceof HTMLElement) {
					this._htmlElement = htmlElement;
				}
				else if (typeof htmlElement === "string") {
					this._htmlElement = window.document.createElement(htmlElement);
					if (this._htmlElement == null) {
						throw new Error("invalid html tag");
					}
				}
				else if (htmlElement instanceof UIElement) {
					this._htmlElement = window.document.createElement(htmlElement.htmlElement.tagName);
				}
				else {
					throw new Error("invalid argument");
				}
			}
			else {
				this._htmlElement = window.document.createElement("div");
			}

			this._htmlElement.classList.add("ui-element");
		}

		public get htmlElement() { return this._htmlElement; }
	}

	export class ViewportMenu {

		private readonly ZOOM_FACTOR = 0.85;

		private _viewport: Vgx.Viewport;
		private _htmlElement: HTMLElement;

		constructor(viewport: Vgx.Viewport) {
			this._viewport = viewport;
			this._initializeUI();
		}

		private _initializeUI() {

			this._htmlElement = window.document.createElement("div");
			this._htmlElement.classList.add("viewportMenu");

			var menuGroupShowAxes = window.document.createElement("div");
			menuGroupShowAxes.classList.add("menuGroup");
			menuGroupShowAxes.classList.add("menu-group-element");

			var lblShowAxes = window.document.createElement("label");
			lblShowAxes.classList.add("menuElement");
			lblShowAxes.classList.add("label");
			lblShowAxes.setAttribute("for", "checkShowAxes");
			lblShowAxes.innerText = "Show axes ";

			var checkShowAxes = window.document.createElement("input");
			checkShowAxes.classList.add("menuElement");
			checkShowAxes.setAttribute("type", "checkbox");
			checkShowAxes.setAttribute("name", "checkShowAxes");
			checkShowAxes.checked = this._viewport.drawAxes;
			checkShowAxes.addEventListener("change", (e) => {
				this._viewport.drawAxes = (<any>e.target).checked;
			});

			menuGroupShowAxes.appendChild(lblShowAxes);
			menuGroupShowAxes.appendChild(checkShowAxes);

			var menuGroupScaleStyles = window.document.createElement("div");
			menuGroupScaleStyles.classList.add("menuGroup");
			menuGroupScaleStyles.classList.add("menu-group-element");

			var lblScaleStyles = window.document.createElement("label");
			lblScaleStyles.classList.add("menuElement");
			lblScaleStyles.classList.add("label");
			lblScaleStyles.setAttribute("for", "checkScaleStyles");
			lblScaleStyles.innerText = "Scale styles ";

			var checkScaleStyles = window.document.createElement("input");
			checkScaleStyles.classList.add("menuElement");
			checkScaleStyles.setAttribute("type", "checkbox");
			checkScaleStyles.setAttribute("name", "checkScaleStyles");
			checkScaleStyles.checked = this._viewport.scaleStyles;
			checkScaleStyles.addEventListener("change", (e) => {
				this._viewport.scaleStyles = (<any>e.target).checked;
			});

			menuGroupScaleStyles.appendChild(lblScaleStyles);
			menuGroupScaleStyles.appendChild(checkScaleStyles);

			var menuGroupButtons = window.document.createElement("div");
			menuGroupButtons.classList.add("menuGroup");
			menuGroupButtons.classList.add("menuGroupButtons");

			var btnZoomMinus = window.document.createElement("button");
			btnZoomMinus.classList.add("menuButton");
			btnZoomMinus.setAttribute("title", "Zoom Out");
			btnZoomMinus.style.setProperty("background-image", "url(resources/zoom_minus.png)");
			btnZoomMinus.addEventListener("click", (e) => this._viewport.zoom(this.ZOOM_FACTOR));

			var btnZoomPlus = window.document.createElement("button");
			btnZoomPlus.classList.add("menuButton");
			btnZoomPlus.setAttribute("title", "Zoom In");
			btnZoomPlus.style.setProperty("background-image", "url(resources/zoom_plus.png)");
			btnZoomPlus.addEventListener("click", (e) => this._viewport.zoom(1 / this.ZOOM_FACTOR) );

			var btnZoomAll = window.document.createElement("button");
			btnZoomAll.classList.add("menuButton");
			btnZoomAll.setAttribute("title", "Zoom All");
			btnZoomAll.style.setProperty("background-image", "url(resources/zoom_all.png)");
			btnZoomAll.addEventListener("click", (e) => this._viewport.zoomAll());

			menuGroupButtons.appendChild(btnZoomMinus);
			menuGroupButtons.appendChild(btnZoomPlus);
			menuGroupButtons.appendChild(btnZoomAll);


			this._htmlElement.appendChild(menuGroupShowAxes);
			this._htmlElement.appendChild(menuGroupScaleStyles);
			this._htmlElement.appendChild(menuGroupButtons);
		}


		public get htmlElement() { return this._htmlElement; }

		public get viewport() { return this._viewport; }
	}

	export class ViewerApp {

		public static start() {
			new ViewerApp();
		}


		private _menuBar: HTMLElement;
		private _contentView: HTMLElement;
		private _sideView: HTMLElement;
		private _vectorGraphicsView: Vgx.VectorGraphicsView;
		private _drawingStructureView: Vgx.DrawingStructureView;
		private _selectDrawing: HTMLSelectElement;
		private _selectBackground: HTMLSelectElement;
		//private _selectOrientation: HTMLSelectElement;
		private _selectViewports: HTMLSelectElement;
		private _menuViewports: Array<Vgx.Viewport>;

		constructor() {
			this._menuViewports = [];
			this._initializeUI();

			window.addEventListener('hashchange', (e) => this._readHash());
			
			this._readHash();
		}

		private _initializeUI() {

			this._menuBar = window.document.querySelector("#menuBar");
			this._contentView = window.document.querySelector("#contentView");
			this._sideView = window.document.querySelector("#sideView");
	
			this._vectorGraphicsView = new Vgx.VectorGraphicsView();
			this._vectorGraphicsView.onViewportsLayoutChanged.add(this._onViewportsLayoutChanged, this);
			this._vectorGraphicsView.viewportsLayout = Vgx.ViewportsLayout.ONE;
			this._vectorGraphicsView.viewportsSpace = 4;
			this._vectorGraphicsView.currentViewport.scaleStyles = true;
			//_vectorGraphicsView.currentViewport.drawAxes = true;
			this._onViewportsLayoutChanged(this._vectorGraphicsView, null);
			this._contentView.appendChild(this._vectorGraphicsView.htmlElement);

			this._drawingStructureView = new Vgx.DrawingStructureView();
			this._sideView.appendChild(this._drawingStructureView.htmlElement);
	
	
			this._selectDrawing = window.document.querySelector("#selectDrawing");
			this._selectDrawing.addEventListener("change", (e) => {
				var args = this._selectDrawing.value.split("|");
				this._loadDrawing(args[0], args[1]).catch();
			});
	
			this._selectBackground = window.document.querySelector("#selectBackground");
			this._selectBackground.addEventListener("change", (e) => {
				this._vectorGraphicsView.drawing.background = this._selectBackground.value;
			});
	
			//_selectOrientation = window.document.querySelector("#selectOrientation");
			//_selectOrientation.addEventListener("change", (e) => {
			//    for (var i = 0; i < _vectorGraphicsView.viewportsCount; i++) {
			//        var viewport = _vectorGraphicsView.getViewport(i);
			//        viewport.orientation = _selectOrientation.selectedIndex + 1;
			//    }
			//});
	
			this._selectViewports = window.document.querySelector("#selectViewports");
			this._selectViewports.addEventListener("change", (e) => {
				this._vectorGraphicsView.viewportsLayout = this._selectViewports.selectedIndex + 1;
			});
	
			window.addEventListener("resize", this._onWindowResize.bind(this));

			// -------------------------------------------------

			this._fillSelectInputs();

			

			//this._onWindowResize();
		}

		private _fillSelectInputs() {

			const createOption = (text: string, value: string) => {
				const result = document.createElement("option");
				result.value = value;
				result.textContent = text;
				return result;
			};

			//this._selectDrawing.appendChild(createOption("points", "../../drawings/points.json|json"));
			this._selectDrawing.appendChild(createOption("vgx-model", "../../drawings/vgx-model.js|script"));
			this._selectDrawing.appendChild(createOption("modern-clock", "../../drawings/modern-clock.js|script"));
			this._selectDrawing.appendChild(createOption("clock", "../../drawings/clock.js|script"));
			this._selectDrawing.appendChild(createOption("test-svg", "../../drawings/test.svg|svg"));
			//this._selectDrawing.appendChild(createOption("colors", "../../drawings/colors.js|script"));
			this._selectDrawing.appendChild(createOption("house", "../../drawings/house.json|json"));
			this._selectDrawing.appendChild(createOption("hello-world", "../../drawings/hello-world.json|json"));
			this._selectDrawing.appendChild(createOption("google-logo", "../../drawings/google-logo.json|json"));

			this._selectBackground.appendChild(createOption("Dark", "#0a0d11"));
			this._selectBackground.appendChild(createOption("Light", "#f1f5ff"));

			this._selectViewports.appendChild(createOption("One", "1"));
			this._selectViewports.appendChild(createOption("Two vertical", "2"));
			this._selectViewports.appendChild(createOption("Two horizontal", "3"));
		}

		// private _loadStartDrawing() {
		// 	if (document.location.hash.length > 0) {
		// 		console.log(document.location.hash.substr(1));
		// 		return true;
		// 	}
		// 	else {
		// 		const optionParts = this._selectDrawing.options[0].value.split("|");
		// 		const url = optionParts[0];
		// 		const type = optionParts[1];
		// 		this._loadDrawing(url, type).catch(() => this._onWindowResize());
		// 	}
		// }

		private _onWindowResize() {

		}

		private _loadOptionDrawing(optionItem: HTMLOptionElement) {
			const optionParts = optionItem.value.split("|");
			const url = optionParts[0];
			const type = optionParts[1];
			this._loadDrawing(url, type).catch(() => this._onWindowResize());
		}

		private _readHash() {
			if (document.location.hash.length > 0) {
				const hashValue = document.location.hash.substr(1);
				const optionItem = Array.from(this._selectDrawing.options).filter(x => x.textContent == hashValue)[0];
				if (optionItem) {
					this._loadOptionDrawing(optionItem);
					return true;
				}
			}
			
			this._loadOptionDrawing(this._selectDrawing.options[0]);
			return false;
		}

		private _onViewportsLayoutChanged(sender: Vgx.VectorGraphicsView, e: Vgx.ViewportsLayout) {
			var updatedMenuViewports = [];
			for (var i = 0; i < this._vectorGraphicsView.viewportsCount; i++) {
				var viewport = this._vectorGraphicsView.getViewport(i);
				//if (_selectOrientation) {
				//    viewport.orientation = _selectOrientation.selectedIndex + 1;
				//}
				if (this._menuViewports.indexOf(viewport) == -1) {
					this._addViewportMenu(viewport);
				}
				updatedMenuViewports.push(viewport);
			}
			this._menuViewports = updatedMenuViewports;
		}

		private _addViewportMenu(viewport: Vgx.Viewport) {
			var viewportMenu = new ViewportMenu(viewport);
			viewport.htmlElement.appendChild(viewportMenu.htmlElement);
		}

		private _resolveImporter(fullTypeName: string) {
			const f = new Function(`return new ${fullTypeName}()`);
			return f() as Vgx.Importer;
		}

		private async _loadDrawing(url: string, type: "script" | "json" | string) {

			const importerType = Vgx.ImportersManager.getTypeOrDefault(type);
			const importer = this._resolveImporter(importerType.typeName);
			if (!importer) {
				throw new Error("importer not loaded");
			}

			const drawing = await importer.loadFile(url);
			if (drawing.background) {
				var option = document.createElement("option");
				option.value = <any>drawing.background;
				option.innerText = <any>drawing.background;
				this._selectBackground.options.add(option);
				this._selectBackground.selectedIndex = this._selectBackground.options.length - 1;
			} else {
				drawing.background = this._selectBackground.options[0].value;
			}
			this._vectorGraphicsView.drawing = drawing;

			this._drawingStructureView.attachToDrawing(drawing);
		}
	}
}