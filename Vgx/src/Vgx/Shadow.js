/// <reference path="../Extra/Events.js" />

(function (lib) {

    var Shadow = (function () {

        function Shadow() {
            var _events = new lib.Extra.Events(this);
            var _blur = 0;
            var _color = "rgba(0,0,0,0)";
            var _offsetX = 0;
            var _offsetY = 0;


            function onPropertyChanged(propertyName) {
                _events.raise("onPropertyChanged", { propertyName: propertyName });
            }


            Object.defineProperty(this, "clone", {
                value: function () {
                    var result = new Shadow();
                    result.blur = _blur;
                    result.color = _color;
                    result.offsetX = _offsetX;
                    result.offsetY = _offsetY;
                    return result;
                }
            });


            Object.defineProperty(this, "blur", {
                get: function () { return _blur; },
                set: function (v) {
                    if (typeof (v) === "number") {
                        if (_blur != v) {
                            _blur = v;
                            onPropertyChanged("blur");
                        }
                    }
                }
            });

            Object.defineProperty(this, "color", {
                get: function () { return _color; },
                set: function (v) {
                    if (typeof (v) === "number" || typeof (v) === "string") {
                        if (_color != v) {
                            _color = v;
                            onPropertyChanged("color");
                        }
                    }
                }
            });

            Object.defineProperty(this, "offsetX", {
                get: function () { return _offsetX; },
                set: function (v) {
                    if (typeof (v) === "number") {
                        if (_offsetX != v) {
                            _offsetX = v;
                            onPropertyChanged("offsetX");
                        }
                    }
                }
            });

            Object.defineProperty(this, "offsetY", {
                get: function () { return _offsetY; },
                set: function (v) {
                    if (typeof (v) === "number") {
                        if (_offsetY != v) {
                            _offsetY = v;
                            onPropertyChanged("offsetY");
                        }
                    }
                }
            });

            Object.defineProperty(this, "isDefault", {
                get: function () {
                    if (_blur == 0) {
                        if (_color == "rgba(0,0,0,0)") {
                            if (_offsetX == 0) {
                                if (_offsetY == 0) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
            });

            _events.create("onPropertyChanged");
        }

        return Shadow;
    })();
    lib.Vgx.Shadow = Shadow;

})(library);