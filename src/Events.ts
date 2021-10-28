
namespace Vgx {

    export interface EventArgs { [name: string]: any };

    export type EventHandler<TOwner, TArgs> = (sender: TOwner, eventArgs: TArgs) => void;

    export interface EventOptions {
        once: boolean;
    }

    export interface EventGroup<T, TArgs> {
        eventName: string;
        entries: Array<EventEntry<T, TArgs>>;
    }

    export interface EventEntry<T, TArgs> {
        handler: EventHandler<T, TArgs>;
        options: EventOptions;
        bindTarget: any
    }

    export interface IEventSet<TOwner, TArgs> {
        add(handler: EventHandler<TOwner, TArgs>): void;
        once(handler: EventHandler<TOwner, TArgs>): void;
        remove(handler: EventHandler<TOwner, TArgs>): void;
        has(handler: EventHandler<TOwner, TArgs>): boolean;
        trigger(args?: TArgs): void;
        stop(): void;
        resume(): void;
    }


    export class EventSet<TOwner, TArgs> implements IEventSet<TOwner, TArgs> {

        private _eventsManager: EventsManager;
        private _eventName: string;
        private _bindTarget: any;

        constructor(eventGroup: EventsManager, eventName: string, bindTarget?: any) {
            this._bindTarget = bindTarget;
            this._eventsManager = eventGroup;
            this._eventName = eventName;
        }

        add(handler: EventHandler<TOwner, TArgs>, bindTarget?: any): void {
            this._eventsManager.attach<TArgs>(this._eventName, handler, { once: false }, bindTarget || this._bindTarget);
        }
        once(handler: EventHandler<TOwner, TArgs>): void {
            this._eventsManager.attach<TArgs>(this._eventName, handler, { once: true }, this._bindTarget);
        }
        remove(handler: EventHandler<TOwner, TArgs>): void {
            this._eventsManager.detach<TArgs>(this._eventName, handler);
        }
        has(handler: EventHandler<TOwner, TArgs>): boolean {
            return this._eventsManager.hasHandler<TArgs>(this._eventName, handler);
        }
        trigger(args?: TArgs): void {
            this._eventsManager.trigger(this._eventName, args);
        }
        stop(): void {
            this._eventsManager.stop(this._eventName);
        }
        resume(): void {
            this._eventsManager.resume(this._eventName);
        }
    }

    export class EventsManager {

        private readonly _owner: any;
        private readonly _validEventOptions = ["once"];

        private _events: Map<string, EventGroup<any, any>>;
        private _disabledEventsNames: string[] = [];

        constructor(owner: any) {
            this._owner = owner;
            this._events = new Map<string, EventGroup<any, any>>();
        }


        private getHandlerEntryIndex<TArgs>(evntGroup: EventGroup<any, TArgs>, eventHandler: EventHandler<any, TArgs>): number {
            var positions = evntGroup.entries.map((v, i) => v.handler === eventHandler ? i : -1).filter(v => v >= 0);
            if (positions.length == 0) {
                return -1;
            }
            return positions[0];
        }

        public attach<TArgs>(eventName: string, eventHandler: EventHandler<any, TArgs>, eventOptions?: EventOptions, bindTarget?: any) {

            if (typeof eventHandler !== "function") {
                return;
            }

            let lowerEventName = eventName.toLowerCase();

            let eventEntry = {
                handler: eventHandler,
                options: eventOptions,
                bindTarget: bindTarget
            };

            if (this._events.has(lowerEventName)) {
                let eventGroupEntry = this._events.get(lowerEventName);
                eventGroupEntry.entries.push(eventEntry);
            }
            else {
                let eventGroupEntry: EventGroup<any, TArgs> = {
                    eventName: eventName,
                    entries: [eventEntry]
                };
                this._events.set(lowerEventName, eventGroupEntry);
            }
        }

        public detach<TArgs>(eventName: string, eventHandler: EventHandler<any, TArgs>) {

            if (typeof eventHandler !== "function") {
                return;
            }

            let lowerEventName = eventName.toLowerCase();

            if (!this._events.has(lowerEventName)) {
                return;
            }

            let eventGroupEntry = this._events.get(lowerEventName);

            let entryIndex = this.getHandlerEntryIndex(eventGroupEntry, eventHandler);
            if (entryIndex >= 0) {
                eventGroupEntry.entries.splice(entryIndex, 1);
            }
        }

        public trigger<TArgs>(eventName: string, args?: TArgs) {

            var lowerEventName = eventName.toLowerCase();

            if (!this._events.has(lowerEventName)) {
                return;
            }

            let eventGroupEntry = this._events.get(lowerEventName);

            var disabledEventIndex = this._disabledEventsNames.indexOf(lowerEventName);
            if (disabledEventIndex !== -1 || this._disabledEventsNames.indexOf("*") !== -1)
                return;

            let handlersToDetach: Array<EventHandler<any, TArgs>> = [];

            for (let eventEntry of eventGroupEntry.entries) {

                let handler = eventEntry.handler;
                if (eventEntry.bindTarget) {
                    handler = eventEntry.handler.bind(eventEntry.bindTarget);
                }

                // TODO: handle options 
                let removeAfter = false;
                if (eventEntry.options && "once" in eventEntry.options) {
                    removeAfter = !!eventEntry.options.once;
                }

                handler(this._owner, args);

                if (removeAfter) {
                    handlersToDetach.push(handler);
                }
            }

            for (let detachableHandler of handlersToDetach) {
                this.detach(eventName, detachableHandler);
            }
        }

        public getHandlersCount(eventName: string): number {
            let lowerEventName = eventName.toLowerCase();
            if (!this._events.has(lowerEventName)) {
                return 0;
            }
            return this._events.get(lowerEventName).entries.length;
        }

        public hasHandler<TArgs>(eventName: string, eventHandler: EventHandler<any, TArgs>): boolean {
            if (typeof eventHandler !== "function") {
                return false;
            }
            let lowerEventName = eventName.toLowerCase();
            if (!this._events.has(lowerEventName)) {
                return false;
            }
            let eventGroupEntry = this._events.get(lowerEventName);
            return this.getHandlerEntryIndex(eventGroupEntry, eventHandler) >= 0;
        }

        public stop(eventName?: string) {
            if (typeof eventName === "undefined") {
                this._disabledEventsNames = ["*"];
            }
            else if (typeof eventName === "string") {
                var eventIndex = this._disabledEventsNames.indexOf(eventName.toLowerCase());
                if (eventIndex != -1)
                    return;
                this._disabledEventsNames.push(eventName.toLowerCase());
            }
        }

        public resume(eventName?: string) {
            if (typeof eventName === "undefined") {
                this._disabledEventsNames = [];
            }
            else if (typeof eventName === "string") {
                var eventIndex = this._disabledEventsNames.indexOf(eventName.toLowerCase());
                if (eventIndex == -1)
                    return;
                this._disabledEventsNames.splice(eventIndex, 1);
            }
        }

        public create<TArgs>(eventName: string) {
            var eventGroupObj = new EventSet<any, TArgs>(this, eventName);
            var descriptor = {
                enumerable: true,
                value: eventGroupObj
            };
            if (!(eventName in this._owner)) {
                Object.defineProperty(this._owner, eventName, descriptor);
            }
            return eventGroupObj;
        }

        public createEventArgs(data?: { [name: string]: any }): EventArgs {
            var result: EventArgs = {};
            if (typeof data === "object") {
                for (let k in Object.keys(data)) {
                    result[k] = data[k];
                }
            }
            return result;
        }
    }
}