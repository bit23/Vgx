
namespace Vgx {

    export class VgxEntityCollection extends ReactiveCollection<VgxEntity> {

        private _owner: any;

        constructor(owner?: any) {
            super();
            this._owner = owner;
        }

        public ofType<T extends VgxEntity>(type: {new(): T}) {
            var items = this._getItems();
            return <T[]>items.filter(x => x instanceof type)
        }

        public get owner() { return this._owner; }
    }
}