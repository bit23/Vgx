/// <reference path="VgxDrawable.ts" />

namespace Vgx {

	export abstract class VgxEntity extends VgxDrawable {

		private _id: string;
		private _insertPointX = 0;
		private _insertPointY = 0;
		private _stroke: BrushDefinition = null;
		private _strokeWidth = Vars.defaultStrokeWidth;

		private _shadow: Shadow;
		private _transform: EntityTransform;
		private _cachedBounds: Rect;

		constructor() {
			super();

			this._stroke = "transparent";
			this._strokeWidth = 0;

			this._shadow = new Shadow();
			this._shadow.onPropertyChanged.add(function () { this.appearanceDirty = true; }, {});

			this._transform = new EntityTransform(this);

			this._cachedBounds = new Rect();
		}

		private _cloneBrushDefinition(brushDefinition: BrushDefinition): BrushDefinition {
			const typeofBrushDefinition = typeof brushDefinition;
			if (typeofBrushDefinition == "string" || typeofBrushDefinition == "number") {
				return brushDefinition;
			}
			else if (brushDefinition instanceof Array) { 
				return brushDefinition.slice(0);
			}
			else if (brushDefinition instanceof Cgx.Brush){
				return brushDefinition.clone() as any;
			}
		}

		// override
		protected _copyMembersValues(destination: VgxEntity): void {
			super._copyMembersValues(destination);
			destination._insertPointX = this._insertPointX;
			destination._insertPointY = this._insertPointY;
			destination._stroke = this._cloneBrushDefinition(this._stroke);
			destination._strokeWidth = this._strokeWidth;
			destination._shadow = this._shadow.clone();
			destination._transform = EntityTransform.fromEntity(destination, this.transform.clone());
		}


		// virtual
		protected _getVertices() {
			return [{
				x: this._getValue("insertPointX", this._insertPointX),
				y: this._getValue("insertPointY", this._insertPointY)
			}]
		}

		// virtual0
		protected _getBounds() {
			return Rect.empty;
		}


		// virtual
		public loadData(data: DynamicObject) : void {
			for (const n in data) {
				if (!(Reflect.has(this, n)))
					continue;
				const propDesc = Object.getOwnPropertyDescriptor(this, n);
				if (propDesc && (!propDesc.writable || !propDesc.get)) {
					// TODO log error: readonly property
				}
				else {
					Reflect.set(this, n, data[n]);
				}
			}
		}

		// abstract
		public abstract _getPath(): Path2D;

		// abstract
		//public abstract clone(): VgxEntity;

		public clone() {
			const type = this.constructor as any;
			const result = new type();
			this._copyMembersValues(result);
			return result;
		}


		public getBounds() {
			if (this.geometryDirty) {
				var bounds = this._getBounds();
				if (!this._transform.isIdentity) {
					var mtx = this.transform.getMatrix().clone();
					mtx.offsetX = -(this.insertPointX + this.transform.originX);
					mtx.offsetY = -(this.insertPointY + this.transform.originY);
					this._cachedBounds = Rect.from(mtx.transformRect(bounds.x, bounds.y, bounds.width, bounds.height));
				}
				else {
					this._cachedBounds = bounds;
				}
			}
			return this._cachedBounds;
		}

		public get id() { return this._id; }
		public set id(v: string) { this._id = v; }

		public get insertPointX() { return this._getValue("insertPointX", this._insertPointX); }
		public set insertPointX(v: number) {
			if (this._insertPointX != v) {
				this._insertPointX = v;
				this.positionDirty = true;
			}
		}

		public get insertPointY() { return this._getValue("insertPointY", this._insertPointY); }
		public set insertPointY(v: number) {
			if (this._insertPointY != v) {
				this._insertPointY = v;
				this.positionDirty = true;
			}
		}


		public get stroke() { return this._getValue("stroke", this._stroke); }
		public set stroke(v: BrushDefinition) {
			if (this._stroke != v) {
				this._stroke = v;
				this.appearanceDirty = true;
			}
		}

		public get strokeWidth() { return this._getValue("strokeWidth", this._strokeWidth); }
		public set strokeWidth(v: number) {
			if (this._strokeWidth != v) {
				this._strokeWidth = v;
				this.appearanceDirty = true;
			}
		}
		
		public get shadow() { return this._shadow; }

		public get transform() { return this._getValue("transform", this._transform); }
		public set transform(v: Transform) {
			this._transform.translationX = v.translationX;
			this._transform.translationY = v.translationY;
			this._transform.scaleX = v.scaleX;
			this._transform.scaleY = v.scaleY;
			this._transform.rotation = v.rotation;
			this._transform.originX = v.originX;
			this._transform.originY = v.originY;
		}
	}
}