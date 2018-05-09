
/// <reference path="../../Extra/Events.js" />

(function (lib) {

    var VgxObject = (function () {

        function VgxObject() {

            var _self = this;
            var _events = new lib.Extra.Events(this);
            var _drawing;
            var _handle = null;

            var _bindings = {};


            function removeFromDrawing() {
                if (_handle) {
                    _handle = null;
                    _events.raise("onHandleDestroyed", {});
                }
                if (_drawing) {
                    _drawing.removeChild(_self);
                }
            }

            function addToDrawing() {
                _handle = _drawing.getFreeHandle();
                _drawing.addChild(_self);
                //_drawing.children.add(_self);
                _self._addedToDrawing();
                _events.raise("onHandleCreated", {});
            }


            // @protected
            Object.defineProperty(this, "_getValue", {
                configurable: true,
                value: function (propertyName, staticValue) {
                    if (propertyName in _bindings) {
                        return _bindings[propertyName]();
                    } else {
                        return staticValue;
                    }
                }
            });

            // @protected
            Object.defineProperty(this, "_addedToDrawing", {
                value: function () { },
                configurable: true,
                enumerable: false
            });


            Object.defineProperty(this, "drawing", {
                get: function () { return _drawing; }
            });

            Object.defineProperty(this, "handle", {
                get: function () { return _handle; }
            });


            Object.defineProperty(this, "addToDrawing", {
                value: function (drawing) {
                    if (_drawing != drawing) {
                        // rimuove l'oggetto da un eventuale drawing precedente
                        removeFromDrawing();
                        // memorizza il nuovo drawing
                        _drawing = drawing;
                        // aggiunge l'oggetto al drawing
                        addToDrawing();
                    }
                }
            });

            Object.defineProperty(this, "removeFromDrawing", {
                value: function () {
                    removeFromDrawing();
                }
            });

            Object.defineProperty(this, "onHandleCreated", {
                value: new lib.Extra.EventGroup(_events, "onHandleCreated")
            });

            Object.defineProperty(this, "onHandleDestroyed", {
                value: new lib.Extra.EventGroup(_events, "onHandleDestroyed")
            });



            Object.defineProperty(this, "setBinding", {
                value: function (propertyName, binding) {
                    if (!binding) {
                        delete _bindings[propertyName];
                    } else {
                        _bindings[propertyName] = binding;
                    }
                }
            });
        }
        return VgxObject;
    })();
    lib.Vgx.VgxObject = VgxObject;

})(library);