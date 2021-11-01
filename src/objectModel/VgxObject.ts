
namespace Vgx {

	export abstract class VgxObject {

		private readonly _events: EventsManager;

		private _handle: string;
		private _drawing: Drawing;
		private _bindings: DynamicObject;
		private _parent: VgxObject;


		constructor() {
			this._bindings = {};
			this._events = new EventsManager(this);
			this.onHandleCreated = new EventSet<VgxObject, EventArgs>(this._events, "onHandleCreated");
			this.onHandleDestroyed = new EventSet<VgxObject, EventArgs>(this._events, "onHandleDestroyed");
		}

		// internal
		public _setParent(parent: VgxObject) {
			this._parent = parent;
		}


		private _addToDrawing() {
			this._handle = this._drawing.getFreeHandle();
			if (<VgxEntity>(<unknown>this)) {
				this._drawing.addChild(<VgxEntity>(<unknown>this));
				this._addedToDrawing();
			}
			this._events.trigger("onHandleCreated", {});
		}

		private _removeFromDrawing() {
			if (this._handle) {
				this._handle = null;
				this._events.trigger("onHandleDestroyed", {});
			}
			if (this._drawing) {
				if (<VgxEntity>(<unknown>this)) {
					this._drawing.removeChild(<VgxEntity>(<unknown>this));
				}
			}
		}

		// virtual
		protected _addedToDrawing() { }

		protected _getValue(propertyName: string, defaultValue: any) {
			if (propertyName in this._bindings) {
				return this._bindings[propertyName]();
			} else {
				return defaultValue;
			}
		}

		// abstract
		protected abstract _copyMembersValues(destination: VgxEntity): void;

		public abstract getBounds(): Rect;


		public get drawing(): Drawing { 
			if (this._parent) {
				return this._parent.drawing;
			}
			return this._drawing; 
		}

		public get handle() { return this._handle; }


		public addToDrawing(drawing: Drawing) {
			if (this._drawing != drawing) {
				// rimuove l'oggetto da un eventuale drawing precedente
				this.removeFromDrawing();
				// memorizza il nuovo drawing
				this._drawing = drawing;
				// aggiunge l'oggetto al drawing
				this._addToDrawing();
			}
		}

		public removeFromDrawing() {
			this._removeFromDrawing();
		}

		public setBinding(propertyName: string, binding: any) {
			if (!binding) {
				delete this._bindings[propertyName];
			} else {
				this._bindings[propertyName] = binding;
			}
		}


		public readonly onHandleCreated: EventSet<VgxObject, EventArgs>;

		public readonly onHandleDestroyed: EventSet<VgxObject, EventArgs>;
	}
}