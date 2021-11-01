/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

	export class VgxView extends VgxFillableEntity {

		private _children: VgxEntityCollection;
		private _bounds: Rect;
		private _clipBounds: Rect;
		private _clip: boolean;

		constructor() {
			super();
			this.fill = "transparent";
			this._children = new VgxEntityCollection(this);
			this._children.onCollectionChanged.add(this._onChildrenChanged, this);

			this._children.onCollectionChanged.add((s, e) => {
				for (const item of e.items) {
					item._setParent(this);
				}
				this.updateBounds();
			});
		}


		private _onChildrenChanged(s: ReactiveCollection<VgxEntity>, e: CollectionChangedArgs<VgxEntity>) {
			if (!this._clip) {
				this.updateBounds();
			}
		}

		private _onClipBoundsChanged() {
			if (this._clip) {
				// TODO aggiornare il disegno
			}
		}

		private _onClipStateChanged() {
			if (this._clip) {
				if (!this._clipBounds || Rect.isEmpty(this._clipBounds)) {
					this.updateBounds();
					this._clipBounds = this._bounds;
				}
				// TODO applicare l'area di clip al disegno
			}
			else {
				// TODO applicare l'area di clip al disegno
			}
		}		

		private updateBounds() {
			this._bounds = Utils.getEntitiesBounds(this._children, this.insertPointX, this.insertPointY);
		}

		//virtual override 
		protected _getBounds() {
			return this._bounds;
		}

		//abstract override
		public _getPath(): Path2D {
			// TODO
			return null;
		}

		public get children() { return this._children; }

		public get clipBounds() { return this._clipBounds; }
		public set clipBounds(v: Rect) { 
			if (!Rect.equals(this._clipBounds, v)) {
				this._clipBounds = v; 
				this._onClipBoundsChanged();
			}
		}

		public get clip() { return this._clip; }
		public set clip(v: boolean) { 
			if (this._clip !== v) {
				this._clip = v; 
				this._onClipStateChanged();
			}
		}
		
		public draw(drawingContext: DrawingContext) {
			drawingContext.drawView(this);
		}
	}
	
	EntityTypeManager.registerType("View", VgxView);
}