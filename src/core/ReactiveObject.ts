
namespace Vgx {

	export interface PropertyChangedArgs extends EventArgs {
		readonly propertyName: string;
	}

	export class ReactiveObject {

		private readonly _events: EventsManager;

		constructor() {
			this._events = new EventsManager(this);
			this.onPropertyChanged = new EventSet<ReactiveObject, PropertyChangedArgs>(this._events, "onPropertyChanged");
		}

		protected _raisePropertyChanged(propertyName: string) {
			this._events.trigger("onPropertyChanged", { propertyName });
		}

		public readonly onPropertyChanged: EventSet<ReactiveObject, PropertyChangedArgs>;
	}
}