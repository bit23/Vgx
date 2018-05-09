/// <reference path="../../Extra/Collection.js" />
/// <reference path="../Rect.js" />
/// <reference path="../Point2D.js" />
/// <reference path="../Utils.js" />

(function (lib) {

    var Drawing = (function () {

        function Drawing() {

            var _self = this;
            var _usedHandles = new Array();
            var _children = new lib.Extra.Collection();
            var _isDirty = true;
            var _background = null;

            //var _events = new Events(this);
            //var _redrawEvent = new EventGroup(_events, "_needRedraw");
            var _redrawHandlers = [];

            //_children.onItemsAdded.addHandler(function (sender, args) {
            //    if (args.items) {
            //        for (var i = 0; i < args.items; i++) {
            //            args.items[i].addToDrawing(_self);
            //        }
            //    }
            //});
            //_children.onItemsRemoved.addHandler(function (sender, args) {
            //});
            //_children.onCollectionCleared.addHandler(function (sender, args) {
            //});

            Object.defineProperty(this, "_registerDirtyEventHandler", {
                value: function (eventHandler) {
                    if (typeof eventHandler === "function") {
                        _redrawHandlers.push(eventHandler);
                    }
                }
            });

            Object.defineProperty(this, "_unregisterDirtyEventHandler", {
                value: function (eventHandler) {
                    if (typeof eventHandler === "function") {
                        var index;
                        while ((index = _redrawHandlers.indexOf(eventHandler)) >= 0) {
                            _redrawHandlers.splice(index, 1);
                        }
                    }
                }
            });


            Object.defineProperty(this, "background", {
                get: function () { return _background; },
                set: function (v) {
                    var vType = typeof v;
                    if ((vType === "number" || vType === "string") || (v instanceof CanvasGradient || v instanceof CanvasPattern)) {
                        if (_background != v) {
                            _background = v;
                            _self.isDirty = true;
                        }
                    }
                }
            });

            Object.defineProperty(this, "isDirty", {
                get: function () { return _isDirty; },
                set: function (v) {
                    v = !!v;
                    if (_isDirty != v) {
                        _isDirty = v;
                        // TODO
                        _redrawHandlers.forEach((v, i, a) => v());
                    }
                }
            });

            this.getFreeHandle = function () {
                var handle;
                do {
                    handle = lib.Vgx.Utils.createUUID(false).substr(0, 8);
                } while (_usedHandles.indexOf(handle) != -1);
                _usedHandles.push(handle);
                return handle;
            };

            this.addChild = function (vgxObject) {

                if (vgxObject.drawing != _self) {
                    vgxObject.addToDrawing(_self);
                    return;
                }

                _children.add(vgxObject);
                _self.isDirty = true;
            };

            this.removeChild = function (vgxObject) {
                var result = _children.remove(vgxObject);
                _self.isDirty = true;
                return result;
            };

            this.getChildren = function () {
                return _children.toArray();
            };

            this.clear = function () {
                _children.clear();
                _self.isDirty = true;
            };

            this.getBounds = function () {
                var result = lib.Vgx.Rect.empty;
                if (_children.length > 0) {
                    _children.forEach(function (v, i, o) {
                        var childBounds = v.getBounds();
                        result.union(childBounds);
                    });
                }
                return result;
            };
        }

        Object.defineProperty(Drawing, "fromJSON", {
            value: function (json) {
                var jobject = JSON.parse(json);
                return lib.Vgx.DrawingLoader.loadFromObject(jobject);
            }
        });

        Object.defineProperty(Drawing, "fromScript", {
            value: function (script) {
                var drawing = new lib.Vgx.Drawing();
                eval(script);
                return drawing;
            }
        });

        return Drawing;
    })();
    lib.Vgx.Drawing = Drawing;

})(library);