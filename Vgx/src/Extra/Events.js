

(function (lib) {

    var Events = (function () {

        function Events(owner) {

            var _self = this;
            var _owner = owner;
            var _eventNames = [];
            var _eventHandlerArrays = [];
            var _validEventOptions = ["autoRemoveOnFire"];
            var _eventOptionArrays = [];
            var _disabledEventsNames = [];


            function createOptionObject() {
                return {
                    autoRemoveOnFire: false
                };
            }

            function mergeEventOptions(eventName, handlerOptionsIndex, options) {
                var eventIndex = _eventNames.indexOf(eventName.toLowerCase());
                if (eventIndex === -1)
                    return;
                var eventOptionArray = _eventOptionArrays[eventIndex];
                var eventOptions = eventOptionArray[handlerOptionsIndex];
                for (var i = 0; i < _validEventOptions.length; i++) {
                    var n = _validEventOptions[i];
                    if (options.hasOwnProperty(n)) {
                        eventOptions[n] = options[n];
                    }
                }
            }


            Object.defineProperty(this, "attach", {
                value: function (eventName, eventHandler, eventOptions) {
                    // if undefined eventOptions
                    if (eventOptions === void 0) {
                        eventOptions = null;
                    }
                    if (typeof eventHandler !== "function")
                        return;
                    var eventIndex = _eventNames.indexOf(eventName.toLowerCase());
                    var eventHandlerArray = null;
                    var eventOptionArray = null;
                    var handlerOptionsIndex = -1;
                    if (eventIndex === -1) {
                        eventHandlerArray = [eventHandler];
                        _eventHandlerArrays.push(eventHandlerArray);
                        eventOptionArray = [createOptionObject()];
                        _eventOptionArrays.push(eventOptionArray);
                        handlerOptionsIndex = 0;
                        _eventNames.push(eventName.toLowerCase());
                        eventIndex = _eventNames.length - 1;
                    }
                    else {
                        eventHandlerArray = _eventHandlerArrays[eventIndex];
                        eventOptionArray = _eventOptionArrays[eventIndex];
                        var eventHandlerIndex = eventHandlerArray.indexOf(eventHandler);
                        if (eventHandlerIndex === -1) {
                            eventHandlerArray.push(eventHandler);
                            eventOptionArray.push(createOptionObject());
                            handlerOptionsIndex = eventOptionArray.length - 1;
                        }
                        else {
                            handlerOptionsIndex = eventHandlerIndex;
                        }
                    }
                    if (eventOptions) {
                        mergeEventOptions(eventName, handlerOptionsIndex, eventOptions);
                    }
                }
            });

            Object.defineProperty(this, "detach", {
                value: function (eventName, eventHandler) {
                    if (typeof eventHandler !== "function")
                        return;
                    var eventIndex = _eventNames.indexOf(eventName.toLowerCase());
                    if (eventIndex === -1)
                        return;
                    var eventHandlerArray = _eventHandlerArrays[eventIndex];
                    var eventHandlerIndex = eventHandlerArray.indexOf(eventHandler);
                    if (eventHandlerIndex === -1)
                        return;
                    var eventOptionArray = _eventOptionArrays[eventIndex];
                    eventHandlerArray.splice(eventHandlerIndex, 1);
                    eventOptionArray.splice(eventHandlerIndex, 1);
                }
            });

            Object.defineProperty(this, "raise", {
                value: function (eventName, argsObj) {
                    argsObj = argsObj || {};
                    var eventIndex = _eventNames.indexOf(eventName.toLowerCase());
                    if (eventIndex === -1)
                        return;
                    var disabledEventIndex = _disabledEventsNames.indexOf(eventName.toLowerCase());
                    if (disabledEventIndex !== -1 || _disabledEventsNames.indexOf("*") !== -1)
                        return;
                    var eventHandlerArray = _eventHandlerArrays[eventIndex];
                    var eventOptionArray = _eventOptionArrays[eventIndex];
                    for (var i = 0; i < eventHandlerArray.length; i++) {
                        var currentHandler = eventHandlerArray[i];
                        var currentOptions = eventOptionArray[i];
                        // TODO: handle options
                        var removeAfter = false;
                        if (Object.keys(currentOptions).indexOf("autoRemoveOnFire") != -1)
                            removeAfter = !!currentOptions.autoRemoveOnFire;
                        currentHandler(_owner, argsObj);
                        if (removeAfter)
                            this.detach(eventName, currentHandler);
                    }
                }
            });

            Object.defineProperty(this, "getHandlers", {
                value: function (eventName) {
                    var eventIndex = _eventNames.indexOf(eventName.toLowerCase());
                    if (eventIndex === -1)
                        return null;
                    return _eventHandlerArrays[eventIndex].slice(0);
                }
            });

            Object.defineProperty(this, "getHandlersCount", {
                value: function (eventName) {
                    var eventIndex = _eventNames.indexOf(eventName.toLowerCase());
                    if (eventIndex === -1)
                        return 0;
                    return _eventHandlerArrays[eventIndex].length;
                }
            });

            Object.defineProperty(this, "hasHandlers", {
                value: function (eventName) {
                    return _eventNames.indexOf(eventName.toLowerCase()) >= 0;
                }
            });

            Object.defineProperty(this, "contains", {
                value: function (eventName, eventHandler) {
                    var eventIndex = _eventNames.indexOf(eventName.toLowerCase());
                    if (eventIndex === -1)
                        return false;
                    var eventHandlerArray = _eventHandlerArrays[eventIndex];
                    return eventHandlerArray.indexOf(eventHandler) !== -1;
                }
            });

            Object.defineProperty(this, "stop", {
                value: function (optEventName) {
                    if (typeof optEventName === "undefined") {
                        _disabledEventsNames = ["*"];
                    }
                    else if (typeof optEventName === "string") {
                        var eventIndex = _disabledEventsNames.indexOf(optEventName.toLowerCase());
                        if (eventIndex != -1)
                            return;
                        _disabledEventsNames.push(optEventName.toLowerCase());
                    }
                }
            });

            Object.defineProperty(this, "resume", {
                value: function (optEventName) {
                    if (typeof optEventName === "undefined") {
                        _disabledEventsNames = [];
                    }
                    else if (typeof optEventName === "string") {
                        var eventIndex = _disabledEventsNames.indexOf(optEventName.toLowerCase());
                        if (eventIndex == -1)
                            return;
                        _disabledEventsNames.splice(eventIndex, 1);
                    }
                }
            });

            Object.defineProperty(this, "create", {
                value: function (name) {
                    var eventGroupObj = new EventGroup(_self, name);
                    var descriptor = {
                        enumerable: true,
                        value: eventGroupObj
                    };
                    Object.defineProperty(_owner, name, descriptor);
                    return eventGroupObj;
                }
            });
        }

        return Events;
    })();
    lib.Extra.Events = Events;


    var EventGroup = (function () {

        function EventGroup(eventsClass, eventName) {

            var _events = eventsClass;
            var _name = eventName;


            Object.defineProperty(this, "addHandler", {
                value: function (handler, options) {
                    _events.attach(_name, handler, options);
                }
            });

            Object.defineProperty(this, "removeHandler", {
                value: function (handler) {
                    _events.detach(_name, handler);
                }
            });

            Object.defineProperty(this, "containsHandler", {
                value: function (handler) {
                    return _events.contains(_name, handler);
                }
            });

            Object.defineProperty(this, "stop", {
                value: function () {
                    _events.stop(_name);
                }
            });

            Object.defineProperty(this, "resume", {
                value: function () {
                    _events.resume(_name);
                }
            });
        }

        return EventGroup;
    })();
    lib.Extra.EventGroup = EventGroup;

})(library);

