
(function (lib) {

    var Rect = (function () {

        function Rect(x, y, width, height) {

            var _self = this;

            function union(rect) {
                if (!Rect.isEmpty(rect)) {
                    /*_self.x = 0;
                    _self.y = 0;
                    _self.width = 0;
                    _self.height = 0;
                }
                else {*/
                    var left = Math.min(_self.x, rect.x);
                    var top = Math.min(_self.y, rect.y);
                    if ((rect.width == Number.POSITIVE_INFINITY) || (_self.width == Number.POSITIVE_INFINITY)) {
                        _self.width = Number.POSITIVE_INFINITY;
                    }
                    else {
                        var right;
                        if (_self.width == Number.NEGATIVE_INFINITY || _self.x == Number.POSITIVE_INFINITY) {
                            right = rect.x + rect.width;
                        }
                        else {
                            right = Math.max(_self.x + _self.width, rect.x + rect.width);
                        }
                        _self.width = Math.max(right - left, 0.0);
                    }
                    if ((rect.height == Number.POSITIVE_INFINITY) || (_self.height == Number.POSITIVE_INFINITY)) {
                        _self.height = Number.POSITIVE_INFINITY;
                    }
                    else {
                        var bottom;
                        if (_self.height == Number.NEGATIVE_INFINITY || _self.y == Number.POSITIVE_INFINITY) {
                            bottom = rect.y + rect.height;
                        }
                        else {
                            bottom = Math.max(_self.y + _self.height, rect.y + rect.height);
                        }
                        _self.height = Math.max(bottom - top, 0.0);
                    }
                    _self.x = left;
                    _self.y = top;
                }
            }


            Object.defineProperty(this, "x", {
                value: x || 0,
                writable: true
            });

            Object.defineProperty(this, "y", {
                value: y || 0,
                writable: true
            });

            Object.defineProperty(this, "width", {
                value: width || 0,
                writable: true
            });

            Object.defineProperty(this, "height", {
                value: height || 0,
                writable: true
            });


            Object.defineProperty(this, "union", { value: union });

        }

        function createEmptyRect() {
            return new Rect(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        }

        function createInvalidRect() {
            return new Rect(Number.NaN, Number.NaN, Number.NaN, Number.NaN);
        }

        Object.defineProperty(Rect, "empty", { get: createEmptyRect });
        Object.defineProperty(Rect, "invalid", { get: createInvalidRect });

        Object.defineProperty(Rect, "isEmpty", {
            value: function (rect) {
                if (!Number.isFinite(rect.x) || !Number.isFinite(rect.y))
                    return true;
                return rect.width <= 0 && rect.height <= 0;
            }
        });

        return Rect;
    })();
    lib.Vgx.Rect = Rect;

})(library);