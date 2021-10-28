/// <reference path="VgxFillableEntity.ts" />

namespace Vgx {

	export class VgxGroup extends VgxFillableEntity {

		private _children: VgxEntityCollection;
		private _bounds: Rect;

		constructor() {
			super();
			this._children = new VgxEntityCollection(this);
			this._children.onCollectionChanged.add((s, e) => this.updateBounds());
		}


		//virtual override 
		protected _getBounds() {
			return this._bounds;
		}


		private updateBounds() {
			this._bounds = Utils.getEntitiesBounds(this._children, this.insertPointX, this.insertPointY);
		}

		//virtual override 
		public override loadData(data: DynamicObject) {
			super.loadData(data);
			if (Reflect.has(data, "children")) {
				this.children.clear();
				for (const childItem of data.children) {
					const typeName = childItem[0] as string;
					const childData = childItem[1];
					var childElement = DrawingLoader.loadChildEntity(typeName, childData);
					if (childElement != null)
						this.children.add(childElement);
				}
			}
		}

		//abstract override
		public _getPath(): Path2D {
			// TODO
			return null;
		}

		public get children() { return this._children; }

		
		public draw(drawingContext: DrawingContext) {
			drawingContext.drawGroup(this);
		}
	}
	
	EntityTypeManager.registerType("Group", "Vgx.VgxGroup");
}