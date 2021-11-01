
namespace Vgx {

	export class EntityTransform extends Cgx.Transform {

		public static fromEntity(entity: VgxEntity, transform: Cgx.Transform = null) {
			const result = new EntityTransform(entity);
			if (transform) {
				result.originX = transform.originX;
				result.originY = transform.originY;
				result.rotation = transform.rotation;
				result.scaleX = transform.scaleX;
				result.scaleY = transform.scaleY;
				result.translationX = transform.translationX;
				result.translationY = transform.translationY;
			}
			return result;
		}

		private _entity: VgxEntity;

		constructor(entity: VgxEntity) {
			super();

			this._entity = entity;
			this._propertyChanged = (propertyName) => {
				this._entity.geometryDirty = true;
			};
		}

		protected _propertyChanged: (propertyName: string) => void;
	}
}