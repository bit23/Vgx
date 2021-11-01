
namespace Vgx {

    export class VgxEntityCollection extends ReactiveCollection<VgxEntity> {

        private _owner: any;

        constructor(owner?: any) {
            super();
            this._owner = owner;
        }


        // // override
        // protected _onInsertCompleted(index: number, items: VgxEntity[]) {
        //     super._onInsertCompleted(index, items);
        //     for (const item of items) {
        //         item._setParent(this._owner);
        //     }
        // }

        // // override
        // protected _onRemoveCompleted(index: number, items: VgxEntity[]) {
		// 	super._onRemoveCompleted(index, items);
        //     for (const item of items) {
        //         item._setParent(null);
        //     }
		// }

        // // override
        // protected _onClearCompleted(items: VgxEntity[]) {
		// 	super._onClearCompleted(items);
        //     for (const item of items) {
        //         item._setParent(null);
        //     }
		// }


        public ofType<T extends VgxEntity>(type: {new(): T}) {
            var items = this._getItems();
            return <T[]>items.filter(x => x instanceof type)
        }

        public get owner() { return this._owner; }
    }
}