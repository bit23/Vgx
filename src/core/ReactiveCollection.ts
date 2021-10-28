/// <reference path="Collection.ts" />

namespace Vgx {

    export enum CollectionChangedAction {
		Added,
		Removed,
		Cleared
	}

	export interface CollectionChangedArgs<TElement extends any> extends EventArgs {
		readonly action: CollectionChangedAction;
		readonly index: number;
		readonly items: TElement[];
	}

	export class ReactiveCollection<TElement extends any> extends Collection<TElement> {

		private readonly _events: EventsManager;

		constructor() {
			super();
			this._events = new EventsManager(this);
			this.onCollectionChanged = new EventSet<ReactiveCollection<TElement>, CollectionChangedArgs<TElement>>(this._events, "onCollectionChanged");
		}

		private _raiseCollectionChanged(action: CollectionChangedAction, index: number, items: TElement[]) {
			this._events.trigger("onCollectionChanged", { 
				action,
				index,
				items
			});
		}

		public readonly onCollectionChanged: EventSet<ReactiveCollection<TElement>, CollectionChangedArgs<TElement>>;


		protected _onClearCompleted(items: TElement[]) {
			this._raiseCollectionChanged(CollectionChangedAction.Cleared, 0, items);
		}

		protected _onInsertCompleted(index: number, items: TElement[]) {
			this._raiseCollectionChanged(CollectionChangedAction.Added, index, items);
		}

        protected _onRemoveCompleted(index: number, items: TElement[]) {
			this._raiseCollectionChanged(CollectionChangedAction.Removed, index, items);
		}
	}

    // export class ReactiveCollection<TElement extends any> implements Iterable<TElement> {

	// 	private readonly _events: EventsManager;
	// 	private _items: TElement[];

	// 	constructor() {
	// 		this._events = new EventsManager(this);
	// 		this.onCollectionChanged = new EventSet<ReactiveCollection<TElement>, CollectionChangedArgs<TElement>>(this._events, "onCollectionChanged");
	// 		this._items = [];
	// 	}

	// 	*[Symbol.iterator](): Iterator<TElement, any, undefined> {
	// 		yield* this._items;
	// 	}

	// 	protected _raiseCollectionChanged(action: CollectionChangedAction, index: number, items: TElement[]) {
	// 		this._events.trigger("onCollectionChanged", { 
	// 			action,
	// 			index,
	// 			items
	// 		});
	// 	}

	// 	public readonly onCollectionChanged: EventSet<ReactiveCollection<TElement>, CollectionChangedArgs<TElement>>;


	// 	public add(item: TElement) {
	// 		return this.insert(this._items.length - 1, item);
	// 	}

	// 	public addRange(items: TElement[]) {
	// 		return this.insertRange(this._items.length - 1, items);
	// 	}

	// 	public clear() {
	// 		const oldItems = this._items;
	// 		this._items = [];
	// 		this._raiseCollectionChanged(CollectionChangedAction.Cleared, 0, oldItems);
	// 	}

	// 	public elementAt(index: number) {
	// 		return this._items[index];
	// 	}

	// 	public indexOf(value: any, selector: (x: TElement) => any = null) {
	// 		if (typeof selector === "function") {
	// 			let result = -1;
	// 			let i = 0;
	// 			for (const element of this._items) {
	// 				if (selector(element) === value) {
	// 					result = i;
	// 					break;
	// 				}
	// 				i++;
	// 			}
	// 			return result;
	// 		}
	// 		else {
	// 			return this._items.indexOf(value);
	// 		}
	// 	}

	// 	public insert(index: number, item: TElement) {
	// 		if (index < 0)
	// 			index = 0;
	// 		if (index >= this._items.length)
	// 			index = this._items.length;
	// 		if (index === this._items.length) {
	// 			this._items.push(item);
	// 		}
	// 		else {
	// 			this._items.splice(index, 0, item);
	// 		}
	// 		this._raiseCollectionChanged(CollectionChangedAction.Added, index, [item]);
	// 		return index;
	// 	}

	// 	public insertRange(index: number, items: TElement[]) {
	// 		let i;
	// 		if (index < 0)
	// 			index = 0;
	// 		if (index >= this._items.length)
	// 			index = this._items.length;
	// 		if (index === this._items.length) {
	// 			for (const item of items) {
	// 				this._items.push(item);
	// 			}
	// 		}
	// 		else {
	// 			this._items.splice(index, 0, ...items);
	// 		}
	// 		if (this._items.length > index) {
	// 			this._raiseCollectionChanged(CollectionChangedAction.Added, index, items);
	// 		}
	// 		return index;
	// 	}

	// 	public remove(value: any, selector: (x: TElement) => any = null) {
	// 		let itemIndex = this.indexOf(value, selector);
	// 		if (itemIndex === -1) {
	// 			return false;
	// 		}
	// 		const deletedItems = this._items.splice(itemIndex, 1);
	// 		this._raiseCollectionChanged(CollectionChangedAction.Removed, itemIndex, deletedItems);
	// 		return true;
	// 	}

	// 	public removeAt(index: number) {
	// 		if (index < 0 || index >= this._items.length) {
	// 			return null;
	// 		}
	// 		const deletedItems = this._items.splice(index, 1);
	// 		this._raiseCollectionChanged(CollectionChangedAction.Removed, index, deletedItems);
	// 		return deletedItems[0];
	// 	}

	// 	public removeAny(predicate: (x: TElement) => boolean) {
	// 		let deletedItems: any[] = [];
	// 		let index = -1;
	// 		let i = 0;
	// 		for (const element of this._items) {
	// 			if (predicate(element)) {
	// 				deletedItems.push(element);
	// 				if (index < 0) {
	// 					index = i;
	// 				}
	// 				this._items.splice(i, 1);
	// 			}
	// 			i++;
	// 		}
	// 		if (deletedItems.length > 0) {
	// 			this._raiseCollectionChanged(CollectionChangedAction.Removed, index, deletedItems );
	// 		}
	// 		return deletedItems;
	// 	}

    //     public toArray() {
    //         return this._items.slice(0);
    //     }


	// 	public get count() { return this._items.length; }
	// }
}