
(function (lib) {

    var Utils = (function () {

        var _lastUUIDDate = Date.now();
        var Utils = {};


        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }


        Object.defineProperty(Utils, "createUUID", {
            value: function (includeSeparators) {
                var d = new Date().getTime();
                while (_lastUUIDDate === d) {
                    d = new Date().getTime();
                }
                _lastUUIDDate = d;
                var template = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
                if (includeSeparators)
                    template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
                var uuid = template.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            }
        });

        Object.defineProperty(Utils, "createCanvasColorOrBrush", {
            value: function (canvas, value) {
                if (typeof (value) === "number") {
                    return "#" + value.toString(16);
                }
                else if (typeof (value) === "string") {
                    return value;
                }
                else if (value instanceof Array) { // [r,g,b,a] | [r,g,b]
                    if (value.length == 3) {
                        return "rgb(" + value.join(",") + ")";
                    }
                    else if (value.length == 4) {
                        return "rgba(" + value.join(",") + ")";
                    }
                    else {
                        throw new Error("invalid length");
                    }
                }
                // TODO
                else if (value) {
                    return canvas.getContext("2d").createLinearGradient(value.x0, value.y0, value.x1, value.y1);
                }
                else if (value) {
                    return canvas.getContext("2d").createRadialGradient(value.x0, value.y0, value.r0, value.x1, value.y1, value.r1);
                }
                else if (value) {
                    return canvas.getContext("2d").createPattern(value.image, value.repetition);
                }
            }
        });

        Object.defineProperty(Utils, "hslToRgb", {
            value: function (h, s, l) {
                var r, g, b;
                if (s == 0) {
                    r = g = b = l;
                } else {
                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }
                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            }
        });

        return Utils;
    })();
    lib.Vgx.Utils = Utils;

})(library);