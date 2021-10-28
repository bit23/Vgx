
namespace Vgx {

	export class Drawing {

		public static fromJSON(json: string) {
			const jobject = JSON.parse(json);
			return DrawingLoader.loadFromObject(jobject);
		}

		public static fromScript(script: string) {
			var drawing = new Drawing();
			// eval(script);
			// return drawing;

			const func = new Function("drawing", script);
			func.call(null, drawing);
			return drawing;
		}


		private _usedHandles: string[];
		private _children: VgxEntityCollection;
		private _isDirty = true;
		private _background: BrushDefinition;
		private _redrawHandlers: Array<Action>;
		private _artboard: Artboard;

		constructor() {
			this._usedHandles = [];
			this._children = new VgxEntityCollection(this);
			this._children.onCollectionChanged.add(this._onChildrenChanged, this);
			this._redrawHandlers = [];
		}


		private _onChildrenChanged(s: ReactiveCollection<VgxEntity>, e: CollectionChangedArgs<VgxEntity>) {
			this.isDirty = true;
		}

		private _artboardPropertyChanged(s: ReactiveObject, e: PropertyChangedArgs) {

		}

		public get background() { return this._background; }
		public set background(v: BrushDefinition) {
			const vType = typeof v;
			if ((vType === "number" || vType === "string") || (v instanceof CanvasGradient || v instanceof CanvasPattern)) {
				if (this._background != v) {
					this._background = v;
					this.isDirty = true;
				}
			}
		}

		public get isDirty() { return this._isDirty; }
		public set isDirty(v: boolean) {
			v = !!v;
			if (this._isDirty != v) {
				this._isDirty = v;
				// TODO
				this._redrawHandlers.forEach((a: Action) => a());
			}
		}


		public get artboard() { return this._artboard; }
		public set artboard(v: Artboard) {
			if (v instanceof Artboard) {
				if (this._artboard) {
					this._artboard.onPropertyChanged.remove(this._artboardPropertyChanged);
				}
				this._artboard = v;
				this._artboard.onPropertyChanged.add(this._artboardPropertyChanged, this);
				this.isDirty = true;
			}
			else if (!v) {
				if (this._artboard) {
					this._artboard.onPropertyChanged.remove(this._artboardPropertyChanged);
				}
				this._artboard = null;
				this.isDirty = true;
			}
		}


		public registerDirtyEventHandler(eventHandler: Action) {
			if (typeof eventHandler === "function") {
				this._redrawHandlers.push(eventHandler);
			}
		}

		public unregisterDirtyEventHandler(eventHandler: Action) {
			if (typeof eventHandler === "function") {
				let index;
				while ((index = this._redrawHandlers.indexOf(eventHandler)) >= 0) {
					this._redrawHandlers.splice(index, 1);
				}
			}
		}


		public getFreeHandle() {
			let handle;
			do {
				handle = Utils.createUUID(false).substr(0, 8);
			} while (this._usedHandles.indexOf(handle) != -1);
			this._usedHandles.push(handle);
			return handle;
		}

		public addChild(vgxEntity: VgxEntity) {

			if (vgxEntity.drawing != this) {
				vgxEntity.addToDrawing(this);
				return;
			}

			this._children.add(vgxEntity);
			this.isDirty = true;
		}

		public removeChild(vgxEntity: VgxEntity) {

			const index = this._children.indexOf(vgxEntity);
			if (index < 0) {
				return null;
			}

			const result = this._children.elementAt(index);
			this._children.removeAt(index);
			this.isDirty = true;
            return result;
		}

		public getChildren() {
			return this._children;
		}

		public clear() {
			this._children.clear();
			this.isDirty = true;
		}

		public getBounds() {
			const result = Rect.empty;
			if (this._artboard) {
				return this._artboard.bounds;
			}
			else {
				if (this._children.count > 0) {
					for (const child of this._children) {
						const childBounds = child.getBounds();
						result.union(childBounds);
					}
				}
			}
			return result;
		}
	}
}