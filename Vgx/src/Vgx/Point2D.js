
(function (lib) {

    var Point2D = (function () {

        function Point2D(x, y) {

            var _self = this;

            Object.defineProperty(this, "x", {
                value: x || 0,
                writable: true
            });

            Object.defineProperty(this, "y", {
                value: y || 0,
                writable: true
            });


            Object.defineProperty(this, "add", {
                value: function (x, y) {
                    if (arguments.length === 1) {
                        // ci si aspetta un Point2D come parametro
                        var p = arguments[0];
                        x = p.x;
                        y = p.y;
                    }
                    _self.x += x;
                    _self.y += y;
                }
            });
        }

        Object.defineProperty(Point2D, "sumPoints", {
            value: function (p1, p2) {
                var r = new Point2D(p.x, p.y);
                r.add(p2);
                return r;
            }
        });

        Object.defineProperty(Point2D, "sumValues", {
            value: function (p, x, y) {
                var r = new Point2D(p.x, p.y);
                r.add(x, y);
                return r;
            }
        });


        Object.defineProperty(Point2D, "empty", { value: new Point2D(0, 0) });
        Object.defineProperty(Point2D, "invalid", { value: new Point2D(Number.NaN, Number.NaN) });

        return Point2D;
    })();
    lib.Vgx.Point2D = Point2D;

})(library);