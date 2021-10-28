
namespace Vgx {

	export class EntityTransform extends Cgx.Transform {

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