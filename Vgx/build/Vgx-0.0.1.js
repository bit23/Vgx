var library = {
    Cgx: {},
    Extra: {},
    Vgx: {}
};

(function (lib) {

    var Matrix = (function () {


        function Matrix(m11, m12, m21, m22, offsetX, offsetY) {

            var _self = this;

            function isZero(value) {
                return (Math.abs(value) < 2.2204460492503131E-15);
            }

            function multiplyPoint(x, y) {
                var ox = (y * _self.m21) + _self.offsetX;
                var oy = (x * _self.m12) + _self.offsetY;
                x *= _self.m11;
                x += ox;
                y *= _self.m22;
                y += oy;
                return { x: x, y: y };
            }

            function getDeterminant() {
                return ((_self.m11 * _self.m22) - (_self.m21 * _self.m12));
            }

            function clone() {
                return new Matrix(_self.m11, _self.m12, _self.m21, _self.m22, _self.offsetX, _self.offsetY);
            }

            function hasInverse() {
                return !isZero(getDeterminant());
            }

            function isIdentity() {
                return (_self.m11 == 1.0 && _self.m12 == 0.0 && _self.m21 == 0.0 && _self.m22 == 1.0 && _self.offsetX == 0.0 && _self.offsetY == 0.0);
            }

            function reset() {
                _self.m11 = 1.0;
                _self.m12 = 0.0;
                _self.m21 = 0.0;
                _self.m22 = 1.0;
                _self.offsetX = 0.0;
                _self.offsetY = 0.0;
            }

            function rotate(angle) {
                angle = angle % 360.0;
                var rotationMatrix = createRotationRadians(angle * 0.017453292519943295, 0.0, 0.0);
                multiplyRefMatrix(_self, rotationMatrix);
            }

            function rotateAt(angle, centerX, centerY) {
                angle = angle % 360.0;
                var rotationMatrix = createRotationRadians(angle * 0.017453292519943295, centerX, centerY);
                multiplyRefMatrix(_self, rotationMatrix);
            }

            function scale(scaleX, scaleY) {
                var scaleMatrix = new Matrix(scaleX, 0.0, 0.0, scaleY, 0.0, 0.0);
                multiplyRefMatrix(_self, scaleMatrix);
            }

            function scaleAt(scaleX, scaleY, centerX, centerY) {
                var scaleAtMatrix = new Matrix(scaleX, 0.0, 0.0, scaleY, centerX - (scaleX * centerX), centerY - (scaleY * centerY));
                multiplyRefMatrix(_self, scaleAtMatrix);
            }

            function skew(skewX, skewY) {
                skewX = (skewX % 360.0) * 0.017453292519943295;
                skewY = (skewY % 360.0) * 0.017453292519943295;
                var skewMatrix = new Matrix(1.0, Math.tan(skewY), Math.tan(skewX), 1.0, 0.0, 0.0);
                multiplyRefMatrix(_self, skewMatrix);
            }

            function transformPoint(x, y) {
                return multiplyPoint(x, y);
            }

            function transformRect(x, y, width, height) {
                var endX = x + width;
                var endY = y + height;
                var start = multiplyPoint(x, y);
                var end = multiplyPoint(endX, endY);
                var lx, ly, lw, lh;
                lx = start.x;
                ly = start.y;
                lw = end.x - lx;
                lh = end.y - ly;
                return { x: lx, y: ly, width: lw, height: lh };
            }

            function translate(offsetX, offsetY) {
                _self.offsetX += offsetX;
                _self.offsetY += offsetY;
            }



            Object.defineProperty(this, "m11", { value: m11 || 1.0, configurable: false, writable: true });
            Object.defineProperty(this, "m12", { value: m12 || 0.0, configurable: false, writable: true });
            Object.defineProperty(this, "m21", { value: m21 || 0.0, configurable: false, writable: true });
            Object.defineProperty(this, "m22", { value: m22 || 1.0, configurable: false, writable: true });
            Object.defineProperty(this, "offsetX", { value: offsetX || 0.0, configurable: false, writable: true });
            Object.defineProperty(this, "offsetY", { value: offsetY || 0.0, configurable: false, writable: true });

            Object.defineProperty(this, "clone", { value: clone });
            Object.defineProperty(this, "hasInverse", { value: hasInverse });
            Object.defineProperty(this, "isIdentity", { value: isIdentity });
            Object.defineProperty(this, "reset", { value: reset });
            Object.defineProperty(this, "rotate", { value: rotate });
            Object.defineProperty(this, "rotateAt", { value: rotateAt });
            Object.defineProperty(this, "scale", { value: scale });
            Object.defineProperty(this, "scaleAt", { value: scaleAt });
            Object.defineProperty(this, "skew", { value: skew });
            Object.defineProperty(this, "transformPoint", { value: transformPoint });
            Object.defineProperty(this, "transformRect", { value: transformRect });
            Object.defineProperty(this, "translate", { value: translate });

        }


        //#region static members

        function createRotationRadians(angle, centerX, centerY) {
            var sinAngle = Math.sin(angle);
            var cosAngle = Math.cos(angle);
            var offsetX = (centerX * (1.0 - cosAngle)) + (centerY * sinAngle);
            var offsetY = (centerY * (1.0 - cosAngle)) - (centerX * sinAngle);
            return new Matrix(cosAngle, sinAngle, -sinAngle, cosAngle, offsetX, offsetY);
        }

        function multiplyRefMatrix(refMatrix, matrix) {
            var m11 = (refMatrix.m11 * matrix.m11) + (refMatrix.m12 * matrix.m21);
            var m12 = (refMatrix.m11 * matrix.m12) + (refMatrix.m12 * matrix.m22);
            var m21 = (refMatrix.m21 * matrix.m11) + (refMatrix.m22 * matrix.m21);
            var m22 = (refMatrix.m21 * matrix.m12) + (refMatrix.m22 * matrix.m22);
            var m31 = ((refMatrix.offsetX * matrix.m11) + (refMatrix.offsetY * matrix.m21)) + matrix.offsetX;
            var m32 = ((refMatrix.offsetX * matrix.m12) + (refMatrix.offsetY * matrix.m22)) + matrix.offsetY;
            refMatrix.m11 = m11;
            refMatrix.m12 = m12;
            refMatrix.m21 = m21;
            refMatrix.m22 = m22;
            refMatrix.offsetX = m31;
            refMatrix.offsetY = m32;
        }

        function invert(matrix) {
            var determinant = (matrix.m11 * matrix.m22) - (matrix.m21 * matrix.m12);
            if (Math.abs(determinant) < 1.401298E-45) {
                return new Matrix(Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN);
            }
            var inverseDeterminant = 1.0 / determinant;
            var m11 = matrix.m22 * inverseDeterminant;
            var m12 = -matrix.m12 * inverseDeterminant;
            var m21 = -matrix.m21 * inverseDeterminant;
            var m22 = matrix.m11 * inverseDeterminant;
            var m31 = ((matrix.m21 * matrix.offsetY) - (matrix.offsetX * matrix.m22)) * inverseDeterminant;
            var m32 = ((matrix.offsetX * matrix.m12) - (matrix.m11 * matrix.offsetY)) * inverseDeterminant;
            return new Matrix(m11, m12, m21, m22, m31, m32);
        }

        function multiplyMatrix(matrix1, matrix2) {
            var m11 = (matrix1.m11 * matrix2.m11) + (matrix1.m12 * matrix2.m21);
            var m12 = (matrix1.m11 * matrix2.m12) + (matrix1.m12 * matrix2.m22);
            var m21 = (matrix1.m21 * matrix2.m11) + (matrix1.m22 * matrix2.m21);
            var m22 = (matrix1.m21 * matrix2.m12) + (matrix1.m22 * matrix2.m22);
            var m31 = ((matrix1.offsetX * matrix2.m11) + (matrix1.offsetY * matrix2.m21)) + matrix2.offsetX;
            var m32 = ((matrix1.offsetX * matrix2.m12) + (matrix1.offsetY * matrix2.m22)) + matrix2.offsetY;
            return new Matrix(m11, m12, m21, m22, m31, m32);
        }

        function multiplyValue(matrix, value) {
            var m11 = matrix.m11 * value;
            var m12 = matrix.m12 * value;
            var m21 = matrix.m21 * value;
            var m22 = matrix.m22 * value;
            var m31 = matrix.offsetX * value;
            var m32 = matrix.offsetY * value;
            return new Matrix(m11, m12, m21, m22, m31, m32);
        }


        Object.defineProperty(Matrix, "identity", { value: new Matrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0) });
        Object.defineProperty(Matrix, "invert", { value: invert });
        Object.defineProperty(Matrix, "multiplyMatrix", { value: multiplyMatrix });
        Object.defineProperty(Matrix, "multiplyValue", { value: multiplyValue });


        //#endregion


        return Matrix;
    })();
    lib.Cgx.Matrix = Matrix;

})(library);


(function (lib) {

    var Transform = (function () {

        function Transform() {

            var _self = this;
            var _matrix = null;
            var _isDirty = true;
            var _originX = 0.0;
            var _originY = 0.0;
            var _translationX = 0.0;
            var _translationY = 0.0;
            var _scaleX = 1.0;
            var _scaleY = 1.0;
            var _rotation = 0.0;


            Object.defineProperty(this, "_propertyChanged", {
                enumerable: false,
                configurable: true,
                value: function (propertyName) {
                }
            });

            Object.defineProperty(this, "originX", {
                get: function () { return _originX; },
                set: function (v) {
                    if (typeof v === "number") {
                        if (_originX !== v) {
                            _originX = v;
                            _isDirty = true;
                            _self._propertyChanged("originX");
                        }
                    }
                }
            });

            Object.defineProperty(this, "originY", {
                get: function () { return _originY; },
                set: function (v) {
                    if (typeof v === "number") {
                        if (_originY !== v) {
                            _originY = v;
                            _isDirty = true;
                            _self._propertyChanged("originY");
                        }
                    }
                }
            });


            Object.defineProperty(this, "translationX", {
                get: function () { return _translationX; },
                set: function (v) {
                    if (typeof v === "number") {
                        if (_translationX !== v) {
                            _translationX = v;
                            _isDirty = true;
                            _self._propertyChanged("translationX");
                        }
                    }
                }
            });

            Object.defineProperty(this, "translationY", {
                get: function () { return _translationY; },
                set: function (v) {
                    if (typeof v === "number") {
                        if (_translationY !== v) {
                            _translationY = v;
                            _isDirty = true;
                            _self._propertyChanged("translationY");
                        }
                    }
                }
            });


            Object.defineProperty(this, "scaleX", {
                get: function () { return _scaleX; },
                set: function (v) {
                    if (typeof v === "number") {
                        if (_scaleX !== v) {
                            _scaleX = v;
                            _isDirty = true;
                            _self._propertyChanged("scaleX");
                        }
                    }
                }
            });

            Object.defineProperty(this, "scaleY", {
                get: function () { return _scaleY; },
                set: function (v) {
                    if (typeof v === "number") {
                        if (_scaleY !== v) {
                            _scaleY = v;
                            _isDirty = true;
                            _self._propertyChanged("scaleY");
                        }
                    }
                }
            });


            Object.defineProperty(this, "rotation", {
                get: function () { return _rotation; },
                set: function (v) {
                    if (typeof v === "number") {
                        if (_rotation !== v) {
                            _rotation = v;
                            _isDirty = true;
                            _self._propertyChanged("rotation");
                        }
                    }
                }
            });


            Object.defineProperty(this, "getMatrix", {
                value: function () {
                    if (_matrix == null || _isDirty) {
                        _matrix = new lib.Cgx.Matrix();
                        _matrix.translate(_self.translationX, _self.translationY);
                        _matrix.rotate(_self.rotation);
                        _matrix.scale(_self.scaleX, _self.scaleY);
                    }
                    return _matrix;
                }
            });


            Object.defineProperty(this, "isIdentity", {
                get: function () {
                    if (_translationX == 0 && _translationY == 0) {
                        if (_scaleX == 1 && _scaleY == 1) {
                            if (_rotation == 0) {
                                return true;
                            }
                        }
                    }
                    return false;
                }
            });


            Object.defineProperty(this, "reset", {
                value: function () {
                    _originX = 0.0;
                    _originY = 0.0;
                    _translationX = 0.0;
                    _translationY = 0.0;
                    _scaleX = 1.0;
                    _scaleY = 1.0;
                    _rotation = 0.0;
                    _matrix = null;
                }
            });

            Object.defineProperty(this, "setDirty", {
                value: function () {
                    _isDirty = true;
                }
            });


            Object.defineProperty(this, "transformPoint", {
                value: function (x, y) {
                    return _self.getMatrix().transformPoint(x, y);
                }
            });

            Object.defineProperty(this, "transformRect", {
                value: function (x, y, width, height) {
                    return _self.getMatrix().transformRect(x, y, width, height);
                }
            });

        }

        return Transform;

    })();
    lib.Cgx.Transform = Transform;

})(library);


(function (lib) {

    /**
     * #type: <Vgx> internal abstract class <Brush>
     * #description: Abstact class Brush, use only for inheritation
     */
    var Brush = (function () {

        /**
         * #type: <Vgx.Brush> constructor
         * #description: Brush constructor, used by inherited classes
         * #param: <type> {string} The type of brush ('linear'|'radial'|'pattern')
         */
        function Brush(type) {

            var _brushType = type;

            /**
             * #type: <Vgx.Brush> internal property get <_brushType>
             * #description: The type of brush
             * #valueType: {string}
             */
            Object.defineProperty(this, "_brushType", {
                get: function () {
                    return _brushType;
                },
                enumerable: false
            });
        }

        return Brush;
    })();
    lib.Cgx.Brush = Brush;


    /**
     * #type: <Vgx> internal abstract class <GradientBrush> extends <Vgx.Brush>
     * #description: Abstact class GradientBrush, use only for inheritation
     */
    var GradientBrush = (function () {

        /**
         * #type: <Vgx.GradientBrush> constructor
         * #description: GradientBrush constructor, used by inherited classes
         * #param: <type> {string} The type of brush ('linear'|'radial')
         */
        function GradientBrush(type) {
            Brush.apply(this, [type]);

            var _colorStops = [];

            /**
             * #type: <Vgx.GradientBrush> internal method <_getColorStops>
             * #description: The list of ColorStop in the gradient brush
             * #returnType: {Array<ColorStop>}
             */
            Object.defineProperty(this, "_getColorStops", {
                value: function () { return _colorStops; },
                enumerable: false
            });

            /**
             * #type: <Vgx.GradientBrush> public method <addColorStop>
             * #description: Add a new color stop to the gradient brush
             * #param: <offset> {number} Color stop offset
             * #param: <color> {number|string} Color stop color
             * #returnType: {void}
             */
            Object.defineProperty(this, "addColorStop", {
                value: function (offset, color) {
                    _colorStops.push({ offset: offset, color: color });
                }
            });
        }

        GradientBrush.prototype = Object.create(Brush.prototype);
        GradientBrush.prototype.consrtuctor = GradientBrush;

        return GradientBrush;
    })();
    lib.Cgx.GradientBrush = GradientBrush;


    /**
     * #type: <Vgx> public class <LinearGradientBrush> extends <Vgx.GradientBrush>
     * #description: LinearGradientBrush class
     */
    var LinearGradientBrush = (function () {

        /**
         * #type: <Vgx.LinearGradientBrush> constructor
         * #description: LinearGradientBrush constructor
         */
        function LinearGradientBrush() {
            GradientBrush.apply(this, ["linear"]);

            /**
             * #type: <Vgx.Brush> public property get set <x0>
             * #description: Represents the x coordinate of the starting point
             * #valueType: {number}
             */
            Object.defineProperty(this, "x0", {
                writable: true,
                value: 0
            });

            /**
             * #type: <Vgx.Brush> public property get set <y0>
             * #description: Represents the y coordinate of the starting point
             * #valueType: {number}
             */
            Object.defineProperty(this, "y0", {
                writable: true,
                value: 0
            });

            /**
             * #type: <Vgx.Brush> public property get set <x1>
             * #description: Represents the x coordinate of the ending point
             * #valueType: {number}
             */
            Object.defineProperty(this, "x1", {
                writable: true,
                value: 100
            });

            /**
             * #type: <Vgx.Brush> public property get set <y1>
             * #description: Represents the y coordinate of the ending point
             * #valueType: {number}
             */
            Object.defineProperty(this, "y1", {
                writable: true,
                value: 100
            });
        }

        LinearGradientBrush.prototype = Object.create(GradientBrush.prototype);
        LinearGradientBrush.prototype.consrtuctor = LinearGradientBrush;

        return LinearGradientBrush;
    })();
    lib.Cgx.LinearGradientBrush = LinearGradientBrush;


    /**
     * #type: <Vgx> public class <RadialGradientBrush> extends <Vgx.GradientBrush>
     * #description: RadialGradientBrush class
     */
    var RadialGradientBrush = (function () {

        /**
         * #type: <Vgx.RadialGradientBrush> constructor
         * #description: RadialGradientBrush constructor
         */
        function RadialGradientBrush() {
            GradientBrush.apply(this, ["radial"]);

            /**
             * #type: <Vgx.Brush> public property get set <x0>
             * #description: Represents the x coordinate of the starting point
             * #valueType: {number}
             */
            Object.defineProperty(this, "x0", {
                writable: true,
                value: 0
            });

            /**
             * #type: <Vgx.Brush> public property get set <y0>
             * #description: Represents the y coordinate of the starting point
             * #valueType: {number}
             */
            Object.defineProperty(this, "y0", {
                writable: true,
                 value: 0 });

            /**
             * #type: <Vgx.Brush> public property get set <r0>
             * #description: Radius of the starting point
             * #valueType: {number}
             */
            Object.defineProperty(this, "r0", {
                writable: true,
                 value: 0 });

            /**
             * #type: <Vgx.Brush> public property get set <x1>
             * #description: Represents the x coordinate of the ending point
             * #valueType: {number}
             */
            Object.defineProperty(this, "x1", {
                writable: true,
                 value: 100 });

            /**
             * #type: <Vgx.Brush> public property get set <y1>
             * #description: Represents the y coordinate of the ending point
             * #valueType: {number}
             */
            Object.defineProperty(this, "y1", {
                writable: true,
                 value: 100 });

            /**
             * #type: <Vgx.Brush> public property get set <r1>
             * #description: Radius of the ending point
             * #valueType: {number}
             */
            Object.defineProperty(this, "r1", {
                writable: true,
                 value: 0 });
        }

        RadialGradientBrush.prototype = Object.create(GradientBrush.prototype);
        RadialGradientBrush.prototype.consrtuctor = RadialGradientBrush;

        return RadialGradientBrush;
    })();
    lib.Cgx.RadialGradientBrush = RadialGradientBrush;


    /**
     * #type: <Vgx> public class <PatternBrush> extends <Vgx.Brush>
     * #description: PatternBrush class
     */
    var PatternBrush = (function () {

        /**
         * #type: <Vgx.PatternBrush> constructor
         * #description: PatternBrush constructor
         */
        function PatternBrush() {
            Brush.apply(this, ["pattern"]);

            /**
             * #type: <Vgx.PatternBrush> public property get set <image>
             * #description: Represents the image used by the pattern
             * #valueType: {HTMLImageElement}
             */
            Object.defineProperty(this, "image", { value: null, writable: true });

            /**
             * #type: <Vgx.PatternBrush> public property get set <repetition>
             * #description: Represents the repetition mode of the pattern
             * #valueType: {string}
             */
            Object.defineProperty(this, "repetition", { value: "repeat", writable: true });
        }

        PatternBrush.prototype = Object.create(Brush.prototype);
        PatternBrush.prototype.consrtuctor = PatternBrush;

        return PatternBrush;
    })();
    lib.Cgx.PatternBrush = PatternBrush;


})(library);


(function (lib) {

    var Renderer = (function () {

        function Renderer(canvas) {

            var _self = this;
            var _canvas = canvas;


            function throwAbstractMemberCallError() {
                throw new Error("abstract member call");
            }



            Object.defineProperty(this, "name", {
                configurable: true,
                value: "Renderer"
            });

            Object.defineProperty(this, "canvas", {
                get: function () {
                    return _canvas;
                }
            });


            // compositing

            Object.defineProperty(this, "globalAlpha", {
                configurable: true,
                value: 1.0
            });

            Object.defineProperty(this, "globalCompositeOperation", {
                configurable: true,
                value: "source-over"
            });


            // colors, styles, shadows

            Object.defineProperty(this, "fillStyle", {
                configurable: true,
                value: "#000"
            });

            Object.defineProperty(this, "strokeStyle", {
                configurable: true,
                value: "#000"
            });

            Object.defineProperty(this, "shadowBlur", {
                configurable: true,
                value: 0.0
            });

            Object.defineProperty(this, "shadowColor", {
                configurable: true,
                value: "#000"
            });

            Object.defineProperty(this, "shadowOffsetX", {
                configurable: true,
                value: 0.0
            });

            Object.defineProperty(this, "shadowOffsetY", {
                configurable: true,
                value: 0.0
            });


            // gradients, pattern

            Object.defineProperty(this, "createLinearGradient", {
                configurable: true,
                value: function (x0, y0, x1, y1) { throwAbstractMemberCallError(); }
            });

            Object.defineProperty(this, "createRadialGradient", {
                configurable: true,
                value: function (x0, y0, r0, x1, y1, r1) { throwAbstractMemberCallError(); }
            });

            Object.defineProperty(this, "createPattern", {
                configurable: true,
                value: function (image, repetition) { throwAbstractMemberCallError(); }
            });



            // line style

            Object.defineProperty(this, "lineCap", {
                configurable: true,
                value: "butt"
            });

            Object.defineProperty(this, "lineJoin", {
                configurable: true,
                value: "miter"
            });

            Object.defineProperty(this, "lineWidth", {
                configurable: true,
                value: 1.0
            });

            Object.defineProperty(this, "miterLimit", {
                configurable: true,
                value: 10.0
            });

            Object.defineProperty(this, "getLineDash", {
                configurable: true,
                value: function () { throwAbstractMemberCallError(); }
            });

            Object.defineProperty(this, "setLineDash", {
                configurable: true,
                value: function (segments) { throwAbstractMemberCallError(); }
            });

            Object.defineProperty(this, "lineDashOffset", {
                configurable: true,
                value: 0.0
            });


            // text style

            Object.defineProperty(this, "fontSize", {
                configurable: true,
                value: 16
            });

            Object.defineProperty(this, "fontFamily", {
                configurable: true,
                value: "Arial"
            });

            Object.defineProperty(this, "textAlign", {
                configurable: true,
                value: "left"
            });

            Object.defineProperty(this, "textBaseline", {
                configurable: true,
                value: "bottom"
            });

            Object.defineProperty(this, "direction", {
                configurable: true,
                value: "rtl"
            });


            // context

            this.saveState = function () { throwAbstractMemberCallError(); };

            this.restoreState = function () { throwAbstractMemberCallError(); };

            this.toDataURL = function (optType, optParameter) { throwAbstractMemberCallError(); };


            // clear, stroke, fill, clip

            this.clearRect = function (x, y, w, h, optFillStyle) { throwAbstractMemberCallError(); };

            this.strokeRect = function (x, y, width, height) { throwAbstractMemberCallError(); };

            this.fillRect = function (x, y, width, height) { throwAbstractMemberCallError(); };

            this.stroke = function () { throwAbstractMemberCallError(); };

            this.fill = function (optFillRule) { throwAbstractMemberCallError(); };

            this.strokePath2D = function (path2D) { throwAbstractMemberCallError(); };

            this.fillPath2D = function (path2D, optFillRule) { throwAbstractMemberCallError(); };

            this.clip = function () { throwAbstractMemberCallError(); };


            // shapes

            this.rect = function (x, y, w, h) { throwAbstractMemberCallError(); };

            this.square = function (x, y, size) { throwAbstractMemberCallError(); };

            this.ellipse = function (x, y, rx, ry, otpRotation, optStartAngle, optEndAngle) { throwAbstractMemberCallError(); };

            this.circle = function (x, y, r) { throwAbstractMemberCallError(); };

            this.arc = function (x, y, radius, startAngle, endAngle, optAnticlockwise) { throwAbstractMemberCallError(); };


            // path

            this.beginPath = function () { throwAbstractMemberCallError(); };

            this.closePath = function () { throwAbstractMemberCallError(); };

            this.arcTo = function (x1, y1, x2, y2, radius) { throwAbstractMemberCallError(); };

            this.moveTo = function (x, y) { throwAbstractMemberCallError(); };

            this.lineTo = function (x, y) { throwAbstractMemberCallError(); };

            this.bezierCurveTo = function (c1x, c1y, c2x, c2y, x, y) { throwAbstractMemberCallError(); };

            this.quadraticCurveTo = function (cx, cy, x, y) { throwAbstractMemberCallError(); };


            // hit testing

            this.isPointInPath = function (x, y, optFillRule) { throwAbstractMemberCallError(); };

            this.isPointInPath2D = function (path2D, x, y, optFillRule) { throwAbstractMemberCallError(); };

            this.isPointInStroke = function (x, y) { throwAbstractMemberCallError(); };

            this.isPointInPath2DStroke = function (path2D, x, y) { throwAbstractMemberCallError(); };

            this.addHitRegion = function (options) { throwAbstractMemberCallError(); };

            this.removeHitRegion = function (id) { throwAbstractMemberCallError(); };

            this.clearHitRegions = function () { throwAbstractMemberCallError(); };



            // image, imageData

            this.drawImage = function (img, dx, dy, dw, dh, sx, sy, sw, sh) { throwAbstractMemberCallError(); };

            this.createImageData = function (width, height) { throwAbstractMemberCallError(); };

            this.cloneImageData = function (imageData) { throwAbstractMemberCallError(); };

            this.getImageData = function (sx, sy, sw, sh) { throwAbstractMemberCallError(); };

            this.putImageData = function (imageData, x, y) { throwAbstractMemberCallError(); };

            Object.defineProperty(this, "imageSmoothingEnabled", {
                configurable: true,
                value: true
            });


            // text

            this.fillText = function (text, x, y, optMaxWidth) { throwAbstractMemberCallError(); };

            this.strokeText = function (text, x, y, optMaxWidth) { throwAbstractMemberCallError(); };

            this.measureText = function (text) { throwAbstractMemberCallError(); };


            // transformations

            this.rotate = function (angle) { throwAbstractMemberCallError(); };

            this.translate = function (dx, dy) { throwAbstractMemberCallError(); };

            this.scale = function (x, y) { throwAbstractMemberCallError(); };

            this.transform = function (a, b, c, d, e, f) { throwAbstractMemberCallError(); };

            this.setTransform = function (a, b, c, d, e, f) { throwAbstractMemberCallError(); };

            this.resetTransform = function () { throwAbstractMemberCallError(); };


            // misc

            this.drawFocusIfNeeded = function (button) { throwAbstractMemberCallError(); };

        }

        return Renderer;

    })();
    lib.Cgx.Renderer = Renderer;

})(library);


(function (lib) {

    var CanvasRenderer = (function () {

        function CanvasRenderer(canvas) {
            lib.Cgx.Renderer.call(this, canvas);

            var _self = this;
            var _fontSize = 0;
            var _fontFamily = "";
            var _cachedShadow = null;
            var _context;

            var _defaultValues = {
                // read from base class
                globalAlpha: _self.globalAlpha,
                globalCompositeOperation: _self.globalCompositeOperation,
                fillStyle: _self.fillStyle,
                strokeStyle: _self.strokeStyle,
                shadowBlur: _self.shadowBlur,
                shadowColor: _self.shadowColor,
                shadowOffsetX: _self.shadowOffsetX,
                shadowOffsetY: _self.shadowOffsetY,
                lineCap: _self.lineCap,
                lineJoin: _self.lineJoin,
                lineWidth: _self.lineWidth,
                miterLimit: _self.miterLimit,
                lineDashOffset: _self.lineDashOffset,
                fontSize: _self.fontSize,
                fontFamily: _self.fontFamily,
                textAlign: _self.textAlign,
                textBaseline: _self.textBaseline,
                direction: _self.direction,
                imageSmoothingEnabled: _self.imageSmoothingEnabled
            };

            // TODO
            var _supportEllipseDrawing = 'ellipse' in CanvasRenderingContext2D.prototype;
            var _supportArcDrawing = 'arc' in CanvasRenderingContext2D.prototype;
            var _supportTextDirection = 'direction' in CanvasRenderingContext2D.prototype;
            var _supportAddHitRegion = 'addHitRegion' in CanvasRenderingContext2D.prototype;
            var _supportRemoveHitRegion = 'removeHitRegion' in CanvasRenderingContext2D.prototype;
            var _supportClearHitRegion = 'clearHitRegions' in CanvasRenderingContext2D.prototype;


            function _init() {

                _context = _self.canvas.getContext("2d");

                _self.globalAlpha = _defaultValues.globalAlpha;
                _self.globalCompositeOperation = _defaultValues.globalCompositeOperation;
                _self.fillStyle = _defaultValues.fillStyle;
                _self.strokeStyle = _defaultValues.strokeStyle;
                _self.shadowBlur = _defaultValues.shadowBlur;
                _self.shadowColor = _defaultValues.shadowColor;
                _self.shadowOffsetX = _defaultValues.shadowOffsetX;
                _self.shadowOffsetY = _defaultValues.shadowOffsetY;
                _self.lineCap = _defaultValues.lineCap;
                _self.lineJoin = _defaultValues.lineJoin;
                _self.lineWidth = _defaultValues.lineWidth;
                _self.miterLimit = _defaultValues.miterLimit;
                _self.lineDashOffset = _defaultValues.lineDashOffset;
                _self.fontSize = _defaultValues.fontSize;
                _self.fontFamily = _defaultValues.fontFamily;
                _self.textAlign = _defaultValues.textAlign;
                _self.textBaseline = _defaultValues.textBaseline;
                _self.direction = _defaultValues.direction;
                _self.imageSmoothingEnabled = _defaultValues.imageSmoothingEnabled;
            }



            function ellipsePath(x, y, rx, ry, otpRotation, optStartAngle, optEndAngle) {

                otpRotation = otpRotation || 0;
                optStartAngle = optStartAngle || 0;
                optEndAngle = optEndAngle || 2 * Math.PI;

                // TODO: rotation
                // TODO: startAngle
                // TODO: endAngle

                var halfRadiusX = rx * 0.545; // TODO: cercare un metodo migliore
                var halfRadiusY = ry * 0.545; // TODO: cercare un metodo migliore

                var ql = cx - halfRadiusX;
                var qt = cy - halfRadiusY;
                var qr = cx + halfRadiusX;
                var qb = cy + halfRadiusY;

                var pA = { x: cx, y: cy + ry };
                var pB = { x: cx + rx, y: cy };
                var pC = { x: cx, y: cy - ry };
                var pD = { x: cx - rx, y: cy };

                var c1B = { x: qr, y: pA.y };
                var c2B = { x: pB.x, y: qb };
                var c1C = { x: pB.x, y: qt };
                var c2C = { x: qr, y: pC.y };
                var c1D = { x: ql, y: pC.y };
                var c2D = { x: pD.x, y: qt };
                var c1A = { x: pD.x, y: qb };
                var c2A = { x: ql, y: pA.y };

                _renderer.moveTo(pA.x, pA.y);
                _renderer.bezierCurveTo(c1B.x, c1B.y, c2B.x, c2B.y, pB.x, pB.y);
                _renderer.bezierCurveTo(c1C.x, c1C.y, c2C.x, c2C.y, pC.x, pC.y);
                _renderer.bezierCurveTo(c1D.x, c1D.y, c2D.x, c2D.y, pD.x, pD.y);
                _renderer.bezierCurveTo(c1A.x, c1A.y, c2A.x, c2A.y, pA.x, pA.y);
                _renderer.closePath();
            }
    



            Object.defineProperty(this, "name", {
                value: "CanvasRenderer"
            });



            // compositing

            Object.defineProperty(this, "globalAlpha", {
                get: function () { return _context.globalAlpha; },
                set: function (v) { _context.globalAlpha = v; }
            });

            Object.defineProperty(this, "globalCompositeOperation", {
                get: function () { return _context.globalCompositeOperation; },
                set: function (v) { _context.globalCompositeOperation = v; }
            });


            // colors, styles, shadows

            Object.defineProperty(this, "fillStyle", {
                get: function () { return _context.fillStyle; },
                set: function (v) { _context.fillStyle = v; }
            });

            Object.defineProperty(this, "strokeStyle", {
                get: function () { return _context.strokeStyle; },
                set: function (v) { _context.strokeStyle = v; }
            });

            Object.defineProperty(this, "shadowBlur", {
                get: function () { return _context.shadowBlur; },
                set: function (v) { _context.shadowBlur = v; }
            });

            Object.defineProperty(this, "shadowColor", {
                get: function () { return _context.shadowColor; },
                set: function (v) { _context.shadowColor = v; }
            });

            Object.defineProperty(this, "shadowOffsetX", {
                get: function () { return _context.shadowOffsetX; },
                set: function (v) { _context.shadowOffsetX = v; }
            });

            Object.defineProperty(this, "shadowOffsetY", {
                get: function () { return _context.shadowOffsetY; },
                set: function (v) { _context.shadowOffsetY = v; }
            });


            // gradients, pattern

            Object.defineProperty(this, "createLinearGradient", {
                value: function (x0, y0, x1, y1) { return _context.createLinearGradient(x0, y0, x1, y1); }
            });

            Object.defineProperty(this, "createRadialGradient", {
                value: function (x0, y0, r0, x1, y1, r1) { return _context.createRadialGradient(x0, y0, r0, x1, y1, r1); }
            });

            Object.defineProperty(this, "createPattern", {
                value: function (image, repetition) { return _context.createPattern(image, repetition); }
            });



            // line style

            Object.defineProperty(this, "lineCap", {
                get: function () { return _context.lineCap; },
                set: function (v) { _context.lineCap = v; }
            });

            Object.defineProperty(this, "lineJoin", {
                get: function () { return _context.lineJoin; },
                set: function (v) { _context.lineJoin = v; }
            });

            Object.defineProperty(this, "lineWidth", {
                get: function () { return _context.lineWidth; },
                set: function (v) { _context.lineWidth = v; }
            });

            Object.defineProperty(this, "miterLimit", {
                get: function () { return _context.miterLimit; },
                set: function (v) { _context.miterLimit = v; }
            });

            Object.defineProperty(this, "getLineDash", {
                value: function () { _context.getLineDash(); }
            });

            Object.defineProperty(this, "setLineDash", {
                value: function (segments) { _context.setLineDash(segments); }
            });

            Object.defineProperty(this, "lineDashOffset", {
                get: function () { return _context.lineDashOffset; },
                set: function (v) { _context.lineDashOffset = v; }
            });


            // text style

            Object.defineProperty(this, "fontSize", {
                get: function () { return _fontSize; },
                set: function (v) {
                    _fontSize = v;
                    _context.font = _fontSize + "px " + _fontFamily;
                }
            });

            Object.defineProperty(this, "fontFamily", {
                get: function () { return _fontFamily; },
                set: function (v) {
                    _fontFamily = v;
                    _context.font = _fontSize + "px " + _fontFamily;
                }
            });

            Object.defineProperty(this, "textAlign", {
                get: function () { return _context.textAlign; },
                set: function (v) {
                    _context.textAlign = v;
                }
            });

            Object.defineProperty(this, "textBaseline", {
                get: function () { return _context.textBaseline; },
                set: function (v) {
                    _context.textBaseline = v;
                }
            });

            Object.defineProperty(this, "direction", {
                get: function () {
                    if (_supportTextDirection) {
                        return _context.direction;
                    } else {
                        return _defaultValues.direction;
                    }
                },
                set: function (v) {
                    if (_supportTextDirection) {
                        _context.direction = v;
                    } else {
                        console.log("unsupported property 'direction'");
                    }
                }
            });


            // context

            this.saveState = function () {
                _context.save();
            };

            this.restoreState = function () {
                _context.restore();
            };

            this.toDataURL = function (optType, optParameter) {
                _context.toDataURL(optType, optParameter);
            };


            // clear, stroke, fill, clip

            this.clearRect = function (x, y, w, h, optFillStyle) {
                if (typeof optFillStyle === "undefined" || optFillStyle === null) {
                    _context.clearRect(x, y, w, h);
                } else {
                    _context.fillStyle = optFillStyle;
                    _context.fillRect(x, y, w, h);
                }
            };

            this.strokeRect = function (x, y, width, height) {
                _context.strokeRect(x, y, width, height);
            };

            this.fillRect = function (x, y, width, height) {
                _context.fillRect(x, y, width, height);
            };

            this.stroke = function () {
                _context.stroke();
            };

            this.fill = function (optFillRule) {
                _context.fill(optFillRule);
            };

            this.strokePath2D = function (path2D) {
                _context.stroke(path2D);
            };

            this.fillPath2D = function (path2D, optFillRule) {
                optFillRule = optFillRule || "nonzero";
                _context.fill(path2D, optFillRule);
            };

            this.clip = function () {
                _context.clip();
            };


            // shapes

            this.rect = function (x, y, w, h) {
                _context.rect(x, y, w, h);
            };

            this.square = function (x, y, size) {
                _context.rect(x, y, size, size);
            };

            this.ellipse = function (x, y, rx, ry, otpRotation, optStartAngle, optEndAngle) {
                if (_supportEllipseDrawing) {
                    otpRotation = otpRotation || 0;
                    optStartAngle = optStartAngle || 0;
                    optEndAngle = optEndAngle || 2 * Math.PI;
                    _context.ellipse(x, y, rx, ry, otpRotation, optStartAngle, optEndAngle);
                }
                else {
                    // ellipse polyfill
                    ellipsePath(x, y, rx, ry, otpRotation, optStartAngle, optEndAngle);
                }
            };

            this.circle = function (x, y, r) {
                if (_supportEllipseDrawing) {
                    _context.ellipse(x, y, r, r, 0, 0, 2 * Math.PI);
                }
                else {
                    _context.arc(x, y, radius, 0, 2 * Math.PI, false);
                }
            };

            this.arc = function (x, y, radius, startAngle, endAngle, optAnticlockwise) {
                _context.arc(x, y, radius, startAngle, endAngle, !!optAnticlockwise);
            };


            // path

            this.beginPath = function () {
                _context.beginPath();
            };

            this.closePath = function () {
                _context.closePath();
            };

            this.arcTo = function (x1, y1, x2, y2, radius) {
                _context.arcTo(x1, y1, x2, y2, radius);
            };

            this.moveTo = function (x, y) {
                _context.moveTo(x, y);
            };

            this.lineTo = function (x, y) {
                _context.lineTo(x, y);
            };

            this.bezierCurveTo = function (c1x, c1y, c2x, c2y, x, y) {
                _context.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
            };

            this.quadraticCurveTo = function (cx, cy, x, y) {
                _context.quadraticCurveTo(cx, cy, x, y);
            };


            // hit testing

            this.isPointInPath = function (x, y, optFillRule) {
                return _context.isPointInPath(x, y, optFillRule);
            };

            this.isPointInPath2D = function (path2D, x, y, optFillRule) {
                return _context.isPointInPath(path2D, x, y, optFillRule);
            };

            this.isPointInStroke = function (x, y) {
                return _context.isPointInStroke(x, y);
            };

            this.isPointInPath2DStroke = function (path2D, x, y) {
                return _context.isPointInStroke(path2D, x, y);
            };

            this.addHitRegion = function (options) {
                if (_supportAddHitRegion) {
                    return _context.addHitRegion(options);
                } else {
                    console.log("unsupported function 'addHitRegion'");
                    return 0;
                }
            };

            this.removeHitRegion = function (id) {
                if (_supportRemoveHitRegion) {
                    _context.removeHitRegion(id);
                } else {
                    console.log("unsupported function 'removeHitRegion'");
                }
            };

            this.clearHitRegions = function () {
                if (_supportClearHitRegion) {
                    _context.clearHitRegions();
                } else {
                    console.log("unsupported function 'clearHitRegions'");
                }
            };


            // image, imageData

            this.drawImage = function (img, dx, dy, dw, dh, sx, sy, sw, sh) {
                if (typeof dw === "undefined") {
                    _context.drawImage(img, dx, dy);
                }
                else if (typeof sx === "undefined") {
                    _context.drawImage(img, dx, dy, dw, dh);
                }
                else {
                    _context.drawImage(img, dx, dy, dw, dh, sx, sy, sw, sh);
                }
            };

            this.createImageData = function (width, height) {
                return _context.createImageData(width, height);
            };

            this.cloneImageData = function (imageData) {
                return _context.cloneImageData(imageData);
            };

            this.getImageData = function (sx, sy, sw, sh) {
                sx = sx || 0;
                sy = sy || 0;
                sw = sw || _context.canvas.width;
                sh = sh || _context.canvas.height;
                return _context.getImageData(sx, sy, sw, sh);
            };

            this.putImageData = function (imageData, x, y) {
                _context.putImageData(imageData, x, y);
            };

            Object.defineProperty(this, "imageSmoothingEnabled", {
                get: function () {
                    return _context.mozImageSmoothingEnabled || _context.webkitImageSmoothingEnabled || _context.msImageSmoothingEnabled || _context.imageSmoothingEnabled;
                },
                set: function (v) {
                    _context.mozImageSmoothingEnabled = v;
                    _context.webkitImageSmoothingEnabled = v;
                    _context.msImageSmoothingEnabled = v;
                    _context.imageSmoothingEnabled = v;
                }
            });


            // text

            this.fillText = function (text, x, y, optMaxWidth) {
                _context.fillText(text, x, y, optMaxWidth);
                //return _context.measureText(text);
            };

            this.strokeText = function (text, x, y, optMaxWidth) {
                _context.strokeText(text, x, y, optMaxWidth);
                //return _context.measureText(text);
            };

            this.measureText = function (text) {
                return _context.measureText(text);
            };


            // transformations

            this.rotate = function (angle) {
                _context.rotate(angle);
            };

            this.translate = function (dx, dy) {
                _context.translate(dx, dy);
            };

            this.scale = function (x, y) {
                _context.scale(x, y);
            };

            this.transform = function (a, b, c, d, e, f) {
                _context.transform(a, b, c, d, e, f);
            };

            this.setTransform = function (a, b, c, d, e, f) {
                _context.setTransform(a, b, c, d, e, f);
            };

            this.resetTransform = function () {
                _context.setTransform(1, 0, 0, 1, 0, 0);
            };


            // misc

            this.drawFocusIfNeeded = function (button) {
                _context.drawFocusIfNeeded(button);
            };


            _init();
        }

        CanvasRenderer.prototype = Object.create(lib.Cgx.Renderer.prototype);
        CanvasRenderer.prototype.constructor = CanvasRenderer;

        return CanvasRenderer;

    })();
    lib.Cgx.CanvasRenderer = CanvasRenderer;

})(library);


(function (lib) {

    var WebGLRenderer = (function () {

        function WebGLRenderer(canvas) {
            lib.Cgx.Renderer.call(this, canvas);

            var _self = this;
            var _fontSize = 0;
            var _fontFamily = "";
            var _cachedShadow = null;
            var _context;

            var _defaultValues = {
                // read from base class
                globalAlpha: _self.globalAlpha,
                globalCompositeOperation: _self.globalCompositeOperation,
                fillStyle: _self.fillStyle,
                strokeStyle: _self.strokeStyle,
                shadowBlur: _self.shadowBlur,
                shadowColor: _self.shadowColor,
                shadowOffsetX: _self.shadowOffsetX,
                shadowOffsetY: _self.shadowOffsetY,
                lineCap: _self.lineCap,
                lineJoin: _self.lineJoin,
                lineWidth: _self.lineWidth,
                miterLimit: _self.miterLimit,
                lineDashOffset: _self.lineDashOffset,
                fontSize: _self.fontSize,
                fontFamily: _self.fontFamily,
                textAlign: _self.textAlign,
                textBaseline: _self.textBaseline,
                direction: _self.direction,
                imageSmoothingEnabled: _self.imageSmoothingEnabled
            };


            function _init() {

                _context = _self.canvas.getContext("webgl");

                _self.globalAlpha = _defaultValues.globalAlpha;
                _self.globalCompositeOperation = _defaultValues.globalCompositeOperation;
                _self.fillStyle = _defaultValues.fillStyle;
                _self.strokeStyle = _defaultValues.strokeStyle;
                _self.shadowBlur = _defaultValues.shadowBlur;
                _self.shadowColor = _defaultValues.shadowColor;
                _self.shadowOffsetX = _defaultValues.shadowOffsetX;
                _self.shadowOffsetY = _defaultValues.shadowOffsetY;
                _self.lineCap = _defaultValues.lineCap;
                _self.lineJoin = _defaultValues.lineJoin;
                _self.lineWidth = _defaultValues.lineWidth;
                _self.miterLimit = _defaultValues.miterLimit;
                _self.lineDashOffset = _defaultValues.lineDashOffset;
                _self.fontSize = _defaultValues.fontSize;
                _self.fontFamily = _defaultValues.fontFamily;
                _self.textAlign = _defaultValues.textAlign;
                _self.textBaseline = _defaultValues.textBaseline;
                _self.direction = _defaultValues.direction;
                _self.imageSmoothingEnabled = _defaultValues.imageSmoothingEnabled;
            }


            function throwAbstractMemberCallError() {
                throw new Error("abstract member call");
            }



            Object.defineProperty(this, "name", {
                configurable: false,
                value: "WebGLRenderer"
            });



            // compositing

            Object.defineProperty(this, "globalAlpha", {
                configurable: true,
                value: 1.0
            });

            Object.defineProperty(this, "globalCompositeOperation", {
                configurable: true,
                value: "source-over"
            });


            // colors, styles, shadows

            Object.defineProperty(this, "fillStyle", {
                configurable: true,
                value: "#000"
            });

            Object.defineProperty(this, "strokeStyle", {
                configurable: true,
                value: "#000"
            });

            Object.defineProperty(this, "shadowBlur", {
                configurable: true,
                value: 0.0
            });

            Object.defineProperty(this, "shadowColor", {
                configurable: true,
                value: "#000"
            });

            Object.defineProperty(this, "shadowOffsetX", {
                configurable: true,
                value: 0.0
            });

            Object.defineProperty(this, "shadowOffsetY", {
                configurable: true,
                value: 0.0
            });


            // gradients, pattern

            Object.defineProperty(this, "createLinearGradient", {
                configurable: true,
                value: function (x0, y0, x1, y1) { throwAbstractMemberCallError(); }
            });

            Object.defineProperty(this, "createRadialGradient", {
                configurable: true,
                value: function (x0, y0, r0, x1, y1, r1) { throwAbstractMemberCallError(); }
            });

            Object.defineProperty(this, "createPattern", {
                configurable: true,
                value: function (image, repetition) { throwAbstractMemberCallError(); }
            });



            // line style

            Object.defineProperty(this, "lineCap", {
                configurable: true,
                value: "butt"
            });

            Object.defineProperty(this, "lineJoin", {
                configurable: true,
                value: "miter"
            });

            Object.defineProperty(this, "lineWidth", {
                configurable: true,
                value: 1.0
            });

            Object.defineProperty(this, "miterLimit", {
                configurable: true,
                value: 10.0
            });

            Object.defineProperty(this, "getLineDash", {
                configurable: true,
                value: function () { throwAbstractMemberCallError(); }
            });

            Object.defineProperty(this, "setLineDash", {
                configurable: true,
                value: function (segments) { throwAbstractMemberCallError(); }
            });

            Object.defineProperty(this, "lineDashOffset", {
                configurable: true,
                value: 0.0
            });


            // text style

            Object.defineProperty(this, "fontSize", {
                configurable: true,
                value: 16
            });

            Object.defineProperty(this, "fontFamily", {
                configurable: true,
                value: "Arial"
            });

            Object.defineProperty(this, "textAlign", {
                configurable: true,
                value: "left"
            });

            Object.defineProperty(this, "textBaseline", {
                configurable: true,
                value: "bottom"
            });

            Object.defineProperty(this, "direction", {
                configurable: true,
                value: "rtl"
            });


            // context

            this.saveState = function () { throwAbstractMemberCallError(); };

            this.restoreState = function () { throwAbstractMemberCallError(); };

            this.toDataURL = function (optType, optParameter) { throwAbstractMemberCallError(); };


            // clear, stroke, fill, clip

            this.clearRect = function (x, y, w, h, optFillStyle) { throwAbstractMemberCallError(); };

            this.strokeRect = function (x, y, width, height) { throwAbstractMemberCallError(); };

            this.fillRect = function (x, y, width, height) { throwAbstractMemberCallError(); };

            this.stroke = function () { throwAbstractMemberCallError(); };

            this.fill = function (optFillRule) { throwAbstractMemberCallError(); };

            this.strokePath2D = function (path2D) { throwAbstractMemberCallError(); };

            this.fillPath2D = function (path2D, optFillRule) { throwAbstractMemberCallError(); };

            this.clip = function () { throwAbstractMemberCallError(); };


            // shapes

            this.rect = function (x, y, w, h) { throwAbstractMemberCallError(); };

            this.square = function (x, y, size) { throwAbstractMemberCallError(); };

            this.ellipse = function (x, y, rx, ry, otpRotation, optStartAngle, optEndAngle) { throwAbstractMemberCallError(); };

            this.circle = function (x, y, r) { throwAbstractMemberCallError(); };

            this.arc = function (x, y, radius, startAngle, endAngle, optAnticlockwise) { throwAbstractMemberCallError(); };


            // path

            this.beginPath = function () { throwAbstractMemberCallError(); };

            this.closePath = function () { throwAbstractMemberCallError(); };

            this.arcTo = function (x1, y1, x2, y2, radius) { throwAbstractMemberCallError(); };

            this.moveTo = function (x, y) { throwAbstractMemberCallError(); };

            this.lineTo = function (x, y) { throwAbstractMemberCallError(); };

            this.bezierCurveTo = function (c1x, c1y, c2x, c2y, x, y) { throwAbstractMemberCallError(); };

            this.quadraticCurveTo = function (cx, cy, x, y) { throwAbstractMemberCallError(); };


            // hit testing

            this.isPointInPath = function (x, y, optFillRule) { throwAbstractMemberCallError(); };

            this.isPointInPath2D = function (path2D, x, y, optFillRule) { throwAbstractMemberCallError(); };

            this.isPointInStroke = function (x, y) { throwAbstractMemberCallError(); };

            this.isPointInPath2DStroke = function (path2D, x, y) { throwAbstractMemberCallError(); };

            this.addHitRegion = function (options) { throwAbstractMemberCallError(); };

            this.removeHitRegion = function (id) { throwAbstractMemberCallError(); };

            this.clearHitRegions = function () { throwAbstractMemberCallError(); };



            // image, imageData

            this.drawImage = function (img, dx, dy, dw, dh, sx, sy, sw, sh) { throwAbstractMemberCallError(); };

            this.createImageData = function (width, height) { throwAbstractMemberCallError(); };

            this.cloneImageData = function (imageData) { throwAbstractMemberCallError(); };

            this.getImageData = function (sx, sy, sw, sh) { throwAbstractMemberCallError(); };

            this.putImageData = function (imageData, x, y) { throwAbstractMemberCallError(); };

            Object.defineProperty(this, "imageSmoothingEnabled", {
                configurable: true,
                value: true
            });


            // text

            this.fillText = function (text, x, y, optMaxWidth) { throwAbstractMemberCallError(); };

            this.strokeText = function (text, x, y, optMaxWidth) { throwAbstractMemberCallError(); };

            this.measureText = function (text) { throwAbstractMemberCallError(); };


            // transformations

            this.rotate = function (angle) { throwAbstractMemberCallError(); };

            this.translate = function (dx, dy) { throwAbstractMemberCallError(); };

            this.scale = function (x, y) { throwAbstractMemberCallError(); };

            this.transform = function (a, b, c, d, e, f) { throwAbstractMemberCallError(); };

            this.setTransform = function (a, b, c, d, e, f) { throwAbstractMemberCallError(); };

            this.resetTransform = function () { throwAbstractMemberCallError(); };


            // misc

            this.drawFocusIfNeeded = function (button) { throwAbstractMemberCallError(); };


            _init();
        }

        WebGLRenderer.prototype = Object.create(lib.Cgx.Renderer.prototype);
        WebGLRenderer.prototype.constructor = WebGLRenderer;

        return WebGLRenderer;

    })();

    lib.Cgx.WebGLRenderer = WebGLRenderer;

})(library);


(function (lib) {

    var CoreGraphics = (function () {

        function TransformManager(renderer) {

            var _transforms = [];
            var _renderer = renderer;

            this.push = function (transform) {
                var mtx = transform.getMatrix();
                _transforms.push(transform);
                _renderer.saveState();
                _renderer.transform(mtx.m11, mtx.m12, mtx.m21, mtx.m22, mtx.offsetX, mtx.offsetY);
            };

            this.pop = function () {
                var result = _transforms.push();
                _renderer.restoreState();
                return result;
            };

            Object.defineProperty(this, "length", {
                get: function () { return _transforms.length; }
            });
        }

        function CoreGraphics(canvas) {

            var FULL_ANGLE = 2 * Math.PI;

            var _self = this;
            var _canvas = canvas;
            var _renderer;
            var _transformManager;

            var _fill = 0xffffffff;
            var _stroke = 0xff000000;
            var _strokeWidth = 1;
            var _shadow;
            var _fontSize = 16;
            var _fontFamily = "Arial";
            var _textAlign = "left";
            var _textBaseline = "bottom";


            function _init() {
                _renderer = lib.Cgx.Engine.createDefaultRenderer(_canvas);
                _transformManager = new TransformManager(_renderer);
            }



            function applyEntityTransform(transform, insertPointx, insertPointY) {

                // move to entity insert point
                _renderer.translate(insertPointx, insertPointY);

                var mtx;

                if (transform) {

                    // move to transform origin
                    _renderer.translate(transform.originX, transform.originY);

                    mtx = transform.getMatrix();
                    // apply matrix transform to the renderer
                    _renderer.transform(mtx.m11, mtx.m12, mtx.m21, mtx.m22, mtx.offsetX, mtx.offsetY);

                    // back transform origin
                    _renderer.translate(-transform.originX, -transform.originY);
                }

                // back from entity insert point
                _renderer.translate(-insertPointx, -insertPointY);
            }

            function createCanvasColorOrBrush(value) {
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
                else if (value instanceof lib.Cgx.GradientBrush) {

                    var result;

                    if (value instanceof lib.Cgx.LinearGradientBrush) {
                        result = _renderer.createLinearGradient(value.x0, value.y0, value.x1, value.y1);
                    }
                    else if (value instanceof lib.Cgx.RadialGradientBrush) {
                        result = _renderer.createRadialGradient(value.x0, value.y0, value.r0, value.x1, value.y1, value.r1);
                    }
                    
                    var colorStops = value._getColorStops();
                    for (var i = 0; i < colorStops.length; i++) {
                        result.addColorStop(colorStops[i].offset, colorStops[i].color);
                    }

                    return result;
                }
                else if (value instanceof lib.Cgx.PatternBrush) {
                    return _renderer.createPattern(value.image, value.repetition);
                }

                return value;
            }



            this.getImageData = function (sx, sy, sw, sh) {
                return _renderer.getImageData(sx, sy, sw, sh);
            };



            this.setShadow = function (shadow) {
                _shadow = shadow;

                // TODO:
                //if (!!this.scaleStyles) {
                //    _shadow = shadow.clone();
                //    _shadow.blur *= _viewTransform.viewZoom;
                //    _shadow.offsetX *= _viewTransform.viewZoom;
                //    _shadow.offsetY *= _viewTransform.viewZoom;
                //}
                //_renderer.shadow = _shadow;
            };

            this.getShadow = function () {
                return _shadow;
            };

            this.setFillBrush = function (fillBrush) {
                _fill = fillBrush;
                _renderer.fillStyle = createCanvasColorOrBrush(fillBrush);
            };

            this.getFillBrush = function () {
                return _fill;
            };

            this.setStrokeBrush = function (strokeBrush) {
                _stroke = strokeBrush;
                _renderer.strokeStyle = createCanvasColorOrBrush(strokeBrush);
            };

            this.getStrokeBrush = function () {
                return _stroke;
            };

            this.setStrokeWidth = function (strokeWidth) {
                _strokeWidth = strokeWidth;
                _renderer.lineWidth = strokeWidth;
            };

            this.getStrokeWidth = function () {
                return _strokeWidth;
            };

            this.setFontFamily = function (fontFamily) {
                _fontFamily = fontFamily;
                _renderer.fontFamily = fontFamily;
            };

            this.getFontFamily = function () {
                return _fontFamily;
            };

            this.setFontSize = function (fontSize) {
                _fontSize = fontSize;
                _renderer.fontSize = _fontSize;
            };

            this.getFontSize = function () {
                return _fontSize;
            };

            this.setTextAlign = function (align) {
                _textAlign = align;
                _renderer.textAlign = _textAlign;
            };

            this.getTextAlign = function () {
                return _textAlign;
            };

            this.setTextBaseline = function (baseline) {
                _textBaseline = baseline;
                _renderer.textBaseline = _textBaseline;
            };

            this.getTextBaseline = function () {
                return _textBaseline;
            };


            this.measureText = function (text) {
                return _renderer.measureText(text);
            };

            this.clear = function (optFillBrush) {
                _self.clearRect(0, 0, _renderer.canvas.width, _renderer.canvas.height, optFillBrush);
            };

            this.clearRect = function (x, y, width, height, optFillBrush) {
                var fillStyle = null;
                if (typeof optFillBrush !== "undefined" && optFillBrush !== null) {
                    fillStyle = createCanvasColorOrBrush(optFillBrush);
                }
                _renderer.clearRect(0, 0, _renderer.canvas.width, _renderer.canvas.height, fillStyle);
            };


            this.drawArc = function (cx, cy, radius, startAngle, endAngle, isAntiClockwise, optTransform) {

                if (!_stroke || _strokeWidth == 0)
                    return;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, cx, cy);

                _renderer.beginPath();
                _renderer.arc(cx, cy, radius, startAngle, endAngle, !!isAntiClockwise);
                _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawLine = function (x1, y1, x2, y2, optTransform) {

                if (!_stroke || _strokeWidth == 0)
                    return;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, x1, y1);

                _renderer.beginPath();
                _renderer.moveTo(x1, y1);
                _renderer.lineTo(x2, y2);

                _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawRoundedRectangle = function (x, y, width, height, cornersRadius, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                var topLeftCorner = 0;
                var topRightCorner = 0;
                var bottomLeftCorner = 0;
                var bottomRightCorner = 0;
                if (cornersRadius instanceof Array) {
                    topLeftCorner = cornersRadius[0];
                    topRightCorner = cornersRadius[0];
                    bottomLeftCorner = cornersRadius[0];
                    bottomRightCorner = cornersRadius[0];
                }
                else if (typeof cornersRadius === "number") {
                    topLeftCorner = topRightCorner = bottomLeftCorner = bottomRightCorner = cornersRadius;
                }
                else if (typeof cornersRadius === "object") {
                    topLeftCorner = cornersRadius.topLeft;
                    topRightCorner = cornersRadius.topRight;
                    bottomLeftCorner = cornersRadius.bottomLeft;
                    bottomRightCorner = cornersRadius.bottomRight;
                }

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, x, y);

                _renderer.beginPath();

                var currentX = x;
                var currentY = y;

                if (topLeftCorner == 0) {
                    _renderer.moveTo(currentX, currentY);
                } else {
                    _renderer.moveTo(currentX + topLeftCorner, currentY);
                }

                currentX = x + width;
                if (topRightCorner == 0) {
                    _renderer.lineTo(currentX, currentY);
                } else {
                    _renderer.lineTo(currentX - topRightCorner, currentY);
                    _renderer.arcTo(currentX, currentY, currentX, currentY + topRightCorner, topRightCorner);
                }

                currentY = y + height;
                if (bottomRightCorner == 0) {
                    _renderer.lineTo(currentX, currentY);
                } else {
                    _renderer.lineTo(currentX, currentY - bottomRightCorner);
                    _renderer.arcTo(currentX, currentY, currentX - bottomRightCorner, currentY, bottomRightCorner);
                }

                currentX = x;
                if (bottomLeftCorner == 0) {
                    _renderer.lineTo(currentX, currentY);
                } else {
                    _renderer.lineTo(currentX + bottomLeftCorner, currentY);
                    _renderer.arcTo(currentX, currentY, currentX, currentY - bottomLeftCorner, bottomLeftCorner);
                }

                currentY = y;
                if (topLeftCorner == 0) {
                    _renderer.lineTo(currentX, currentY);
                } else {
                    _renderer.lineTo(currentX, currentY + topLeftCorner);
                    _renderer.arcTo(currentX, currentY, currentX + topRightCorner, currentY, topLeftCorner);
                }

                _renderer.closePath();

                if (_fill)
                    _renderer.fill();
                if (_stroke && _strokeWidth > 0)
                    _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawSquare = function (x, y, size, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, x, y);

                _renderer.beginPath();
                _renderer.square(x, y, size);

                if (_fill)
                    _renderer.fill();
                if (_stroke && _strokeWidth > 0)
                    _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawRectangle = function (x, y, width, height, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, x, y);

                _renderer.beginPath();
                _renderer.rect(x, y, width, height);

                if (_fill)
                    _renderer.fill();
                if (_stroke && _strokeWidth > 0)
                    _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawCircle = function (cx, cy, radius, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, cx, cy);

                _renderer.beginPath();
                _renderer.circle(cx, cy, radius);

                //if ("ellipse" in _renderer) {
                //    _renderer.ellipse(cx, cy, radius, radius);
                //}
                //else if ("arc" in _renderer) {
                //    _renderer.arc(cx, cy, radius, 0, FULL_ANGLE, false);
                //}
                //else {
                //    var halfRadius = radius * 0.545; // TODO: cercare un metodo migliore
                //    var ql = cx - halfRadius;
                //    var qt = cy - halfRadius;
                //    var qr = cx + halfRadius;
                //    var qb = cy + halfRadius;
                //    var pA = { x: cx, y: cx + radius };
                //    var pB = { x: cx + radius, y: cy };
                //    var pC = { x: cx, y: cy - radius };
                //    var pD = { x: cx - radius, y: cy };
                //    var c1B = { x: qr, y: pA.y };
                //    var c2B = { x: pB.x, y: qb };
                //    var c1C = { x: pB.x, y: qt };
                //    var c2C = { x: qr, y: pC.y };
                //    var c1D = { x: ql, y: pC.y };
                //    var c2D = { x: pD.x, y: qt };
                //    var c1A = { x: pD.x, y: qb };
                //    var c2A = { x: ql, y: pA.y };
                //    _renderer.moveTo(pA.x, pA.y);
                //    _renderer.bezierCurveTo(c1B.x, c1B.y, c2B.x, c2B.y, pB.x, pB.y);
                //    _renderer.bezierCurveTo(c1C.x, c1C.y, c2C.x, c2C.y, pC.x, pC.y);
                //    _renderer.bezierCurveTo(c1D.x, c1D.y, c2D.x, c2D.y, pD.x, pD.y);
                //    _renderer.bezierCurveTo(c1A.x, c1A.y, c2A.x, c2A.y, pA.x, pA.y);
                //    _renderer.closePath();
                //}

                if (_fill)
                    _renderer.fill();
                if (_stroke && _strokeWidth > 0)
                    _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawEllipse = function (cx, cy, radiusX, radiusY, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, cx, cy);

                _renderer.beginPath();
                _renderer.ellipse(cx, cy, radiusX, radiusY);

                //if ("ellipse" in _renderer) {
                //    _renderer.ellipse(cx, cy, radiusX, radiusY);
                //}
                //else {
                //    var halfRadiusX = radiusX * 0.545; // TODO: cercare un metodo migliore
                //    var halfRadiusY = radiusY * 0.545; // TODO: cercare un metodo migliore
                //    var ql = cx - halfRadiusX;
                //    var qt = cy - halfRadiusY;
                //    var qr = cx + halfRadiusX;
                //    var qb = cy + halfRadiusY;
                //    var pA = { x: cx, y: cy + radiusY };
                //    var pB = { x: cx + radiusX, y: cy };
                //    var pC = { x: cx, y: cy - radiusY };
                //    var pD = { x: cx - radiusX, y: cy };
                //    var c1B = { x: qr, y: pA.y };
                //    var c2B = { x: pB.x, y: qb };
                //    var c1C = { x: pB.x, y: qt };
                //    var c2C = { x: qr, y: pC.y };
                //    var c1D = { x: ql, y: pC.y };
                //    var c2D = { x: pD.x, y: qt };
                //    var c1A = { x: pD.x, y: qb };
                //    var c2A = { x: ql, y: pA.y };
                //    //_renderer.rect(cx - radiusX, cy - radiusY, radiusX * 2, radiusY * 2);
                //    _renderer.moveTo(pA.x, pA.y);
                //    _renderer.bezierCurveTo(c1B.x, c1B.y, c2B.x, c2B.y, pB.x, pB.y);
                //    _renderer.bezierCurveTo(c1C.x, c1C.y, c2C.x, c2C.y, pC.x, pC.y);
                //    _renderer.bezierCurveTo(c1D.x, c1D.y, c2D.x, c2D.y, pD.x, pD.y);
                //    _renderer.bezierCurveTo(c1A.x, c1A.y, c2A.x, c2A.y, pA.x, pA.y);
                //    _renderer.closePath();
                //}

                if (_fill)
                    _renderer.fill();
                if (_stroke && _strokeWidth > 0)
                    _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawPolyline = function (points, optTransform) {

                if (!_stroke || _strokeWidth == 0)
                    return;

                var p0x = points[0].x;
                var p0y = points[0].y;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, p0x, p0y);

                _renderer.beginPath();
                _renderer.moveTo(p0x, p0y);
                for (var i = 1; i < points.length; i++) {
                    var p = points[i];
                    _renderer.lineTo(p.x, p.y);
                }
                _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawPolygon = function (points, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                var p0x = points[0].x;
                var p0y = points[0].y;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, p0x, p0y);

                _renderer.beginPath();
                _renderer.moveTo(p0x, p0y);
                for (var i = 1; i < points.length; i++) {
                    var p = points[i];
                    _renderer.lineTo(p.x, p.y);
                }
                _renderer.closePath();

                if (_fill)
                    _renderer.fill();
                if (_stroke && _strokeWidth > 0)
                    _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawTriangle = function (point1, point2, point3, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, point1.x, point1.y);

                _renderer.beginPath();
                _renderer.moveTo(point1.x, point1.y);
                _renderer.lineTo(point2.x, point2.y);
                _renderer.lineTo(point3.x, point3.y);
                _renderer.closePath();

                if (_fill)
                    _renderer.fill();
                if (_stroke && _strokeWidth > 0)
                    _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawQuad = function (point1, point2, point3, point4, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, point1.x, point1.y);

                _renderer.beginPath();
                _renderer.moveTo(point1.x, point1.y);
                _renderer.lineTo(point2.x, point2.y);
                _renderer.lineTo(point3.x, point3.y);
                _renderer.lineTo(point4.x, point4.y);
                _renderer.closePath();

                if (_fill)
                    _renderer.fill();
                if (_stroke && _strokeWidth > 0)
                    _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawCubicCurve = function (points, controlPoints1, controlPoints2, isClosed, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                var p0x = points[0].x;
                var p0y = points[0].y;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, p0x, p0y);

                points.push(points[0]);

                _renderer.beginPath();
                _renderer.moveTo(p0x, p0y);
                for (var i = 0; i < controlPoints1.length; i++) {
                    var c1 = controlPoints1[i];
                    var c2 = controlPoints2[i];
                    var p = points[i + 1];
                    _renderer.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p.x, p.y);
                }

                if (isClosed)
                    _renderer.closePath();

                if (_fill)
                    _renderer.fill();
                if (_stroke && _strokeWidth > 0)
                    _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawQuadraticCurve = function (points, controlPoints, isClosed, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                var p0x = points[0].x;
                var p0y = points[0].y;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, p0x, p0y);

                points.push(points[0]);

                _renderer.beginPath();
                _renderer.moveTo(p0x, p0y);
                for (var i = 0; i < controlPoints.length; i++) {
                    var c1 = controlPoints[i];
                    var p = points[i + 1];
                    _renderer.quadraticCurveTo(c1.x, c1.y, p.x, p.y);
                }

                if (isClosed)
                    _renderer.closePath();

                if (_fill)
                    _renderer.fill();
                if (_stroke && _strokeWidth > 0)
                    _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawImage = function (image, x, y, width, height, optTransform) {

                if (!image && (!_stroke || _strokeWidth == 0))
                    return;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, x, y);

                _renderer.drawImage(image, x, y, width, height);
                if (_stroke && _strokeWidth > 0) {
                    _renderer.beginPath();
                    _renderer.rect(x, y, width, height);
                    _renderer.stroke();
                }

                _renderer.restoreState();
            };

            this.drawText = function (x, y, text, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, x, y);

                if (_fill)
                    _renderer.fillText(text, x, y);
                if (_stroke && _strokeWidth > 0)
                    _renderer.strokeText(text, x, y);

                _renderer.restoreState();
            };

            this.drawPath2D = function (x, y, path2D, optFillRule, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                optFillRule = optFillRule || null;

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, x, y);

                // move to path2D insert point
                _renderer.translate(x, y);

                if (_fill)
                    _renderer.fillPath2D(path2D, optFillRule);
                if (_stroke && _strokeWidth > 0)
                    _renderer.strokePath2D(path2D);

                _renderer.restoreState();
            };

            this.drawPie = function (cx, cy, radius, startAngle, endAngle, isAntiClockwise, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                var deltaAngle = endAngle - startAngle;
                if (deltaAngle >= FULL_ANGLE) {
                    this.drawCircle(cx, cy, radius, optTransform);
                    return;
                }

                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, cx, cy);

                _renderer.beginPath();
                _renderer.moveTo(cx, cy);
                _renderer.arc(cx, cy, radius, startAngle, endAngle, !!isAntiClockwise);
                _renderer.closePath();

                if (_fill)
                    _renderer.fill();
                if (_stroke && _strokeWidth > 0)
                    _renderer.stroke();

                _renderer.restoreState();
            };

            this.drawDonut = function (cx, cy, startRadius, endRadius, startAngle, endAngle, isAntiClockwise, optTransform) {

                if (!_fill && (!_stroke || _strokeWidth == 0))
                    return;

                var hasHole = true;
                var isClosed = false;

                if (startRadius > endRadius) {
                    var temp = endRadius;
                    endRadius = startRadius;
                    startRadius = temp;
                }

                if (startRadius <= 0) {
                    hasHole = false;
                    //this.drawPie(cx, cy, endRadius, startAngle, endAngle);
                    //return;
                }

                var deltaAngle = endAngle - startAngle;
                if (deltaAngle >= FULL_ANGLE) {
                    isClosed = true;
                    //this.drawCircle(cx, cy, radius, optTransform);
                    //return;
                }

                if (!hasHole) {

                    if (isClosed) {
                        this.drawCircle(cx, cy, endRadius, optTransform);
                        return;
                    }
                    else {
                        this.drawPie(cx, cy, endRadius, startAngle, endAngle, optTransform);
                        return;
                    }
                }


                _renderer.saveState();

                // apply entity transform
                applyEntityTransform(optTransform, cx, cy);

                _renderer.beginPath();

                if (isClosed) {
                    _renderer.circle(cx, cy, endRadius);
                    _renderer.circle(cx, cy, startRadius);
                }
                else {
                    _renderer.arc(cx, cy, endRadius, startAngle, endAngle, !!isAntiClockwise);
                    _renderer.arc(cx, cy, startRadius, endAngle, startAngle, !isAntiClockwise);
                    _renderer.closePath();
                }

                if (_fill)
                    _renderer.fill("evenodd");
                if (_stroke && _strokeWidth > 0)
                    _renderer.stroke();

                _renderer.restoreState();
            };

            //this.drawAxes = function () {

            //    _renderer.saveState();

            //    _renderer.lineWidth = 1;
            //    _renderer.strokeStyle = "rgba(255,0,0,0.5)";
            //    _renderer.beginPath();
            //    _renderer.moveTo(0, 0);
            //    _renderer.lineTo(_canvas.width, 0);
            //    _renderer.stroke();
            //    _renderer.strokeStyle = "rgba(0,255,0,0.5)";
            //    _renderer.beginPath();
            //    _renderer.moveTo(0, _canvas.height);
            //    _renderer.lineTo(0, 0);
            //    _renderer.stroke();

            //    _renderer.restoreState();
            //};

            this.drawSymbol = function (x, y, symbolData) {

                _renderer.saveState();

                if (!symbolData && (!_stroke || _strokeWidth == 0))
                    return;
                _renderer.drawImage(symbolData, x, y, symbolData.width, symbolData.height);

                _renderer.restoreState();
            };

            // this.drawVertex = function (x, y, optTransform, optTransformOriginX, optTransformOriginY) {
            //     this.drawVertices([{ x: x, y: y }], optTransform, optTransformOriginX, optTransformOriginY);
            // };

            // this.drawVertices = function (points, optTransform, optTransformOriginX, optTransformOriginY) {

            //     if (optTransform) {
            //         optTransformOriginX = optTransformOriginX || 0;
            //         optTransformOriginY = optTransformOriginY || 0;
            //     }

            //     _renderer.fillStyle = lib.Vgx.Vars.vertexFillColor;
            //     _renderer.strokeStyle = lib.Vgx.Vars.vertexStrokeColor;
            //     _renderer.lineWidth = lib.Vgx.Vars.vertexStrokeWidth / _viewTransform.viewZoom;

            //     // riduce/aumenta la dimensione in base al grado di zoom
            //     // in modo da avere un elemento di dimensione fissa a schermo
            //     var radius = lib.Vgx.Vars.vertexSize / _viewTransform.viewZoom;
            //     var size = radius * 2;

            //     _renderer.saveState();

            //     // apply entity transform
            //     applyEntityTransform(optTransform, optTransformOriginX, optTransformOriginY);


            //     _renderer.beginPath();

            //     points.forEach((v, i, a) => {
            //         if ("ellipse" in _renderer) {
            //             // to fix move line drawing from center to ellipse start
            //             _renderer.moveTo(v.x + radius, v.y);
            //             _renderer.ellipse(v.x, v.y, radius, radius);
            //         } else {
            //             _renderer.rect(v.x - radius, v.y - radius, size, size);
            //         }
            //     });

            //     if (_fill)
            //         _renderer.fill();
            //     if (_stroke && _strokeWidth > 0)
            //         _renderer.stroke();

            //     _renderer.restoreState();
            // };



            Object.defineProperty(this, "pushTransform", {
                value: function (transform) {
                    _transformManager.push(transform);
                }
            });

            Object.defineProperty(this, "popTransform", {
                value: function () {
                    _transformManager.pop();
                }
            });



            _init();
        }

        return CoreGraphics;

    })();
    lib.Cgx.CoreGraphics = CoreGraphics;

})(library);


(function (lib) {

    var Engine = (function () {

        function Engine() {

            var _self = this;
            var _renderers = {};
            var _defaultRendererName;
            var _vars = {};


            function _init() {
                _self.registerRenderer("CanvasRenderer", lib.Cgx.CanvasRenderer);
                //_self.registerRenderer("WebGLRenderer", lib.Cgx.WebGLRenderer);
                _self.defaultRenderer = "CanvasRenderer";
            }


            Object.defineProperty(this, "defaultRenderer", {
                get: function () { return _defaultRendererName; },
                set: function (v) {
                    if (typeof v !== "string")
                        return;
                    if (_defaultRendererName != v) {
                        _defaultRendererName = v;
                    }
                }
            });

            Object.defineProperty(this, "vars", {
                get: function () { return _vars; }
            });


            Object.defineProperty(this, "registerRenderer", {
                value: function (name, rendererConstructor) {
                    // TODO: check rendererConstructor type
                    _renderers[name] = rendererConstructor;
                }
            });

            Object.defineProperty(this, "loadSettings", {
                value: function (settings) {
                    if ("defaultRenderer" in settings) {
                        _defaultRenderer = settings.defaultRenderer;
                    }
                    if ("vars" in settings) {
                        for (var n in settings.vars) {
                            if (settings.vars.hasOwnProperty(n)) {
                                _vars[n] = settings.vars[n];
                            }
                        }
                    }
                }
            });


            Object.defineProperty(this, "createDefaultRenderer", {
                value: function (canvas) { return _self.createRenderer(canvas, _defaultRendererName); }
            });

            Object.defineProperty(this, "createRenderer", {
                value: function (canvas, rendererTypeName) {

                    if (!(rendererTypeName in _renderers)) {
                        console.log("invalid renderer name " + rendererTypeName);
                        rendererTypeName = _defaultRendererName;
                    }

                    var rendererType = _renderers[rendererTypeName];
                    return new rendererType(canvas);

                    //return new lib.Cgx.CanvasRenderer(canvas);
                }
            });


            //https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
            Object.defineProperty(this, "createCanvasBuffer", {
                value: function (optWidth, optHeight) {
                    var canvas = window.document.createElement("canvas");
                    if (typeof optWidth === "number")
                        canvas.width = optWidth;
                    if (typeof optHeight === "number")
                        canvas.height = optHeight;
                    return canvas;
                }
            });

            Object.defineProperty(this, "createBufferedGraphics", {
                value: function (width, height) {
                    var canvas = _self.createCanvasBuffer(width, height);
                    return new lib.Cgx.CoreGraphics(canvas);
                }
            });


            _init();
        }

        return new Engine();

    })();
    lib.Cgx.Engine = Engine;

})(library);


(function (lib) {

    var Ease = (function () {

        var Ease = {};


        Object.defineProperty(Ease, "getEasingFunctionOrDefault", {
            value: function (easing) {
                if (easing in Ease) {
                    return Ease[easing];
                }
                return Ease.linear;
            }
        });


        Object.defineProperty(Ease, "linear", {
            value: function (t) {
                return t;
            }
        });


        Object.defineProperty(Ease, "quadraticIn", {
            value: function (t) {
                return Math.pow(t, 2);
            }
        });

        Object.defineProperty(Ease, "quadraticOut", {
            value: function (t) {
                return 1 - Math.pow(1 - t, 2);
            }
        });

        Object.defineProperty(Ease, "quadraticInOut", {
            value: function (t) {
                if (t < 0.5) {
                    t *= 2;
                    return Math.pow(t, 2) * 0.5;
                } else {
                    t = (t - 0.5) * 2;
                    return ((1 - Math.pow(1 - t, 2)) * 0.5) + 0.5;
                }
            }
        });


        Object.defineProperty(Ease, "cubicIn", {
            value: function (t) {
                return Math.pow(t, 3);
            }
        });

        Object.defineProperty(Ease, "cubicOut", {
            value: function (t) {
                return 1 - Math.pow(1 - t, 3);
            }
        });

        Object.defineProperty(Ease, "cubicInOut", {
            value: function (t) {
                if (t < 0.5) {
                    t *= 2;
                    return Math.pow(t, 3) * 0.5;
                } else {
                    t = (t - 0.5) * 2;
                    return ((1 - Math.pow(1 - t, 3)) * 0.5) + 0.5;
                }
            }
        });


        Object.defineProperty(Ease, "quarticIn", {
            value: function (t) {
                return Math.pow(t, 4);
            }
        });

        Object.defineProperty(Ease, "quarticOut", {
            value: function (t) {
                return 1 - Math.pow(1 - t, 4);
            }
        });

        Object.defineProperty(Ease, "quarticInOut", {
            value: function (t) {
                if (t < 0.5) {
                    t *= 2;
                    return Math.pow(t, 4) * 0.5;
                } else {
                    t = (t - 0.5) * 2;
                    return ((1 - Math.pow(1 - t, 4)) * 0.5) + 0.5;
                }
            }
        });


        Object.defineProperty(Ease, "quinticIn", {
            value: function (t) {
                return Math.pow(t, 5);
            }
        });

        Object.defineProperty(Ease, "quinticOut", {
            value: function (t) {
                return 1 - Math.pow(1 - t, 5);
            }
        });

        Object.defineProperty(Ease, "quinticInOut", {
            value: function (t) {
                if (t < 0.5) {
                    t *= 2;
                    return Math.pow(t, 5) * 0.5;
                } else {
                    t = (t - 0.5) * 2;
                    return ((1 - Math.pow(1 - t, 5)) * 0.5) + 0.5;
                }
            }
        });


        Object.defineProperty(Ease, "sineIn", {
            value: function (t) {
                return -Math.cos(t * Math.PI * 0.5) + 1;
            }
        });

        Object.defineProperty(Ease, "sineOut", {
            value: function (t) {
                return Math.sin(t * Math.PI * 0.5);
            }
        });

        Object.defineProperty(Ease, "sineInOut", {
            value: function (t) {
                return -0.5 * (Math.cos(t * Math.PI) - 1);
            }
        });


        Object.defineProperty(Ease, "expoIn", {
            value: function (t) {
                return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
            }
        });

        Object.defineProperty(Ease, "expoOut", {
            value: function (t) {
                return (t == 1) ? 1 : -Math.pow(2, -10 * t) + 1;
            }
        });

        Object.defineProperty(Ease, "expoInOut", {
            value: function (t) {
                if (t == 0) return 0;
                if (t == 1) return 1;
                t = t / 0.5;
                if (t < 1) return Math.pow(2, 10 * (t - 1)) * 0.5;
                return (-Math.pow(2, -10 * --t) + 2) * 0.5;
            }
        });


        Object.defineProperty(Ease, "bounceIn", {
            value: function (t) {
                t = 1 - t;
                return 1 - Ease.bounceOut(t);
            }
        });

        Object.defineProperty(Ease, "bounceOut", {
            value: function (t) {
                if (t < 0.3637) {
                    return 7.5625 * t * t;
                } else if (t < 0.7272) {
                    return (7.5625 * (t -= 0.5454) * t + 0.75);
                } else if (t < 0.9090) {
                    return (7.5625 * (t -= 0.8181) * t + 0.9375);
                } else {
                    return (7.5625 * (t -= 0.9545) * t + 0.984375);
                }
            }
        });

        Object.defineProperty(Ease, "bounceInOut", {
            value: function (t) {
                if (t < 0.5) {
                    return Ease.bounceIn(t * 2) * 0.5;
                } else {
                    return Ease.bounceOut((t * 2) - 1) * 0.5 + 0.5;
                }
            }
        });


        Object.defineProperty(Ease, "backIn", {
            value: function (t) {
                var s = 1.70158;
                return t * t * ((s + 1) * t - s);
            }
        });

        Object.defineProperty(Ease, "backOut", {
            value: function (t) {
                var s = 1.70158;
                t = t - 1;
                return (t * t * ((s + 1) * t + s) + 1);
            }
        });

        Object.defineProperty(Ease, "backInOut", {
            value: function (t) {
                var d = 1;
                var s = 1.70158;
                t = t / 0.5;
                if (t < 1) {
                    return (t * t * (((s *= (1.525)) + 1) * t - s)) * 0.5;
                } else {
                    return ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) * 0.5;
                }
            }
        });


        Object.defineProperty(Ease, "elasticIn", {
            value: function (t) {
                var p;
                var a;
                var s;
                if (t == 0) return 0;
                if (t == 1) return 1;
                if (!p) {
                    p = 0.3;
                }
                if (!a || a < Math.abs(c)) {
                    a = 1;
                    s = p / 4;
                }
                else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
            }
        });

        Object.defineProperty(Ease, "elasticOut", {
            value: function (t) {
                var p;
                var a;
                var s;
                if (t == 0) return 0;
                if (t == 1) return 1;
                if (!p) {
                    p = 0.3;
                }
                if (!a || a < Math.abs(c)) {
                    a = 1;
                    s = p / 4;
                }
                else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                return (a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1);
            }
        });

        Object.defineProperty(Ease, "elasticInOut", {
            value: function (t) {
                var p;
                var a;
                var s;
                if (t == 0) return 0;
                t = t / 0.5;
                if (t == 2) return 1;
                if (!p) {
                    p = 0.3 * 1.5;
                }
                if (!a || a < Math.abs(c)) {
                    a = 1;
                    s = p / 4;
                }
                else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                if (t < 1) {
                    return (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p)) * -0.5;
                }
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
            }
        });


        Object.defineProperty(Ease, "circularIn", {
            value: function (t) {
                return -(Math.sqrt(1 - t * t) - 1);
            }
        });

        Object.defineProperty(Ease, "circularOut", {
            value: function (t) {
                t = t - 1;
                return Math.sqrt(1 - t * t);
            }
        });

        Object.defineProperty(Ease, "circularInOut", {
            value: function (t) {
                t = t / 0.5;
                if (t < 1)
                    return -(Math.sqrt(1 - t * t) - 1) * 0.5;
                return (Math.sqrt(1 - (t -= 2) * t) + 1) * 0.5;
            }
        });


        return Ease;
    })();

    //var Animator = (function () {

    //    function Animator(startValue, endValue, totalTime, easeFunction, onValueCallback, onCompleted) {

    //        var _self = this;
    //        var _startValue = startValue;
    //        var _endValue = endValue;
    //        var _totalTime = totalTime;
    //        var _ease = "linear";
    //        var _easeFunction = easeFunction;
    //        var _onValueCallback = onValueCallback;
    //        var _onCompleted = onCompleted;

    //        var _deltaValue = _endValue - _startValue;
    //        var _lastComputedValue = _startValue;
    //        var _lastTimeStamp;
    //        var _elapsedTime = 0;
    //        var _frameIndex = 0;
    //        var _isRunning = false;
    //        var _isCompleted = false;


    //        function _init() {
    //            _self.reset();
    //        }


    //        Object.defineProperty(this, "startValue", {
    //            get: function () { return _startValue; },
    //            set: function (v) {
    //                if (_startValue != v) {
    //                    _startValue = v;
    //                }
    //            }
    //        });

    //        Object.defineProperty(this, "endValue", {
    //            get: function () { return _endValue; },
    //            set: function (v) {
    //                if (_endValue != v) {
    //                    _endValue = v;
    //                }
    //            }
    //        });

    //        Object.defineProperty(this, "totalTime", {
    //            get: function () { return _totalTime; },
    //            set: function (v) {
    //                if (_totalTime != v) {
    //                    _totalTime = v;
    //                }
    //            }
    //        });

    //        Object.defineProperty(this, "ease", {
    //            get: function () { return _ease; },
    //            set: function (v) {
    //                if (_ease != v) {
    //                    _ease = v;
    //                    _easeFunction = Ease.getEasingFunctionOrDefault(_ease);
    //                }
    //            }
    //        });


    //        Object.defineProperty(this, "isCompleted", {
    //            get: function () { return _isCompleted; }
    //        });

    //        Object.defineProperty(this, "elapsedTime", {
    //            get: function () { return _elapsedTime; }
    //        });

    //        Object.defineProperty(this, "frameIndex", {
    //            get: function () { return _frameIndex; }
    //        });


    //        Object.defineProperty(this, "provideValue", {
    //            value: function () {
    //                var lt = _elapsedTime / _totalTime;
    //                var lv = _easeFunction(lt);
    //                return _startValue + (lv * _deltaValue);
    //            }
    //        });

    //        Object.defineProperty(this, "notifyFrame", {
    //            value: function (timeStamp) {
    //                if (_isRunning) {
    //                    if (!_lastTimeStamp) {
    //                        _lastTimeStamp = timeStamp;
    //                    }
    //                    _elapsedTime += (timeStamp - _lastTimeStamp);
    //                    if (_elapsedTime > _totalTime) {
    //                        _self.stop();
    //                        _isCompleted = true;
    //                        _onCompleted();
    //                        return;
    //                    }

    //                    _lastTimeStamp = timeStamp;
    //                    _frameIndex++;

    //                    _onValueCallback(_self.provideValue());
    //                }
    //            }
    //        });

    //        Object.defineProperty(this, "start", {
    //            value: function () {
    //                if (_isRunning) {
    //                    return;
    //                }
    //                _isRunning = true;
    //            }
    //        });

    //        Object.defineProperty(this, "stop", {
    //            value: function () {
    //                if (!_isRunning) {
    //                    return;
    //                }
    //                _isRunning = false;
    //            }
    //        });

    //        Object.defineProperty(this, "restart", {
    //            value: function () {
    //                if (_isRunning) {
    //                    _self.reset();
    //                }
    //                _self.start();
    //            }
    //        });

    //        Object.defineProperty(this, "reset", {
    //            value: function () {
    //                if (_isRunning) {
    //                    _self.stop();
    //                }
    //                _lastComputedValue = _startValue;
    //                _lastTimeStamp = null;
    //                _elapsedTime = 0;
    //                _frameIndex = 0;
    //                _isCompleted = false;
    //            }
    //        });


    //        _init();
    //    }

    //    return Animator;

    //})();

    var Animator = (function () {

        function Animator(startValue, endValue, totalTime, easeFunction, onValueCallback, onCompleted) {

            var _self = this;
            var _startValue = startValue;
            var _endValue = endValue;
            var _totalTime = totalTime;
            var _ease = "linear";
            var _easeFunction = easeFunction;
            var _onValueCallback = onValueCallback;
            var _onCompleted = onCompleted;

            var _lastComputedValue = _startValue;
            var _lastTimeStamp;
            var _elapsedTime = 0;
            var _frameIndex = 0;
            var _isRunning = false;
            var _isCompleted = false;

            var _inputIsArray = false;
            var _inputIsObject = false;
            var _deltaValue = null;
            var _isDeltaDirty = true;


            function _init() {
                _self.reset();
            }

            function computeDeltaValue() {

                if (typeof _startValue !== typeof _endValue) {
                    throw new Error("invalid type, startValue, endValue");
                }

                _inputIsObject = false;
                _inputIsArray = false;
                if (typeof _startValue === "object") {
                    if (_startValue instanceof Array) {
                        _inputIsArray = true;
                    }
                    else {
                        _inputIsObject = true;
                    }
                }


                if (_inputIsArray) {
                    if (_startValue.length != _endValue.length) {
                        throw new Error("invalid array length, startValue, endValue");
                    }
                    _deltaValue =_endValue.map(function (v, i, a) {
                        return v - _startValue[i];
                    });
                }
                else if (_inputIsObject) {
                    _deltaValue = {};
                    for (var n in _endValue) {
                        if (_endValue.hasOwnProperty(n)) {
                            _deltaValue[n] = _endValue[n] - _startValue[n];
                        }
                    }
                }
                else {
                    _deltaValue = _endValue - _startValue;
                }
            }


            Object.defineProperty(this, "startValue", {
                get: function () { return _startValue; },
                set: function (v) {
                    if (_startValue != v) {
                        _startValue = v;
                        _self.reset();
                        _isDeltaDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "endValue", {
                get: function () { return _endValue; },
                set: function (v) {
                    if (_endValue != v) {
                        _endValue = v;
                        _self.reset();
                        _isDeltaDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "totalTime", {
                get: function () { return _totalTime; },
                set: function (v) {
                    if (_totalTime != v) {
                        _self.reset();
                        _totalTime = v;
                    }
                }
            });

            Object.defineProperty(this, "ease", {
                get: function () { return _ease; },
                set: function (v) {
                    if (_ease != v) {
                        _ease = v;
                        _easeFunction = Ease.getEasingFunctionOrDefault(_ease);
                    }
                }
            });


            Object.defineProperty(this, "isCompleted", {
                get: function () { return _isCompleted; }
            });

            Object.defineProperty(this, "elapsedTime", {
                get: function () { return _elapsedTime; }
            });

            Object.defineProperty(this, "frameIndex", {
                get: function () { return _frameIndex; }
            });


            Object.defineProperty(this, "provideValue", {
                value: function () {

                    var lt = _elapsedTime / _totalTime;
                    var lv = _easeFunction(lt);

                    if (_inputIsArray) {
                        return _deltaValue.map(function (v, i, a) {
                            return _startValue[i] + (lv * v);
                        });
                    }
                    else if (_inputIsObject) {
                        var result = {};
                        for (var n in _deltaValue) {
                            if (_deltaValue.hasOwnProperty(n)) {
                                result[n] = _startValue[n] + (lv * _deltaValue[n]);
                            }
                        }
                        return result;
                    }
                    else {
                        return _startValue + (lv * _deltaValue);
                    }
                }
            });

            Object.defineProperty(this, "notifyFrame", {
                value: function (timeStamp) {
                    if (_isRunning) {
                        if (!_lastTimeStamp) {
                            _lastTimeStamp = timeStamp;
                        }
                        _elapsedTime += (timeStamp - _lastTimeStamp);
                        if (_elapsedTime > _totalTime) {
                            _self.stop();
                            _isCompleted = true;
                            _onCompleted();
                            return;
                        }

                        _lastTimeStamp = timeStamp;
                        _frameIndex++;

                        _onValueCallback(_self.provideValue());
                    }
                }
            });

            Object.defineProperty(this, "start", {
                value: function () {
                    if (_isRunning) {
                        return;
                    }

                    if (!_deltaValue || _isDeltaDirty) {
                        computeDeltaValue();
                    }

                    _isRunning = true;
                }
            });

            Object.defineProperty(this, "stop", {
                value: function () {
                    if (!_isRunning) {
                        return;
                    }
                    _isRunning = false;
                }
            });

            Object.defineProperty(this, "restart", {
                value: function () {
                    _self.reset();
                    _self.start();
                }
            });

            Object.defineProperty(this, "reset", {
                value: function () {
                    if (_isRunning) {
                        _self.stop();
                    }
                    _lastComputedValue = _startValue;
                    _lastTimeStamp = null;
                    _elapsedTime = 0;
                    _frameIndex = 0;
                    _isCompleted = false;
                }
            });


            _init();
        }

        return Animator;

    })();

    var FpsCounter = (function () {

        function FpsCounter() {

            var _self = this;
            var _isRunning = false;
            var _lastTimeStamp;
            var _fps = 0;

            var _accumulatedFrames = 0;
            var _accumulatedTime = 0;


            Object.defineProperty(this, "fps", {
                get: function () { return _fps; }
            });

            Object.defineProperty(this, "sampleInterval", {
                writable: true,
                value: 500
            });


            Object.defineProperty(this, "notifyFrame", {
                value: function (timeStamp) {
                    if (_isRunning) {
                        //_framesCounter++;
                        if (!_lastTimeStamp) {
                            _lastTimeStamp = timeStamp;
                        }
                        var deltaTime = timeStamp - _lastTimeStamp;
                        
                        _lastTimeStamp = timeStamp;

                        if (_self.sampleInterval <= 0) {
                            _fps = 1000 / deltaTime;
                        }
                        else {
                            _accumulatedTime += deltaTime;
                            _accumulatedFrames++;
                            if (_accumulatedTime >= _self.sampleInterval) {
                                _fps = (1000 / _accumulatedTime) * _accumulatedFrames;
                                _accumulatedTime = 0;
                                _accumulatedFrames = 0;
                            }
                        }
                    }
                    else {
                        _fps = 0;
                    }
                }
            });

            Object.defineProperty(this, "start", {
                value: function () {
                    _isRunning = true;
                }
            });

            Object.defineProperty(this, "stop", {
                set: function () {
                    _isRunning = false;
                }
            });
        }
        return FpsCounter;
    })();

    var RenderLoop = (function () {

        function RenderLoop(loopCallback) {

            var _self = this;
            var _loopCallback = loopCallback;
            var _maxFps = 0;
            var _isRunning = false;
            var _loopArgs = {
                instance: _self,
                data: null,
                deltaTime: 0
            };

            var _lastLoopTime;
            var _renderTimeAccumulator = 0;
            var _renderTimeInterval;
            var _lastRenderDeltaTime = 0;
            var _fpsCounter;

            var _animators = [];
            var _animatorsToRemove = [];


            function _init() {

                if (typeof _loopCallback !== "function") {
                    throw new Error("missing loop callback");
                }

                _fpsCounter = new FpsCounter();

                computeTimeInterval();

                _lastLoopTime = Date.now();
                requestAnimationFrame(onRenderFrame);
            }


            function onRenderFrame(timeStamp) {

                if (_isRunning) {

                    if (!_lastLoopTime) _lastLoopTime = timeStamp;
                    var timeElapsed = timeStamp - _lastLoopTime;
                    if (timeElapsed < 0) timeElapsed = 0;
                    _lastLoopTime = timeStamp;

                    if (_renderTimeInterval > 0) {

                        _renderTimeAccumulator += timeElapsed;

                        if (_renderTimeAccumulator >= _renderTimeInterval) {
                            _renderTimeAccumulator -= _renderTimeInterval;
                            //_renderTimeAccumulator = 0;
                            _loopArgs.deltaTime = _lastLoopTime - _lastRenderDeltaTime;
                            _lastRenderDeltaTime = _lastLoopTime;
                            _loopCallback(_loopArgs);
                            _fpsCounter.notifyFrame(timeStamp);
                            //_animators.forEach(a => {
                            //    a.notifyFrame(timeStamp);
                            //    if (a.isCompleted) {

                            //    }
                            //});
                            onAnimatorFrame(timeStamp);
                        }
                    }
                    else {
                        _loopArgs.deltaTime = timeElapsed;
                        _loopCallback(_loopArgs);
                        _fpsCounter.notifyFrame(timeStamp);
                        //_animators.forEach(a => a.notifyFrame(timeStamp));
                        onAnimatorFrame(timeStamp);
                    }

                    
                }

                requestAnimationFrame(onRenderFrame);
            }

            function onAnimatorFrame(timeStamp) {
                _animators.forEach(a => {
                    a.notifyFrame(timeStamp);
                    if (a.isCompleted) {
                        var i = _animatorsToRemove.indexOf(a);
                        if (i >= 0) {
                            _animatorsToRemove.splice(i, 1);
                            _animators.splice(_animators.indexOf(a), 1);
                        }
                    }
                });
            }

            function computeTimeInterval() {
                if (_maxFps <= 0 || !Number.isFinite(_maxFps)) {
                    _renderTimeInterval = 0;
                } else {
                    _renderTimeInterval = 1000 / _maxFps;
                }
            }

            


            Object.defineProperty(this, "currentFps", {
                get: function () { return _fpsCounter.fps; }
            });

            Object.defineProperty(this, "maxFps", {
                get: function () { return _maxFps; },
                set: function (v) {
                    if (_maxFps != v) {
                        _maxFps = v;
                        computeTimeInterval();
                    }
                }
            });

            Object.defineProperty(this, "data", {
                get: function () { return _loopArgs.data; },
                set: function (v) {
                    _loopArgs.data = v;
                }
            });


            Object.defineProperty(this, "isRunning", {
                get: function () { return _isRunning; }
            });

            Object.defineProperty(this, "start", {
                value: function () {
                    _isRunning = true;
                    _fpsCounter.start();
                }
            });

            Object.defineProperty(this, "stop", {
                set: function () {
                    _isRunning = false;
                    _fpsCounter.stop();
                }
            });



            Object.defineProperty(this, "animate", {
                value: function (startValue, endValue, totalTime, easing, onValueCallback, onCompleted) {
                    var animator = _self.createAnimator(
                        startValue, endValue, totalTime, easing,
                        onValueCallback,
                        /*function (a) {
                            removeAnimator(a);
                            onCompleted();
                        }*/
                        onCompleted
                    );
                    _self.addAnimator(animator, true);
                    animator.start();
                }
            });

            Object.defineProperty(this, "createAnimator", {
                value: function (startValue, endValue, totalTime, easing, onValueCallback, onCompleted) {
                    return new Animator(
                        startValue, endValue, totalTime, Ease.getEasingFunctionOrDefault(easing),
                        onValueCallback,
                        onCompleted
                    );
                }
            });

            Object.defineProperty(this, "addAnimator", {
                value: function (animator, autoRemoveOnCompleted) {
                    if (_animators.indexOf(animator) === -1) {
                        var index = _animators.push(animator);
                        if (autoRemoveOnCompleted) {
                            _animatorsToRemove.push(animator);
                        }
                        return _animators.length - 1;
                    }
                    return -1;
                }
            });

            Object.defineProperty(this, "removeAnimator", {
                value: function (animator) {

                    var index = _animatorsToRemove.indexOf(animator);
                    if (index >= 0) {
                        _animatorsToRemove.splice(index, 1);
                    }

                    index = _animators.indexOf(animator);
                    if (index >= 0) {
                        _animators.splice(index, 1);
                        return true;
                    }
                    return false;
                }
            });



            _init();
        }

        return RenderLoop;

    })();
    lib.Cgx.RenderLoop = RenderLoop;

})(library);


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


/// <reference path="Events.js" />

(function (lib) {

    var Collection = (function () {

        function Collection() {

            var _self = this;
            var _items = [];
            var _events = new lib.Extra.Events(this);


            function insert(index, item) {
                if (index < 0)
                    index = 0;
                if (index >= _items.length)
                    index = _items.length;
                if (index === _items.length) {
                    _items.push(item);
                }
                else {
                    _items.splice(index, 0, [item]);
                }
                index = _items.length - 1;
                _events.raise("onItemsAdded", { index: index, items: [item] });
                return index;
            }

            function insertRange(index, items) {
                var i;
                if (index < 0)
                    index = 0;
                if (index >= _items.length)
                    index = _items.length;
                if (index === _items.length) {
                    for (i = 0; i < items.length; i++) {
                        _items.push(items[i]);
                    }
                }
                else {
                    _items.splice(index, 0, [items]);
                }
                if (_items.length > index) {
                    _events.raise("onItemsAdded", { index: index, items: items });
                }
                return index;
            }


            Object.defineProperty(this, "length", {
                get: function () { return _items.length; }
            });


            Object.defineProperty(this, "forEach", {
                value: function (callback) {
                    for (var i = 0; i < _items.length; i++) {
                        callback(_items[i], i, _self);
                    }
                }
            });

            Object.defineProperty(this, "add", {
                value: function (item) {
                    return insert(_items.length, item);
                }
            });

            Object.defineProperty(this, "addRange", {
                value: function (items) {
                    return insertRange(_items.length, items);
                }
            });

            Object.defineProperty(this, "at", {
                value: function (index) {
                    return _items[index];
                }
            });

            Object.defineProperty(this, "clear", {
                value: function () {
                    _items = [];
                    _events.raise("onCollectionCleared", {});
                }
            });

            Object.defineProperty(this, "contains", {
                value: function (item, selector) {
                    if (typeof selector === "function") {
                        for (var i = 0; i < _items.length; i++) {
                            if (selector(_items[i]) === item) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        return _items.indexOf(item) >= 0;
                    }
                }
            });

            Object.defineProperty(this, "indexOf", {
                value: function (item, selector) {
                    if (typeof selector === "function") {
                        var result = -1;
                        for (var i = 0; i < _items.length; i++) {
                            if (selector(_items[i]) === item) {
                                result = i;
                                break;
                            }
                        }
                        return result;
                    }
                    else {
                        return _items.indexOf(item);
                    }
                }
            });

            Object.defineProperty(this, "insert", {
                value: insert
            });

            Object.defineProperty(this, "insertRange", {
                value: insertRange
            });

            Object.defineProperty(this, "remove", {
                value: function (item, selector) {
                    var itemIndex = _self.indexOf(item, selector);
                    if (itemIndex === -1)
                        return false;
                    _items.splice(itemIndex, 1);
                    _events.raise("onItemsRemoved", { index: itemIndex, items: [item] });
                    return true;
                }
            });

            Object.defineProperty(this, "removeAt", {
                value: function (index) {
                    if (index < 0 || index >= _items.length)
                        return null;
                    var item = _items[index];
                    _items.splice(index, 1);
                    _events.raise("onItemsRemoved", { index: index, items: [item] });
                    return item;
                }
            });

            Object.defineProperty(this, "removeItems", {
                value: function (items) {
                    var itemIndex = -1;
                    var removedItems = [];
                    for (var i = 0; i < items.length; i++) {
                        itemIndex = _self.indexOf(items[i]);
                        if (itemIndex === -1)
                            continue;
                        var removed = _items.splice(itemIndex, 1);
                        removedItems.push(removed);
                    }
                    _events.raise("onItemsRemoved", { index: itemIndex, items: removedItems });
                    return removedItems;
                }
            });

            Object.defineProperty(this, "removeRange", {
                value: function (index, length) {
                    if (typeof index !== "number" || index < 0)
                        index = 0;
                    if (!length) {
                        length = _items.length - index;
                    }
                    var removedItems = _items.splice(index, length);
                    _events.raise("onItemsRemoved", { index: index, items: removedItems });
                    return removedItems;
                }
            });

            Object.defineProperty(this, "removeAll", {
                value: function () {
                    var removedItems = _items.splice(0, _items.length);
                    _events.raise("onCollectionCleared", {});
                    return removedItems;
                }
            });

            Object.defineProperty(this, "toArray", {
                value: function () {
                    return _items.slice(0);
                }
            });

            Object.defineProperty(this, "onItemsAdded", {
                value: new lib.Extra.EventGroup(_events, "onItemsAdded")
            });

            Object.defineProperty(this, "onItemsRemoved", {
                value: new lib.Extra.EventGroup(_events, "onItemsRemoved")
            });

            Object.defineProperty(this, "onCollectionCleared", {
                value: new lib.Extra.EventGroup(_events, "onCollectionCleared")
            });
        }

        return Collection;
    })();
    lib.Extra.Collection = Collection;

})(library);


(function (lib) {

    var HttpClient = (function () {

        function HttpClient(baseUrl) {

            var _self = this;
            var _events = new lib.Extra.Events(this);
            var _baseUrl;
            var _xhr;
            var _method = "GET";
            var _mimeType = "text/plain;charset=UTF-8";
            var _responseType = "text";
            var _timeout = 0;
            var _isBusy = false;
            var _useCredentials = false;


            function _init() {

                _baseUrl = formatBaseUrl(baseUrl);

                _xhr = new XMLHttpRequest();
                _xhr.addEventListener("progress", _xhr_onProgress);
                _xhr.addEventListener("load", _xhr_onLoad, false);
                _xhr.addEventListener("error", _xhr_onError, false);
                _xhr.addEventListener("abort", _xhr_onAbort, false);
                //_xhr.addEventListener("readystatechange", _xhr_onReadyStateChanged);
            }


            function _xhr_onProgress(e) {
                if (e.lengthComputable) {
                    var progress = {
                        loaded: e.loaded,
                        total: e.total,
                        percentage: (e.loaded / e.total) * 100
                    };
                    _events.raise("onProgress", progress);
                }
            }

            function _xhr_onLoad(e) {
                var result = {
                    result: _xhr.response,
                    resultType: _xhr.responseType,
                    rawResult: _xhr.responseText
                };
                _events.raise("onSuccess", result);
            }

            function _xhr_onError(e) {
                var error = {
                    status: _xhr.statusText,
                    code: _xhr.status
                };
                _events.raise("onError", error);
            }

            function _xhr_onAbort(e) {
                _events.raise("onAbort", {});
            }

            //function _xhr_onReadyStateChanged(e) {
            //    if (_xhr.readyState == XMLHttpRequest.DONE) {
            //        _isBusy = false;
            //        if (_xhr.status == 200) {
            //            // Request finished. Do processing here.
            //        }
            //        else {
            //            // Error
            //        }
            //    }
            //}

            function setRequestHeader(name, value) {
                _xhr.setRequestHeader(name, value);
            }

            function sendRequest(endPoint, optData) {

                if (_isBusy)
                    throw new Error("HttpClient is busy");

                var fullEndPoint = _baseUrl + endPoint;
                _isBusy = true;
                _xhr.open(_method, fullEndPoint, true);
                _xhr.timeout = _timeout;
                _xhr.withCredentials = _useCredentials;
                _xhr.overrideMimeType(_mimeType);
                _xhr.responseType = _responseType;
                _xhr.send(optData);
            }

            function abortRequest() {
                if (_isBusy) {
                    _xhr.abort();
                }
            }

            function formatBaseUrl(url) {
                if (typeof url !== "string")
                    return "";
                if (url.length == 0)
                    return "";
                if (url.substr(url.length - 1) !== "/")
                    url += "/";
                return url;
            }


            Object.defineProperty(this, "baseUrl", {
                get: function () { return _baseUrl; },
                set: function (v) {
                    if (typeof v === "string") {
                        v = formatBaseUrl(v);
                        if (_baseUrl !== v) {
                            _baseUrl = v;
                        }
                    }
                }
            });

            Object.defineProperty(this, "isBusy", {
                get: function () { return _isBusy; }
            });

            Object.defineProperty(this, "method", {
                get: function () { return _method; },
                set: function (v) {
                    if (typeof v === "string" && _method !== v) {
                        _method = v;
                    }
                }
            });

            Object.defineProperty(this, "mimeType", {
                get: function () { return _mimeType; },
                set: function (v) {
                    if (typeof v === "string" && _mimeType !== v) {
                        _mimeType = v;
                    }
                }
            });

            Object.defineProperty(this, "responseType", {
                get: function () { return _responseType; },
                set: function (v) {
                    if (typeof v === "string" && _responseType !== v) {
                        _responseType = v;
                    }
                }
            });

            Object.defineProperty(this, "timeout", {
                get: function () { return _timeout; },
                set: function (v) {
                    if (typeof v === "number" && _timeout !== v) {
                        _timeout = v;
                    }
                }
            });

            Object.defineProperty(this, "useCredentials", {
                get: function () { return _useCredentials; },
                set: function (v) {
                    v = !!v;
                    if (_useCredentials !== v) {
                        _useCredentials = v;
                    }
                }
            });


            Object.defineProperty(this, "setRequestHeader", { value: setRequestHeader });
            Object.defineProperty(this, "abortRequest", { value: abortRequest });
            Object.defineProperty(this, "sendRequest", { value: sendRequest });


            _events.create("onProgress");
            _events.create("onSuccess");
            _events.create("onError");
            _events.create("onAbort");

            _init();
        }


        function download(url, responseType, onSuccess, optOnError, optOnAbort) {
            var client = new HttpClient();
            client.method = "GET";
            client.responseType = responseType;
            client.onSuccess.addHandler(onSuccess);
            if (typeof optOnError === "function")
                client.onError.addHandler(optOnError);
            if (typeof optOnAbort === "function")
                client.onAbort.addHandler(optOnAbort);
            client.sendRequest(url);
        }

        Object.defineProperty(HttpClient, "downloadString", {
            value: function (url, onSuccess, optOnError, optOnAbort) {
                download(url, "text", onSuccess, optOnError, optOnAbort);
            }
        });

        Object.defineProperty(HttpClient, "downloadJSON", {
            value: function (url, onSuccess, optOnError, optOnAbort) {
                download(url, "json", onSuccess, optOnError, optOnAbort);
            }
        });


        return HttpClient;

    })();
    lib.Extra.HttpClient = HttpClient;

})(library);

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
/// <reference path="Point2D.js" />
/// <reference path="Rect.js" />

(function (lib) {

    var MathUtils = (function () {

        var MathUtils = {};

        Object.defineProperty(MathUtils, "areClose", {
            value: function (value1, value2) {
                if (value1 == value2) {
                    return true;
                }
                var n = ((Math.abs(value1) + Math.abs(value2)) + 10.0) * 2.2204460492503131E-16;
                var m = value1 - value2;
                return ((-n < m) && (n > m));
            }
        });

        Object.defineProperty(MathUtils, "isZero", {
            value: function (value) {
                return (Math.abs(value) < 2.2204460492503131E-15);
            }
        });

        Object.defineProperty(MathUtils, "isOne", {
            value: function (value) {
                return (Math.abs(value - 1.0) < 2.2204460492503131E-15);
            }
        });

        Object.defineProperty(MathUtils, "interpolatePointWithCubicCurves", {
            value: function (points, isClosed) {
                if (points.length < 3)
                    return [];
                var toRet = [];
                //if is close curve then add the first point at the end
                if (isClosed)
                    points.push(points[0]);
                for (var i = 0; i < points.length - 1; i++) {
                    // Assume we need to calculate the control
                    // points between (x1,y1) and (x2,y2).
                    // Then x0,y0 - the previous vertex,
                    //      x3,y3 - the next one.
                    var x1 = points[i].x;
                    var y1 = points[i].y;
                    var x2 = points[i + 1].x;
                    var y2 = points[i + 1].y;
                    var x0;
                    var y0;
                    var previousPoint;

                    if (i == 0) {
                        if (isClosed) {
                            previousPoint = points[points.length - 2]; //last Point2D, but one (due inserted the first at the end)
                            x0 = previousPoint.x;
                            y0 = previousPoint.y;
                        }
                        else {
                            previousPoint = points[i]; //if is the first point the previous one will be it self
                            x0 = previousPoint.x;
                            y0 = previousPoint.y;
                        }
                    }
                    else {
                        x0 = points[i - 1].x; //Previous Point2D
                        y0 = points[i - 1].y;
                    }
                    var x3, y3;
                    var nextPoint;
                    if (i == points.length - 2) {
                        if (isClosed) {
                            nextPoint = points[1]; //second Point2D(due inserted the first at the end)
                            x3 = nextPoint.x;
                            y3 = nextPoint.y;
                        }
                        else {
                            nextPoint = points[i + 1]; //if is the last point the next point will be the last one
                            x3 = nextPoint.x;
                            y3 = nextPoint.y;
                        }
                    }
                    else {
                        x3 = points[i + 2].x; //Next Point2D
                        y3 = points[i + 2].y;
                    }
                    var xc1 = (x0 + x1) / 2.0;
                    var yc1 = (y0 + y1) / 2.0;
                    var xc2 = (x1 + x2) / 2.0;
                    var yc2 = (y1 + y2) / 2.0;
                    var xc3 = (x2 + x3) / 2.0;
                    var yc3 = (y2 + y3) / 2.0;
                    var len1 = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
                    var len2 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                    var len3 = Math.sqrt((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2));
                    var k1 = len1 / (len1 + len2);
                    var k2 = len2 / (len2 + len3);
                    var xm1 = xc1 + (xc2 - xc1) * k1;
                    var ym1 = yc1 + (yc2 - yc1) * k1;
                    var xm2 = xc2 + (xc3 - xc2) * k2;
                    var ym2 = yc2 + (yc3 - yc2) * k2;
                    var smoothValue = 0.8;
                    // Resulting control points. Here smooth_value is mentioned
                    // above coefficient K whose value should be in range [0...1].
                    var ctrl1_x = xm1 + (xc2 - xm1) * smoothValue + x1 - xm1;
                    var ctrl1_y = ym1 + (yc2 - ym1) * smoothValue + y1 - ym1;
                    var ctrl2_x = xm2 + (xc2 - xm2) * smoothValue + x2 - xm2;
                    var ctrl2_y = ym2 + (yc2 - ym2) * smoothValue + y2 - ym2;
                    toRet.push({
                        startPoint: { x: x1, y: y1 },
                        endPoint: { x: x2, y: y2 },
                        firstControlPoint: i == 0 && !isClosed ? { x: x1, y: y1 } : { x: ctrl1_x, y: ctrl1_y },
                        secondControlPoint: i == points.length - 2 && !isClosed ? { x: x2, y: y2 } : { x: ctrl2_x, y: ctrl2_y }
                    });
                }
                return toRet;
            }
        });

        Object.defineProperty(MathUtils, "getPointsBounds", {
            value: function (points) {
                if (points.length == 0) {
                    return lib.Vgx.Rect.empty;
                }
                if (points.length == 1) {
                    return new lib.Vgx.Rect(points[0].x, points[0].y, 0, 0);
                }
                var minX = Number.MAX_VALUE;
                var minY = Number.MAX_VALUE;
                var maxX = Number.MIN_VALUE;
                var maxY = Number.MIN_VALUE;
                for (var i = 0; i < points.length; i++) {
                    var p = points[i];
                    minX = Math.min(minX, p.x);
                    minY = Math.min(minY, p.y);
                    maxX = Math.max(maxX, p.x);
                    maxY = Math.max(maxY, p.y);
                }
                return new lib.Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
            }
        });

        return MathUtils;
    })();
    lib.Vgx.MathUtils = MathUtils;

})(library);
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

/// <reference path="../Cgx/Transform.js" />

(function (lib) {

    var EntityTransform = (function () {

        function EntityTransform(entity) {
            lib.Cgx.Transform.call(this);

            var _self = this;
            var _entity = entity;


            Object.defineProperty(this, "entity", {
                get: function () { return _entity; }
            });


            Object.defineProperty(this, "_propertyChanged", {
                enumerable: false,
                configurable: false,
                value: function (propertyName) {
                    _entity.geometryDirty = true;
                }
            });
        }

        EntityTransform.prototype = Object.create(lib.Cgx.Transform.prototype);
        EntityTransform.prototype.constructor = EntityTransform;

        return EntityTransform;

    })();
    lib.Vgx.EntityTransform = EntityTransform;

})(library);

/// <reference path="../Cgx/Matrix.js" />

/// <reference path="Point2D.js" />
/// <reference path="Rect.js" />


(function (lib) {

    var ViewTransform = (function () {

        function ViewTransform() {

            var _self = this;
            var _matrix = new lib.Cgx.Matrix();
            var _isDirty = true;
            var _viewZoom = 1;
            var _viewTargetX = 0;
            var _viewTargetY = 0;
            var _viewPixelWidth = 1;
            var _viewPixelHeight = 1;
            var _viewPixelHalfWidth = _viewPixelWidth * 0.5;
            var _viewPixelHalfHeight = _viewPixelHeight * 0.5;



            function computeInternalMatrix() {

                _matrix.reset();

                _matrix.translate(_viewPixelHalfWidth, _viewPixelHalfHeight);
                _matrix.scale(_viewZoom, _viewZoom);
                _matrix.translate(-_viewTargetX, -_viewTargetY);

                _isDirty = false;

                setTarget(_viewTargetX, _viewTargetY);
            }

            function setTarget(x, y)
            {
                var globalViewRect = _self.localToGlobalRect(0, 0, _viewPixelWidth, _viewPixelHeight);
                var offsetX = -x + (globalViewRect.width * 0.5);
                var offsetY = -y + (globalViewRect.height * 0.5);
                offsetX *= _viewZoom;
                offsetY *= _viewZoom;
                setMatrixOffset(offsetX, offsetY);
                _viewTargetX = x;
                _viewTargetY = y;
            }


            function getMatrixInverted() {
                if (_matrix.hasInverse()) {
                    return lib.Cgx.Matrix.invert(_matrix);
                }
                else {
                    return _matrix;
                }
            }

            function setMatrixOffset(offsetX, offsetY) {
                _matrix.offsetX = offsetX;
                _matrix.offsetY = offsetY;
            }



            Object.defineProperty(this, "getMatrix", {
                value: function () {
                    if (_isDirty) {
                        computeInternalMatrix();
                    }
                    return _matrix;
                }
            });

            Object.defineProperty(this, "getViewBounds", {
                value: function () {
                    return _self.localToGlobalRect(0, 0, _viewPixelWidth, _viewPixelHeight);
                }
            });


            Object.defineProperty(this, "setViewPixelSize", {
                value: function (width, height) {
                    _viewPixelWidth = width;
                    _viewPixelHeight = height;
                    _viewPixelHalfWidth = _viewPixelWidth * 0.5;
                    _viewPixelHalfHeight = _viewPixelHeight * 0.5;
                    _isDirty = true;
                }
            });

            Object.defineProperty(this, "setViewTarget", {
                value: function (tx, ty) {
                    setTarget(tx, ty);
                    _isDirty = true;
                }
            });

            Object.defineProperty(this, "moveViewTarget", {
                enumerable: false,
                value: function (dx, dy) {
                    setTarget(_viewTargetX + dx, _viewTargetY + dy);
                    _isDirty = true;
                }
            });

            Object.defineProperty(this, "setViewZoom", {
                value: function (value) {
                    _viewZoom = value;
                    _isDirty = true;
                }
            });

            Object.defineProperty(this, "setViewZoomTo", {
                enumerable: false,
                value: function (zoomIncrement, tx, ty) {
                    setTarget(tx, ty);
                    _viewZoom *= zoomIncrement;
                    _isDirty = true;
                }
            });


            Object.defineProperty(this, "viewTargetX", {
                get: function () { return _viewTargetX; }
            });

            Object.defineProperty(this, "viewTargetY", {
                get: function () { return _viewTargetY; }
            });

            Object.defineProperty(this, "viewZoom", {
                get: function () { return _viewZoom; }
            });




            Object.defineProperty(this, "globalToLocalPoint", {
                value: function (x, y) {
                    return _self.getMatrix().transformPoint(x, y);
                }
            });

            Object.defineProperty(this, "globalToLocalRect", {
                value: function (x, y, width, height) {
                    //var endX = x + width;
                    //var endY = y + height;
                    //var matrix = _self.getMatrix();
                    //var start = matrix.transform(x, y);
                    //var end = matrix.transform(endX, endY);
                    //var lx, ly, lw, lh;
                    //lx = start.x;
                    //ly = start.y;
                    //lw = end.x - lx;
                    //lh = end.y - ly;
                    //return new lib.Vgx.Rect(lx, ly, lw, lh);
                    return _self.getMatrix().transformRect(x, y, width, height);
                }
            });

            Object.defineProperty(this, "localToGlobalPoint", {
                value: function (x, y) {
                    return getMatrixInverted().transformPoint(x, y);
                }
            });

            Object.defineProperty(this, "localToGlobalRect", {
                value: function (x, y, width, height) {
                    //var endX = x + width;
                    //var endY = y + height;
                    //var invertedMatrix = getMatrixInverted();
                    //var start = invertedMatrix.transform(x, y);
                    //var end = invertedMatrix.transform(endX, endY);
                    //var lx, ly, lw, lh;
                    //lx = start.x;
                    //ly = start.y;
                    //lw = end.x - lx;
                    //lh = end.y - ly;
                    //return new lib.Vgx.Rect(lx, ly, lw, lh);
                    return getMatrixInverted().transformRect(x, y, width, height);
                }
            });
        }

        return ViewTransform;
    })();
    lib.Vgx.ViewTransform = ViewTransform;

    //var ViewTransform = (function () {

    //    function ViewTransform() {

    //        var _self = this;
    //        var _matrix = lib.Cgx.Matrix.identity;
    //        var _zoomCenterX;
    //        var _zoomCenterY;
    //        var _viewZoom = 1;
    //        var _isBottomUp = false;
    //        var _viewTargetX = 0;
    //        var _viewTargetY = 0;
    //        var _viewPixelWidth = 0;
    //        var _viewPixelHeight = 0;


    //        function computeInternalMatrix() {
    //            var internalMatrix = new lib.Cgx.Matrix();
    //            // TODO
    //            if (_isBottomUp) {
    //                internalMatrix.scale(1, -1);
    //                internalMatrix.scaleAt(_viewZoom, _viewZoom, -_zoomCenterX, _zoomCenterY);
    //            }
    //            else {
    //                internalMatrix.scale(1, 1);
    //                internalMatrix.scaleAt(_viewZoom, _viewZoom, -_zoomCenterX, -_zoomCenterY);
    //            }
    //            //
    //            internalMatrix.translate(_viewPixelWidth * 0.5, _viewPixelHeight * 0.5);
    //            updateInternalMatrix(internalMatrix);
    //            _self._setViewTargetPoint(_viewTargetX, _viewTargetY);
    //        }

    //        function updateInternalMatrix(matrix) {
    //            _matrix = matrix;
    //        }

    //        function setMatrixOffset(offsetX, offsetY) {
    //            _matrix.offsetX = offsetX;
    //            _matrix.offsetY = offsetY;
    //        }

    //        function getMatrixInverted() {
    //            if (_matrix.hasInverse()) {
    //                return lib.Cgx.Matrix.invert(_matrix);
    //            }
    //            else {
    //                return _matrix;
    //            }
    //        }


    //        /*#region internals*/

    //        Object.defineProperty(this, "_setViewTargetPoint", {
    //            enumerable: false,
    //            value: function (x, y) {
    //                var globalViewRect = _self.localToGlobalRect(0, 0, _viewPixelWidth, _viewPixelHeight);
    //                var offsetX = -x + (globalViewRect.width * 0.5);
    //                var offsetY = y + (globalViewRect.height * 0.5);
    //                offsetX *= _viewZoom;
    //                offsetY *= _viewZoom;
    //                setMatrixOffset(offsetX, offsetY);
    //                _viewTargetX = x;
    //                _viewTargetY = y;
    //            }
    //        });

    //        Object.defineProperty(this, "_moveTargetPoint", {
    //            enumerable: false,
    //            value: function (dx, dy) {
    //                _self._setViewTargetPoint(_viewTargetX + dx, _viewTargetY + dy);
    //            }
    //        });

    //        Object.defineProperty(this, "_setViewZoom", {
    //            enumerable: false,
    //            value: function (zoom) {
    //                _viewZoom = zoom;
    //                _zoomCenterX = _viewTargetX;
    //                _zoomCenterY = _viewTargetY;
    //                computeInternalMatrix();
    //            }
    //        });

    //        Object.defineProperty(this, "_setViewZoomTo", {
    //            enumerable: false,
    //            value: function (zoom, targetX, targetY) {
    //                var dx = targetX - (_viewPixelWidth * 0.5);
    //                var dy = targetY - (_viewPixelHeight * 0.5);
    //                _self._moveTargetPoint(dx, dy);
    //                _self._setViewTargetPoint(targetX, targetY);
    //                _viewZoom = zoom;
    //                computeInternalMatrix();
    //            }
    //        });

    //        /*Object.defineProperty(this, "_setViewZoomFrom", {
    //            enumerable: false,
    //            value: function (zoom, x, y) {
    
    //                var screenCenterInScene = _self.localToGlobalPoint(
    //                    _viewPixelWidth * 0.5,
    //                    _viewPixelHeight * 0.5
    //                );
         
    //                var dx = (x - screenCenterInScene.x) / zoom;
    //                var dy = (y - screenCenterInScene.y) / zoom;
                     
    //                _self._setViewZoomTo(zoom, screenCenterInScene.x - dx, screenCenterInScene.y - dy);
    //                //_viewZoom = zoom;
    //                //_viewTargetX += dx;
    //                //_viewTargetY += dy;
    //                ////_self._moveTargetPoint(-dx, -dy);
         
    //                //computeInternalMatrix();
         
    //                //TODO:
    //                // calcolare la differenza tra il punto target ed il centro del frame
    //                // alla fine della trasformazione sottrarre la differenza agli offset
         
    //             }
    //        });*/

    //        Object.defineProperty(this, "_setViewPixelSize", {
    //            enumerable: false,
    //            value: function (width, height) {
    //                _viewPixelWidth = width;
    //                _viewPixelHeight = height;
    //                computeInternalMatrix();
    //            }
    //        });

    //        /*#endregion*/


    //        /*#region public*/


    //        Object.defineProperty(this, "setViewTarget", {
    //            value: function (x, y) {

    //            }
    //        });

    //        Object.defineProperty(this, "setViewZoom", {
    //            value: function (value) {
    //                _viewZoom = value;
    //                _zoomCenterX = _viewTargetX;
    //                _zoomCenterY = _viewTargetY;
    //                computeInternalMatrix();
    //            }
    //        });



    //        Object.defineProperty(this, "matrix", {
    //            get: function () { return _matrix; }
    //        });


    //        Object.defineProperty(this, "viewTargetX", {
    //            get: function () { return _viewTargetX; }
    //        });

    //        Object.defineProperty(this, "viewTargetY", {
    //            get: function () { return _viewTargetY; }
    //        });

    //        Object.defineProperty(this, "viewZoom", {
    //            get: function () { return _viewZoom; }
    //        });

    //        Object.defineProperty(this, "viewWidth", {
    //            get: function () { return _viewWidth; }
    //        });

    //        Object.defineProperty(this, "viewHeight", {
    //            get: function () { return _viewHeight; }
    //        });


    //        Object.defineProperty(this, "viewPixelWidth", {
    //            get: function () { return _viewPixelWidth; }
    //        });

    //        Object.defineProperty(this, "viewPixelHeight", {
    //            get: function () { return _viewPixelHeight; }
    //        });


    //        //Object.defineProperty(this, "isBottomUp", {
    //        //    get: function () { return _isBottomUp; },
    //        //    set: function (v) {
    //        //        v = !!v;
    //        //        if (_isBottomUp != v) {
    //        //            _isBottomUp = v;
    //        //            computeInternalMatrix();
    //        //        }
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "globalToLocalPoint", {
    //        //    value: function (x, y) {
    //        //        return _matrix.transform(x, y);
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "globalToLocalRect", {
    //        //    value: function (x, y, width, height) {
    //        //        var endX = x + width;
    //        //        var endY = y + height;
    //        //        var start = _matrix.transform(x, y);
    //        //        var end = _matrix.transform(endX, endY);
    //        //        var lx, ly, lw, lh;
    //        //        if (_isBottomUp) {
    //        //            lx = start.x;
    //        //            ly = end.y;
    //        //            lw = end.x - lx;
    //        //            lh = start.y - ly;
    //        //        }
    //        //        else {
    //        //            lx = start.x;
    //        //            ly = start.y;
    //        //            lw = end.x - lx;
    //        //            lh = end.y - ly;
    //        //        }
    //        //        return new lib.Vgx.Rect(lx, ly, lw, lh);
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "transformSizeToView", {
    //        //    value: function (width, height) {
    //        //        var st = _matrix.transform(width, height);
    //        //        return {
    //        //            width: Math.abs(st.x - _matrix.offsetX),
    //        //            height: Math.abs(st.y - _matrix.offsetY)
    //        //        };
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "transformPointsToView", {
    //        //    value: function (points) {
    //        //        var result = new Array(points.length);
    //        //        for (var i = 0; i < points.length; i++) {
    //        //            var p = points[i];
    //        //            result[i] = _matrix.transform(p.x, p.y);
    //        //        }
    //        //        return result;
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "localToGlobalPoint", {
    //        //    value: function (x, y) {
    //        //        return getMatrixInverted().transform(x, y);
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "localToGlobalRect", {
    //        //    value: function (x, y, width, height) {
    //        //        var endX = x + width;
    //        //        var endY = y + height;
    //        //        var invertedMatrix = getMatrixInverted();
    //        //        var start = invertedMatrix.transform(x, y);
    //        //        var end = invertedMatrix.transform(endX, endY);
    //        //        var lx, ly, lw, lh;
    //        //        if (_isBottomUp) {
    //        //            lx = start.x;
    //        //            ly = end.y;
    //        //            lw = end.x - lx;
    //        //            lh = start.y - ly;
    //        //        }
    //        //        else {
    //        //            lx = start.x;
    //        //            ly = start.y;
    //        //            lw = end.x - lx;
    //        //            lh = end.y - ly;
    //        //        }
    //        //        return new lib.Vgx.Rect(lx, ly, lw, lh);
    //        //    }
    //        //});


    //        //Object.defineProperty(this, "scale", {
    //        //    value: function (scaleX, scaleY) {
    //        //        _matrix.scale(scaleX, scaleY);
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "rotate", {
    //        //    value: function (angle) {
    //        //        _matrix.rotate(angle);
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "translate", {
    //        //    value: function (dx, dy) {
    //        //        _matrix.translate(dx * _viewZoom, dy * _viewZoom);
    //        //    }
    //        //});

    //        /*#endregion*/
    //    }

    //    return ViewTransform;
    //})();
    //lib.Vgx.ViewTransform = ViewTransform;

})(library);


(function (lib) {

    var PointDefinition = (function () {

        function PointDefinition(id, figures) {

            var _id = id;
            var _figures = figures;
            var _vgxPath = null;


            function buildPath() {
                _vgxPath = new lib.Vgx.Path();
                // *** copied from DrawingLoader.js
                for (var f = 0; f < _figures.length; f++) {
                    var figure = _figures[f];
                    switch (figure.type) {
                        case "arc":
                            _vgxPath.addArc(figure.insertPointX, figure.insertPointY, figure.radius, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
                            break;
                        case "rect":
                            _vgxPath.addRect(figure.insertPointX, figure.insertPointY, figure.width, figure.height);
                            break;
                        case "ellipse":
                            _vgxPath.addEllipse(figure.insertPointX, figure.insertPointY, figure.radiusX, figure.radiusY, figure.rotation || 0, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
                            break;
                        case "path":
                            _vgxPath.addFigure(figure.data);
                            break;
                    }
                }
                // ***
            }

            Object.defineProperty(this, "_getPath", {
                value: function () {
                    if (_vgxPath == null) {
                        buildPath();
                    }
                    return _vgxPath;
                }
            });


            Object.defineProperty(this, "id", {
                get: function () { return _id; }
            });

            Object.defineProperty(this, "anchorX", { value: 0, writable: true });
            Object.defineProperty(this, "anchorY", { value: 0, writable: true });
        }

        return PointDefinition;

    })();
    lib.Vgx.PointDefinition = PointDefinition;

})(library);

//(function (lib) {

//    var PointDefinition = (function () {

//        function PointDefinition(id, onDrawHandler) {

//            Object.defineProperty(this, "id", {
//                get: function () { return id; }
//            });

//            Object.defineProperty(this, "draw", {
//                get: function () { return onDrawHandler; }
//            });
//        }

//        return PointDefinition;
//    })();
//    lib.Vgx.PointDefinition = PointDefinition;

//})(library);


(function (lib) {

    var PointDefinitions = (function () {

        var PointDefinitions = {};

        Object.defineProperty(PointDefinitions, "type1", {
            get: function () {
                return new lib.Vgx.PointDefinition(
                    "type1",
                    [
                        {
                            type: "path",
                            data: "M 0.0,0.5 L 1.0,0.5 M 0.5,0.0 L 0.5,1.0"
                        },
                        {
                            type: "ellipse",
                            insertPointX: 0.5,
                            insertPointY: 0.5,
                            radiusX: 0.5,
                            radiusY: 0.5,
                            startAngle: 0,
                            endAngle: 2 * Math.PI
                        }
                    ],
                    0.5,
                    0.5
                )
            }
        });

        Object.defineProperty(PointDefinitions, "type2", {
            get: function () {
                return new lib.Vgx.PointDefinition(
                    "type2",
                    [
                        {
                            type: "path",
                            data: "M -0.353553390,-0.353553390 L 0.353553390,0.353553390 M -0.353553390,0.353553390 L 0.353553390,-0.353553390"
                        },
                        {
                            type: "ellipse",
                            insertPointX: 0.0,
                            insertPointY: 0.0,
                            radiusX: 0.5,
                            radiusY: 0.5,
                            startAngle: 0,
                            endAngle: 2 * Math.PI
                        }
                    ],
                    0.5,
                    0.5
                )
            }
        });

        return PointDefinitions;

    })();
    lib.Vgx.PointDefinitions = PointDefinitions;

})(library);

/// <reference path="../Cgx/CoreGraphics.js" />
/// <reference path="objectModel/Drawing.js" />
/// <reference path="ViewTransform.js" />

(function (lib) {

    var DrawingContext = (function () {

        function DrawingContext(drawing, canvas, viewTransform) {

            var _self = this;
            var _canvas = canvas;
            var _drawing = drawing;
            var _viewTransform = viewTransform;
            var _graphics;

            var _scaleStyles = true;
            var _fill = 0xffffffff;
            var _stroke = 0xff000000;
            var _strokeWidth = 1;
            var _shadow;
            var _fontSize = 16;
            var _fontFamily = "Arial";


            function _init() {
                _graphics = new lib.Cgx.CoreGraphics(_canvas);
                _self.shadow = new lib.Vgx.Shadow();
            }


            Object.defineProperty(this, "_beginRender", {
                enumerable: false,
                value: function () {
                    _self.pushTransform(_viewTransform);
                }
            });

            Object.defineProperty(this, "_endRender", {
                enumerable: false,
                value: function () {
                    _self.popTransform();
                }
            });

            Object.defineProperty(this, "_getImageData", {
                enumerable: false,
                value: function () {
                    return _graphics.getImageData();
                }
            });



            Object.defineProperty(this, "drawing", {
                get: function () { return _drawing; }
            });

            Object.defineProperty(this, "scaleStyles", {
                get: function () { return _scaleStyles; },
                set: function (v) {
                    _scaleStyles = !!v;
                }
            });

            Object.defineProperty(this, "shadow", {
                get: function () { return _graphics.getShadow(); },
                set: function (v) {
                    _graphics.setShadow(v);
                }
            });

            Object.defineProperty(this, "fillBrush", {
                get: function () { return _graphics.getFillBrush(); },
                set: function (v) {
                    _graphics.setFillBrush(v);
                }
            });

            Object.defineProperty(this, "strokeBrush", {
                get: function () { return _graphics.getStrokeBrush(); },
                set: function (v) {
                    _graphics.setStrokeBrush(v);
                }
            });

            Object.defineProperty(this, "strokeWidth", {
                get: function () {
                    if (_scaleStyles) {
                        return _graphics.getStrokeWidth();
                    } else {
                        return _graphics.getStrokeWidth() * _viewTransform.viewZoom;
                    }
                },
                set: function (v) {
                    if (_scaleStyles) {
                        _graphics.setStrokeWidth(v);
                    } else {
                        _graphics.setStrokeWidth(v / _viewTransform.viewZoom);
                    }
                }
            });

            Object.defineProperty(this, "fontFamily", {
                get: function () { return _graphics.getFontFamily(); },
                set: function (v) {
                    _graphics.setFontFamily(v);
                }
            });

            Object.defineProperty(this, "fontSize", {
                get: function () { return _graphics.getFontSize(); },
                set: function (v) {
                    _graphics.setFontSize(v);
                }
            });

            Object.defineProperty(this, "textBaseline", {
                get: function () { return _graphics.getTextBaseline(); },
                set: function (v) {
                    _graphics.setTextBaseline(v);
                }
            });


            Object.defineProperty(this, "clear", {
                value: function (optFillBrush) { _graphics.clear(optFillBrush); }
            });




            Object.defineProperty(this, "drawArc", {
                value: function (vgxArc) {
                    _graphics.setStrokeBrush(vgxArc.stroke);
                    _self.strokeWidth = vgxArc.strokeWidth;
                    _graphics.setShadow(vgxArc.shadow);
                    _graphics.drawArc(vgxArc.insertPointX, vgxArc.insertPointY, vgxArc.radius, vgxArc.startAngleRad, vgxArc.endAngleRad, vgxArc.isAntiClockwise, vgxArc.transform);
                }
            });

            Object.defineProperty(this, "drawLine", {
                value: function (vgxLine) {
                    _graphics.setStrokeBrush(vgxLine.stroke);
                    _self.strokeWidth = vgxLine.strokeWidth;
                    _graphics.setShadow(vgxLine.shadow);
                    //_graphics.drawPath2D(vgxLine.insertPointX, vgxLine.insertPointY, vgxLine._getPath(), null, vgxLine.transform);
                    _graphics.drawLine(vgxLine.insertPointX, vgxLine.insertPointY, vgxLine.endPoint.x, vgxLine.endPoint.y, vgxLine.transform);
                }
            });

            Object.defineProperty(this, "drawRectangle", {
                value: function (vgxRectangle) {
                    _graphics.setFillBrush(vgxRectangle.fill);
                    _graphics.setStrokeBrush(vgxRectangle.stroke);
                    _self.strokeWidth = vgxRectangle.strokeWidth;
                    _graphics.setShadow(vgxRectangle.shadow);
                    if (vgxRectangle.cornersRadius === 0) {
                        _graphics.drawRectangle(vgxRectangle.insertPointX, vgxRectangle.insertPointY, vgxRectangle.width, vgxRectangle.height, vgxRectangle.transform);
                    }
                    else {
                        _graphics.drawRoundedRectangle(vgxRectangle.insertPointX, vgxRectangle.insertPointY, vgxRectangle.width, vgxRectangle.height, vgxRectangle.cornersRadius, vgxRectangle.transform);
                    }
                }
            });

            Object.defineProperty(this, "drawSquare", {
                value: function (vgxSquare) {
                    _graphics.setFillBrush(vgxSquare.fill);
                    _graphics.setStrokeBrush(vgxSquare.stroke);
                    _self.strokeWidth = vgxSquare.strokeWidth;
                    _graphics.setShadow(vgxSquare.shadow);
                    if (vgxSquare.cornersRadius === 0) {
                        _graphics.drawSquare(vgxSquare.insertPointX, vgxSquare.insertPointY, vgxSquare.size, vgxSquare.transform);
                    }
                    else {
                        _graphics.drawRoundedRectangle(vgxSquare.insertPointX, vgxSquare.insertPointY, vgxSquare.size, vgxSquare.size, vgxSquare.cornersRadius, vgxSquare.transform);
                    }
                }
            });

            Object.defineProperty(this, "drawCircle", {
                value: function (vgxCircle) {
                    _graphics.setFillBrush(vgxCircle.fill);
                    _graphics.setStrokeBrush(vgxCircle.stroke);
                    _self.strokeWidth = vgxCircle.strokeWidth;
                    _graphics.setShadow(vgxCircle.shadow);
                    _graphics.drawCircle(vgxCircle.insertPointX, vgxCircle.insertPointY, vgxCircle.radius, vgxCircle.transform);
                }
            });

            Object.defineProperty(this, "drawEllipse", {
                value: function (vgxEllipse) {
                    _graphics.setFillBrush(vgxEllipse.fill);
                    _graphics.setStrokeBrush(vgxEllipse.stroke);
                    _self.strokeWidth = vgxEllipse.strokeWidth;
                    _graphics.setShadow(vgxEllipse.shadow);
                    _graphics.drawEllipse(vgxEllipse.insertPointX, vgxEllipse.insertPointY, vgxEllipse.xRadius, vgxEllipse.yRadius, vgxEllipse.transform);
                }
            });

            Object.defineProperty(this, "drawPolyline", {
                value: function (vgxPolyline) {
                    _graphics.setStrokeBrush(vgxPolyline.stroke);
                    _self.strokeWidth = vgxPolyline.strokeWidth;
                    _graphics.setShadow(vgxPolyline.shadow);
                    _graphics.drawPolyline(vgxPolyline.points.toArray(), vgxPolyline.transform);
                }
            });

            Object.defineProperty(this, "drawPolygon", {
                value: function (vgxPolygon) {
                    _graphics.setFillBrush(vgxPolygon.fill);
                    _graphics.setStrokeBrush(vgxPolygon.stroke);
                    _self.strokeWidth = vgxPolygon.strokeWidth;
                    _graphics.setShadow(vgxPolygon.shadow);
                    _graphics.drawPolygon(vgxPolygon.points.toArray(), vgxPolygon.transform);
                }
            });

            Object.defineProperty(this, "drawTriangle", {
                value: function (vgxTriangle) {
                    _graphics.setFillBrush(vgxTriangle.fill);
                    _graphics.setStrokeBrush(vgxTriangle.stroke);
                    _self.strokeWidth = vgxTriangle.strokeWidth;
                    _graphics.setShadow(vgxTriangle.shadow);
                    _graphics.drawTriangle(vgxTriangle.point1, vgxTriangle.point2, vgxTriangle.point3, vgxTriangle.transform);
                }
            });

            Object.defineProperty(this, "drawQuad", {
                value: function (vgxQuad) {
                    _graphics.setFillBrush(vgxQuad.fill);
                    _graphics.setStrokeBrush(vgxQuad.stroke);
                    _self.strokeWidth = vgxQuad.strokeWidth;
                    _graphics.setShadow(vgxQuad.shadow);
                    _graphics.drawQuad(vgxQuad.point1, vgxQuad.point2, vgxQuad.point3, vgxQuad.point4, vgxQuad.transform);
                }
            });

            Object.defineProperty(this, "drawCubicCurve", {
                value: function (vgxCubicCurve) {
                    _graphics.setFillBrush(vgxCubicCurve.fill);
                    _graphics.setStrokeBrush(vgxCubicCurve.stroke);
                    _self.strokeWidth = vgxCubicCurve.strokeWidth;
                    _graphics.setShadow(vgxCubicCurve.shadow);
                    _graphics.drawCubicCurve(vgxCubicCurve.points.toArray(), vgxCubicCurve.controlPoints1.toArray(), vgxCubicCurve.controlPoints2.toArray(), vgxCubicCurve.isClosed, vgxCubicCurve.transform);
                }
            });

            Object.defineProperty(this, "drawQuadraticCurve", {
                value: function (vgxQuadraticCurve) {
                    _graphics.setFillBrush(vgxQuadraticCurve.fill);
                    _graphics.setStrokeBrush(vgxQuadraticCurve.stroke);
                    _self.strokeWidth = vgxQuadraticCurve.strokeWidth;
                    _graphics.setShadow(vgxQuadraticCurve.shadow);
                    _graphics.drawQuadraticCurve(vgxQuadraticCurve.points.toArray(), vgxQuadraticCurve.controlPoints.toArray(), vgxQuadraticCurve.isClosed, vgxQuadraticCurve.transform);
                }
            });

            Object.defineProperty(this, "drawImage", {
                value: function (vgxImage) {
                    _graphics.setStrokeBrush(vgxImage.stroke);
                    _self.strokeWidth = vgxImage.strokeWidth;
                    _graphics.setShadow(vgxImage.shadow);
                    _graphics.drawImage(vgxImage.image, vgxImage.insertPointX, vgxImage.insertPointY, vgxImage.width, vgxImage.height, vgxImage.transform);
                }
            });

            Object.defineProperty(this, "drawText", {
                value: function (vgxText, optMeasure) {
                    optMeasure = !!optMeasure;
                    _graphics.setFillBrush(vgxText.fill);
                    _graphics.setStrokeBrush(vgxText.stroke);
                    _self.strokeWidth = vgxText.strokeWidth;
                    _graphics.setShadow(vgxText.shadow);
                    _graphics.setFontFamily(vgxText.fontFamily);
                    _graphics.setFontSize(vgxText.fontSize);
                    _graphics.setTextAlign(vgxText.textAlign);
                    _graphics.setTextBaseline(vgxText.textBaseline);
                    _graphics.drawText(vgxText.insertPointX, vgxText.insertPointY, vgxText.text, vgxText.transform);
                    if (optMeasure)
                        return _graphics.measureText(vgxText.text);
                }
            });

            Object.defineProperty(this, "drawPath", {
                value: function (vgxPath) {
                    _graphics.setFillBrush(vgxPath.fill);
                    _graphics.setStrokeBrush(vgxPath.stroke);
                    _self.strokeWidth = vgxPath.strokeWidth;
                    _graphics.setShadow(vgxPath.shadow);
                    var listPath2D = vgxPath.figures;
                    for (var i = 0; i < listPath2D.length; i++) {
                        _graphics.drawPath2D(vgxPath.insertPointX, vgxPath.insertPointY, listPath2D[i], vgxPath.fillRule, vgxPath.transform);
                    }
                }
            });

            Object.defineProperty(this, "drawPie", {
                value: function (vgxPie) {
                    _graphics.setFillBrush(vgxPie.fill);
                    _graphics.setStrokeBrush(vgxPie.stroke);
                    _self.strokeWidth = vgxPie.strokeWidth;
                    _graphics.setShadow(vgxPie.shadow);
                    _graphics.drawPie(vgxPie.insertPointX, vgxPie.insertPointY, vgxPie.radius, vgxPie.startAngleRad, vgxPie.endAngleRad, vgxPie.isAntiClockwise, vgxPie.transform);
                }
            });

            Object.defineProperty(this, "drawDonut", {
                value: function (vgxDonut) {
                    _graphics.setFillBrush(vgxDonut.fill);
                    _graphics.setStrokeBrush(vgxDonut.stroke);
                    _self.strokeWidth = vgxDonut.strokeWidth;
                    _graphics.setShadow(vgxDonut.shadow);
                    _graphics.drawDonut(vgxDonut.insertPointX, vgxDonut.insertPointY, vgxDonut.startRadius, vgxDonut.endRadius, vgxDonut.startAngleRad, vgxDonut.endAngleRad, vgxDonut.isAntiClockwise, vgxDonut.transform);
                }
            });

            Object.defineProperty(this, "drawGroup", {
                value: function (vgxGroup) {
                    //_graphics.setFillBrush(vgxGroup.fill);
                    //_graphics.setStrokeBrush(vgxGroup.stroke);
                    //_self.strokeWidth = vgxGroup.strokeWidth;
                    //_graphics.setShadow(vgxGroup.shadow);
                    //vgxGroup.children.forEach(function (v, i, o) {
                    //    v.draw(drawingContext);
                    //})
                    //var listPath2D = vgxPath._getInternalPaths();
                    //for (var i = 0; i < listPath2D.length; i++) {
                    //    _graphics.drawPath2D(vgxPath.insertPointX, vgxPath.insertPointX, listPath2D[i], vgxPath.optFillRule, vgxPath.optTransform);
                    //}

                    _self.strokeWidth = vgxGroup.strokeWidth;
                    _graphics.setStrokeBrush(vgxGroup.stroke);
                    _graphics.setFillBrush(vgxGroup.fill);
                    _graphics.setShadow(vgxGroup.shadow);

                    var t = new lib.Cgx.Transform();
                    t.translationX = vgxGroup.insertPointX;
                    t.translationY = vgxGroup.insertPointY;
                    _graphics.pushTransform(t);
                    vgxGroup.children.forEach(function (v, i, o) {
                        v.draw(_self);
                    });
                    _graphics.popTransform();
                }
            });

            //var _pointTransform = new lib.Cgx.Transform();
            //Object.defineProperty(this, "drawPoint", {
            //    value: function (vgxPoint) {

            //        _graphics.setFillBrush(null);
            //        _graphics.setStrokeBrush(vgxPoint.stroke);
            //        _self.strokeWidth = vgxPoint.strokeWidth / lib.Vgx.Vars.pointSize;
            //        _graphics.setShadow(vgxPoint.shadow);

            //        var pointType = lib.Vgx.Vars.pointType;
            //        if (vgxPoint.pointType != null && vgxPoint.pointType != "") {
            //            if (vgxPoint.pointType in lib.Vgx.PointDefinitions) {
            //                pointType = lib.Vgx.PointDefinitions[vgxPoint.pointType];
            //            }
            //        }

            //        _pointTransform.scaleX = _pointTransform.scaleY = lib.Vgx.Vars.pointSize;

            //        var translation = lib.Vgx.Vars.pointSize * 0.5;
            //        var pointPath = pointType._getPath();
            //        var listPath2D = pointPath.figures;
            //        for (var i = 0; i < listPath2D.length; i++) {
            //            _graphics.drawPath2D(vgxPoint.insertPointX, vgxPoint.insertPointY, listPath2D[i], pointPath.fillRule, _pointTransform);
            //        }
            //    }
            //});


            Object.defineProperty(this, "drawAxes", {
                value: function () {
                    var localOrigin = _viewTransform.globalToLocalPoint(0, 0);
                    _graphics.setStrokeWidth(1);
                    _graphics.setStrokeBrush("rgba(255,0,0,0.5)");
                    _graphics.drawLine(0, localOrigin.y, _canvas.width, localOrigin.y);
                    _graphics.setStrokeBrush("rgba(0,255,0,0.5)");
                    _graphics.drawLine(localOrigin.x, 0, localOrigin.x, _canvas.height);
                }
            });

            Object.defineProperty(this, "drawSymbol", {
                value: function (x, y, symbolData) { _graphics.drawSymbol(x, y, symbolData); }
            });

            //Object.defineProperty(this, "drawVertex", {
            //    value: function (x, y, optTransform, optTransformOriginX, optTransformOriginY) {
            //        _graphics.drawVertex(x, y, optTransform, optTransformOriginX, optTransformOriginY);
            //    }
            //});

            //Object.defineProperty(this, "drawVertices", {
            //    value: function (points, optTransform, optTransformOriginX, optTransformOriginY) {
            //        _graphics.drawVertices(points, optTransform, optTransformOriginX, optTransformOriginY);
            //    }
            //});




            Object.defineProperty(this, "measureText", {
                value: function (text) { return _graphics.measureText(text); }
            });



            Object.defineProperty(this, "pushTransform", {
                value: function (transform) {
                    _graphics.pushTransform(transform);
                }
            });

            //Object.defineProperty(this, "getTransform", {
            //    value: function () {
            //        return _graphics.getTransform();
            //    }
            //});

            Object.defineProperty(this, "popTransform", {
                value: function () {
                    return _graphics.popTransform();
                }
            });


            _init();
        }

        return DrawingContext;

    })();
    lib.Vgx.DrawingContext = DrawingContext;

})(library);

/// <reference path="../Cgx/Engine.js" />

(function (lib) {

    var TextUtils = (function () {

        var TextUtils = {};

        var _canvasBuffer = lib.Cgx.Engine.createCanvasBuffer(1, 1);
        var _context = _canvasBuffer.getContext("2d");


        function estimateFontHeight() {

            if (TextUtils.fastHeightEstimation) {
                return measureTextWidth("M");
            }
            else {
                throw new Error("not implemented");
            }
        };

        function measureTextWidth(text) {
            return _context.measureText(text).width;
        }


        Object.defineProperty(TextUtils, "measureText", {
            value: function (text, fontFamily, fontSize) {
                _context.font = fontSize + "px " + fontFamily;
                return {
                    width: measureTextWidth(text),
                    height: estimateFontHeight()
                };
            }
        });

        Object.defineProperty(TextUtils, "fastHeightEstimation", {
            value: true,
            writable: true
        });


        return TextUtils;
    })();
    lib.Vgx.TextUtils = TextUtils;

})(library);
/// <reference path="PointDefinition.js" />
/// <reference path="DrawingContext.js" />

(function (lib) {

    var Vars = (function () {

        var Vars = {};

        var _pointType = lib.Vgx.PointDefinitions.type1;
        var _pointSize = 20;

        var _fontFamily = "Arial";
        var _fontSize = 16;

        var _vertexSize = 4;
        var _vertexFill = "#ddeeff";
        var _vertexStroke = "#8888ff";
        var _vertexStrokeWidth = 1.3;


        Object.defineProperty(Vars, "defaultStrokeStyle", {
            value: "transparent",
            writable: true
        });

        Object.defineProperty(Vars, "defaultStrokeWidth", {
            value: 0,
            writable: true
        });

        Object.defineProperty(Vars, "defaultFillStyle", {
            value: 0xffffff,
            writable: true
        });

        Object.defineProperty(Vars, "pointType", {
            get: function () { return _pointType; },
            set: function (v) {
                if (!(v instanceof lib.Vgx.PointDefinition))
                    return;
                _pointType = v;
            }
        });

        Object.defineProperty(Vars, "pointSize", {
            get: function () { return _pointSize; },
            set: function (v) {
                if (!v || typeof v !== "number")
                    return;
                _pointSize = v;
            }
        });

        Object.defineProperty(Vars, "fontFamily", {
            get: function () { return _fontFamily; },
            set: function (v) {
                if (!v || typeof v !== "string")
                    return;
                _fontFamily = v;
            }
        });

        Object.defineProperty(Vars, "fontSize", {
            get: function () { return _fontSize; },
            set: function (v) {
                if (!v || typeof v !== "number")
                    return;
                _fontSize = v;
            }
        });

        Object.defineProperty(Vars, "vertexSize", {
            get: function () { return _vertexSize; },
            set: function (v) {
                if (!v || typeof v !== "number")
                    return;
                _vertexSize = v;
            }
        });

        Object.defineProperty(Vars, "vertexFillColor", {
            get: function () { return _vertexFill; },
            set: function (v) {
                var valueType = typeof v;
                if (valueType !== "string" && valueType !== "number" && !(v instanceof Brush))
                    return;
                _vertexFill = v;
            }
        });

        Object.defineProperty(Vars, "vertexStrokeColor", {
            get: function () { return _vertexStroke; },
            set: function (v) {
                var valueType = typeof v;
                if (valueType !== "string" && valueType !== "number" && !(v instanceof Brush))
                    return;
                _vertexStroke = v;
            }
        });

        Object.defineProperty(Vars, "vertexStrokeWidth", {
            get: function () { return _vertexStrokeWidth; },
            set: function (v) {
                var valueType = typeof v;
                if (valueType !== "number")
                    return;
                _vertexStrokeWidth = v;
            }
        });

        return Vars;
    })();
    lib.Vgx.Vars = Vars;

})(library);

(function (lib) {

    var DrawingLoader = (function () {

        function DrawingLoader() {

            this.loadChildElement = function (child) {

                var typeName = child[0];
                var type = Vgx[typeName];

                if (typeof type !== "function")
                    throw new Error("invalid type name '" + typeName + "'");

                // TODO: migliorare il check
                var instance = new type();
                if (instance == null)
                    throw new Error("invalid type name '" + typeName + "'");

                var childInfo = child[1];
                for (var n in childInfo) {
                    if (!childInfo.hasOwnProperty(n))
                        continue;
                    if (n in instance) {
                        instance[n] = childInfo[n];
                    }
                }

                switch (typeName) {
                    case "Polyline":
                    case "Polygon":
                        if ("points" in childInfo) {
                            for (var p = 0; p < childInfo.points.length; p++) {
                                instance.points.add(childInfo.points[p]);
                            }
                        }
                        break;
                    case "QuadraticCurve":
                        if ("points" in childInfo) {
                            for (var p = 0; p < childInfo.points.length; p++) {
                                instance.points.add(childInfo.points[p]);
                            }
                        }
                        if ("controlPoints" in childInfo) {
                            for (var p = 0; p < childInfo.controlPoints.length; p++) {
                                instance.controlPoints.add(childInfo.controlPoints[p]);
                            }
                        }
                        break;
                    case "CubicCurve":
                        if ("points" in childInfo) {
                            for (var p = 0; p < childInfo.points.length; p++) {
                                instance.points.add(childInfo.points[p]);
                            }
                        }
                        if ("controlPoints1" in childInfo) {
                            for (var p = 0; p < childInfo.controlPoints1.length; p++) {
                                instance.controlPoints1.add(childInfo.controlPoints1[p]);
                            }
                        }
                        if ("controlPoints2" in childInfo) {
                            for (var p = 0; p < childInfo.controlPoints2.length; p++) {
                                instance.controlPoints2.add(childInfo.controlPoints2[p]);
                            }
                        }
                        break;
                    case "Group":
                        if ("children" in childInfo) {
                            for (var c = 0; c < childInfo.children.length; c++) {
                                var childElement = this.loadChildElement(childInfo.children[c]);
                                if (childElement != null)
                                    instance.children.add(childElement);
                            }
                        }
                        break;
                    case "Path":
                        if ("figures" in childInfo) {
                            for (var f = 0; f < childInfo.figures.length; f++) {
                                var figure = childInfo.figures[f];
                                switch (figure.type) {
                                    case "arc":
                                        instance.addArc(figure.insertPointX, figure.insertPointY, figure.radius, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
                                        break;
                                    case "rect":
                                        instance.addRect(figure.insertPointX, figure.insertPointY, figure.width, figure.height);
                                        break;
                                    case "ellipse":
                                        instance.addRect(figure.insertPointX, figure.insertPointY, figure.radiusX, figure.radiusY, figure.rotation || 0, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
                                        break;
                                    case "path":
                                        instance.addFigure(figure.data);
                                        break;
                                }
                            }
                        }
                        break;
                }

                return instance;
            }

            this.loadFromObject = function (jdrawing) {

                if (!("children" in jdrawing))
                    throw new Error("missing 'children' element");

                var drawing = new lib.Vgx.Drawing();

                for (var i = 0; i < jdrawing.children.length; i++) {

                    var child = jdrawing.children[i];
                    var instance = this.loadChildElement(child);
                    drawing.addChild(instance);
                }

                if ("background" in jdrawing) {
                    drawing.background = jdrawing["background"];
                }

                return drawing;
            }
        }

        return new DrawingLoader();
    })();
    lib.Vgx.DrawingLoader = DrawingLoader;

})(library);

(function (lib) {

    var IFillable = (function () {

        function IFillable() {

            var _self = this;
            var _fill = lib.Vgx.Vars.defaultFillStyle;

            Object.defineProperty(this, "fill", {
                get: function () { return _fill; },
                set: function (v) {
                    if (_fill != v) {
                        _fill = v;
                        _self.appearanceDirty = true;
                    }
                }
            });
        }

        return IFillable;

    })();
    lib.Vgx.IFillable = IFillable;

})(library);

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
/// <reference path="Object.js" />

(function (lib) {

    var Drawable = (function () {

        function Drawable() {
            lib.Vgx.VgxObject.call(this);

            var _self = this;
            var _visible = true;
            var _appearanceDirty = true;
            var _geometryDirty = true;
            var _positionDirty = true;


            //Object.defineProperty(this, "_addedToDrawing", {
            //    value: function () {
            //        if (_appearanceDirty || _geometryDirty || _positionDirty) {
            //            _self.drawing.isDirty = true;
            //        }
            //    },
            //    configurable: true,
            //    enumerable: false
            //});



            Object.defineProperty(this, "appearanceDirty", {
                get: function () { return _appearanceDirty; },
                set: function (v) {
                    v = !!v;
                    _appearanceDirty = v;
                    if (v && _self.drawing)
                        _self.drawing.isDirty = true;
                }
            });

            Object.defineProperty(this, "geometryDirty", {
                get: function () { return _geometryDirty; },
                set: function (v) {
                    v = !!v;
                    _geometryDirty = v;
                    if (v && _self.drawing)
                        _self.drawing.isDirty = true;
                }
            });

            Object.defineProperty(this, "positionDirty", {
                get: function () { return _positionDirty; },
                set: function (v) {
                    v = !!v;
                    _positionDirty = v;
                    if (v && _self.drawing)
                        _self.drawing.isDirty = true;
                }
            });

            Object.defineProperty(this, "visible", {
                get: function () { return _visible; },
                set: function (v) {
                    if (_visible != v) {
                        _visible = v;
                        _self.appearanceDirty = true;
                        if (_self.drawing)
                            _self.drawing.isDirty = true;
                    }
                }
            });

            // @virtual
            Object.defineProperty(this, "draw", {
                configurable: true,
                value: function (drawingContext) { }
            });
        }

        Drawable.prototype = Object.create(lib.Vgx.VgxObject.prototype);
        Drawable.prototype.constructor = Drawable;

        return Drawable;
    })();
    lib.Vgx.Drawable = Drawable;

})(library);

/// <reference path="../Shadow.js" />
/// <reference path="../EntityTransform.js" />
/// <reference path="Drawable.js" />

(function (lib) {

    var Entity = (function () {

        function Entity() {
            lib.Vgx.Drawable.call(this);

            var _self = this;
            var _insertPointX = 0;
            var _insertPointY = 0;
            var _stroke = lib.Vgx.Vars.defaultStrokeStyle;
            var _strokeWidth = lib.Vgx.Vars.defaultStrokeWidth;
            var _shadow = new lib.Vgx.Shadow();
            _shadow.onPropertyChanged.addHandler(function (p) { _self.appearanceDirty = true; }, {});
            var _transform = new lib.Vgx.EntityTransform(this);
            var _cachedBounds = new lib.Vgx.Rect();


            // @abstract
            Object.defineProperty(this, "_getPath", {
                configurable: true,
                value: null
            });

            // @virtual
            Object.defineProperty(this, "_getVertices", {
                configurable: true,
                value: function () {
                    return [{
                        x: _self._getValue("insertPointX", _insertPointX),
                        y: _self._getValue("insertPointY", _insertPointY)
                    }];
                }
            });

            // @virtual
            Object.defineProperty(this, "_getBounds", {
                configurable: true,
                value: function () {
                    return lib.Vgx.Rect.empty;
                }
            });



            // @virtual
            Object.defineProperty(this, "insertPointX", {
                configurable: true,
                get: function () { return _self._getValue("insertPointX", _insertPointX); },
                set: function (v) {
                    if (_insertPointX != v) {
                        _insertPointX = v;
                        _self.positionDirty = true;
                    }
                }
            });

            // @virtual
            Object.defineProperty(this, "insertPointY", {
                configurable: true,
                get: function () { return _self._getValue("insertPointY", _insertPointY); },
                set: function (v) {
                    if (_insertPointY != v) {
                        _insertPointY = v;
                        _self.positionDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "stroke", {
                get: function () { return _self._getValue("stroke", _stroke); },
                set: function (v) {
                    if (_stroke != v) {
                        _stroke = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "strokeWidth", {
                get: function () { return _self._getValue("strokeWidth", _strokeWidth); },
                set: function (v) {
                    if (_strokeWidth != v) {
                        _strokeWidth = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "shadow", {
                get: function () { return _shadow; }
            });


            Object.defineProperty(this, "getBounds", {
                value: function () {
                    if (_self.geometryDirty) {
                        var bounds = _self._getBounds();
                        if (!_transform.isIdentity) {
                            var mtx = _self.transform.getMatrix().clone();
                            mtx.offsetX = -(_self.insertPointX + _self.transform.originX);
                            mtx.offsetY = -(_self.insertPointY + _self.transform.originY);
                            _cachedBounds = mtx.transformRect(bounds.x, bounds.y, bounds.width, bounds.height);
                        }
                        else {
                            _cachedBounds = bounds;
                        }
                    }
                    return _cachedBounds;
                }
            });

            Object.defineProperty(this, "transform", {
                get: function () { return _transform; },
                set: function (v) {
                    if (v instanceof lib.Cgx.Transform) {
                        _transform.translationX = v.translationX;
                        _transform.translationY = v.translationY;
                        _transform.scaleX = v.scaleX;
                        _transform.scaleY = v.scaleY;
                        _transform.rotation = v.rotation;
                        _transform.originX = v.originX;
                        _transform.originY = v.originY;
                    }
                }
            });

        }

        Entity.prototype = Object.create(lib.Vgx.Drawable.prototype);
        Entity.prototype.constructor = Entity;

        return Entity;
    })();
    lib.Vgx.Entity = Entity;

})(library);
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

(function (lib) {

    var IFillable = (function () {

        function IFillable() {

            var _self = this;
            var _fill = lib.Vgx.Vars.defaultFillStyle;

            Object.defineProperty(this, "fill", {
                get: function () { return _fill; },
                set: function (v) {
                    if (_fill != v) {
                        _fill = v;
                        _self.appearanceDirty = true;
                    }
                }
            });
        }

        return IFillable;

    })();
    lib.Vgx.IFillable = IFillable;

})(library);
/// <reference path="Entity.js" />

(function (lib) {

    var Arc = (function () {

        function Arc() {
            lib.Vgx.Entity.call(this);

            var _degToRad = 0.017453292519943295;

            var _self = this;
            var _radius = 0;
            var _startAngle = 0;
            var _endAngle = 0;
            var _startAngleRad = 0;
            var _endAngleRad = 0;
            var _isAntiClockwise = false;


            Object.defineProperty(this, "radius", {
                get: function () { return _radius; },
                set: function (v) {
                    if (_radius != v) {
                        _radius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "startAngle", {
                get: function () { return _startAngle; },
                set: function (v) {
                    if (_startAngle != v) {
                        _startAngle = v;
                        _startAngleRad = v * _degToRad;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "startAngleRad", {
                get: function () { return _startAngleRad; }
            });

            Object.defineProperty(this, "endAngle", {
                get: function () { return _endAngle; },
                set: function (v) {
                    if (_endAngle != v) {
                        _endAngle = v;
                        _endAngleRad = v * _degToRad;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "endAngleRad", {
                get: function () { return _endAngleRad; }
            });

            Object.defineProperty(this, "isAntiClockwise", {
                get: function () { return _isAntiClockwise; },
                set: function (v) {
                    if (_isAntiClockwise != v) {
                        _isAntiClockwise = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            //var boundsRect = new lib.Vgx.Rectangle();
            //boundsRect.stroke = "magenta";
            //boundsRect.strokeWidth = 2;
            //boundsRect.fill = null;

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawArc(_self);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, 0, -_self.radius));
                    //drawingContext.drawVertex(_self.insertPoint);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, _self.radius, 0));

                    //var bounds = _self.getBounds();
                    //boundsRect.insertPointX = bounds.x;
                    //boundsRect.insertPointY = bounds.y;
                    //boundsRect.width = bounds.width;
                    //boundsRect.height = bounds.height;
                    //drawingContext.drawRectangle(boundsRect);
                }
            });

            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    // TODO
                    var xsa = Math.cos(_startAngleRad) * _radius;
                    var ysa = Math.sin(_startAngleRad) * _radius;
                    var xea = Math.cos(_endAngleRad) * _radius;
                    var yea = Math.sin(_endAngleRad) * _radius;
                    var x1 = Math.min(xsa, xea);
                    var y1 = Math.min(ysa, yea);
                    var x2 = Math.max(xsa, xea);
                    var y2 = Math.max(ysa, yea);
                    return new lib.Vgx.Rect(_self.insertPointX + x1, _self.insertPointY + y1, x2 - x1, y2 - y1);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        // TODO
            //        var xsa = Math.cos(_startAngleRad) * _radius;
            //        var ysa = Math.sin(_startAngleRad) * _radius;
            //        var xea = Math.cos(_endAngleRad) * _radius;
            //        var yea = Math.sin(_endAngleRad) * _radius;

            //        var x1 = Math.min(xsa, xea);
            //        var y1 = Math.min(ysa, yea);
            //        var x2 = Math.max(xsa, xea);
            //        var y2 = Math.max(ysa, yea);

            //        return new lib.Vgx.Rect(_self.insertPointX + x1, _self.insertPointY + y1, x2 - x1, y2 - y1);
            //    }
            //});
        }

        Arc.prototype = Object.create(lib.Vgx.Entity.prototype);
        Arc.prototype.constructor = Arc;

        return Arc;
    })();
    lib.Vgx.Arc = Arc;

})(library);
/// <reference path="Entity.js" />

(function (lib) {

    var Circle = (function () {

        function Circle() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _radius = 0;

            Object.defineProperty(this, "radius", {
                get: function () { return _radius; },
                set: function (v) {
                    if (_radius != v) {
                        _radius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawCircle(_self);
                    //drawingContext.drawVertex(_self.insertPointX, _self.insertPointY, _self.transform);
                }
            });

            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var x = _self.insertPointX - _radius;
                    var y = _self.insertPointY - _radius;
                    var w = _radius * 2;
                    var h = _radius * 2;
                    return new lib.Vgx.Rect(x, y, w, h);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var x = _self.insertPointX - _radius;
            //        var y = _self.insertPointY - _radius;
            //        var w = _radius * 2;
            //        var h = _radius * 2;
            //        return new lib.Vgx.Rect(x, y, w, h);
            //    }
            //});
        }

        Circle.prototype = Object.create(lib.Vgx.Entity.prototype);
        Circle.prototype.constructor = Circle;

        return Circle;
    })();
    lib.Vgx.Circle = Circle;

})(library);

/// <reference path="../../Extra/Collection.js" />
/// <reference path="../MathUtils.js" />
/// <reference path="Entity.js" />


(function (lib) {

    var CubicCurve = (function () {

        function CubicCurve() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _points = new lib.Extra.Collection();
            var _controlsPoints1 = new lib.Extra.Collection();
            var _controlsPoints2 = new lib.Extra.Collection();
            var _isClosed = false;

            // @override @sealed
            //Object.defineProperty(this, "insertPoint", {
            //    configurable: false,
            //    get: function () { return _points.at(0); },
            //    set: function (v) {
            //        var firstPoint = _points.at(0);
            //        var dx = v.x - firstPoint.x;
            //        var dy = v.y - firstPoint.y;
            //        _points.forEach(function (v, i, a) {
            //            v.x += dx;
            //            v.y += dy;
            //        });
            //        _controlsPoints1.forEach(function (v, i, a) {
            //            v.x += dx;
            //            v.y += dy;
            //        });
            //        _controlsPoints2.forEach(function (v, i, a) {
            //            v.x += dx;
            //            v.y += dy;
            //        });
            //    }
            //});
            Object.defineProperty(this, "insertPointX", {
                configurable: false,
                get: function () { return _points.length > 0 ? _points.at(0).x : 0; },
                set: function (v) {
                    var firstPoint = _points.at(0);
                    var dx = v - firstPoint.x;
                    _points.forEach(function (p, i, a) {
                        p.x += dx;
                    });
                    _controlsPoints1.forEach(function (p, i, a) {
                        p.x += dx;
                    });
                    _controlsPoints2.forEach(function (p, i, a) {
                        p.x += dx;
                    });
                }
            });
            Object.defineProperty(this, "insertPointY", {
                configurable: false,
                get: function () { return _points.length > 0 ? _points.at(0).y : 0; },
                set: function (v) {
                    var firstPoint = _points.at(0);
                    var dy = v - firstPoint.y;
                    _points.forEach(function (p, i, a) {
                        p.y += dy;
                    });
                    _controlsPoints1.forEach(function (p, i, a) {
                        p.y += dy;
                    });
                    _controlsPoints2.forEach(function (p, i, a) {
                        p.y += dy;
                    });
                }
            });


            Object.defineProperty(this, "points", {
                get: function () { return _points; }
            });

            Object.defineProperty(this, "controlPoints1", {
                get: function () { return _controlsPoints1; }
            });

            Object.defineProperty(this, "controlPoints2", {
                get: function () { return _controlsPoints2; }
            });

            Object.defineProperty(this, "isClosed", {
                get: function () { return _isClosed; },
                set: function (v) {
                    v = !!v;
                    if (_isClosed != v) {
                        _isClosed = v;
                        _self.geometryDirty = true;
                    }
                }
            });


            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawCubicCurve(_self);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var allBoundsPoints = new Array();
                    allBoundsPoints.concat(_points.toArray());
                    allBoundsPoints.concat(_controlsPoints1.toArray());
                    allBoundsPoints.concat(_controlsPoints2.toArray());
                    return lib.Vgx.MathUtils.getPointsBounds(allBoundsPoints);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var allBoundsPoints = new Array();
            //        allBoundsPoints.concat(_controlsPoints1.toArray());
            //        allBoundsPoints.concat(_controlsPoints2.toArray());
            //        return lib.Vgx.MathUtils.getPointsBounds(allBoundsPoints);
            //    }
            //});
        }

        CubicCurve.prototype = Object.create(lib.Vgx.Entity.prototype);
        CubicCurve.prototype.constructor = CubicCurve;

        Object.defineProperty(CubicCurve, "fromPoints", {
            value: function (points, isClosed) {
                var cubicCurveSegments = lib.Vgx.MathUtils.interpolatePointWithCubicCurves(points, isClosed);
                var result = new CubicCurve();
                result.points.add(points[0]);
                for (var i = 0; i < cubicCurveSegments.length; i++) {
                    var segment = cubicCurveSegments[i];
                    result.controlPoints1.add(segment.firstControlPoint);
                    result.controlPoints2.add(segment.secondControlPoint);
                    result.points.add(segment.endPoint);
                }
                return result;
            }
        });

        return CubicCurve;
    })();
    lib.Vgx.CubicCurve = CubicCurve;

})(library);
/// <reference path="Entity.js" />

(function (lib) {

    var Donut = (function () {

        function Donut() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _degToRad = 0.017453292519943295;

            var _self = this;
            var _startRadius = 0;
            var _endRadius = 0;
            var _startAngle = 0;
            var _endAngle = 0;
            var _startAngleRad = 0;
            var _endAngleRad = 0;
            var _isAntiClockwise = false;


            Object.defineProperty(this, "startRadius", {
                get: function () { return _startRadius; },
                set: function (v) {
                    if (_startRadius != v) {
                        _startRadius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "endRadius", {
                get: function () { return _endRadius; },
                set: function (v) {
                    if (_endRadius != v) {
                        _endRadius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "startAngle", {
                get: function () { return _startAngle; },
                set: function (v) {
                    if (_startAngle != v) {
                        _startAngle = v;
                        _startAngleRad = v * _degToRad;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "startAngleRad", {
                get: function () { return _startAngleRad; }
            });

            Object.defineProperty(this, "endAngle", {
                get: function () { return _endAngle; },
                set: function (v) {
                    if (_endAngle != v) {
                        _endAngle = v;
                        _endAngleRad = v * _degToRad;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "endAngleRad", {
                get: function () { return _endAngleRad; }
            });

            Object.defineProperty(this, "isAntiClockwise", {
                get: function () { return _isAntiClockwise; },
                set: function (v) {
                    if (_isAntiClockwise != v) {
                        _isAntiClockwise = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawDonut(_self);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, 0, -_self.radius));
                    //drawingContext.drawVertex(_self.insertPoint);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, _self.radius, 0));

                    //var bounds = _self.getBounds();
                    //boundsRect.insertPointX = bounds.x;
                    //boundsRect.insertPointY = bounds.y;
                    //boundsRect.width = bounds.width;
                    //boundsRect.height = bounds.height;
                    //drawingContext.drawRectangle(boundsRect);
                }
            });

            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    // TODO
                    var xsa = Math.cos(_startAngleRad) * _endRadius;
                    var ysa = Math.sin(_startAngleRad) * _endRadius;
                    var xea = Math.cos(_endAngleRad) * _endRadius;
                    var yea = Math.sin(_endAngleRad) * _endRadius;
                    var x1 = Math.min(xsa, xea);
                    var y1 = Math.min(ysa, yea);
                    var x2 = Math.max(xsa, xea);
                    var y2 = Math.max(ysa, yea);
                    return new lib.Vgx.Rect(_self.insertPointX + x1, _self.insertPointY + y1, x2 - x1, y2 - y1);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        // TODO
            //        var xsa = Math.cos(_startAngleRad) * _radius;
            //        var ysa = Math.sin(_startAngleRad) * _radius;
            //        var xea = Math.cos(_endAngleRad) * _radius;
            //        var yea = Math.sin(_endAngleRad) * _radius;

            //        var x1 = Math.min(xsa, xea);
            //        var y1 = Math.min(ysa, yea);
            //        var x2 = Math.max(xsa, xea);
            //        var y2 = Math.max(ysa, yea);

            //        return new lib.Vgx.Rect(_self.insertPointX + x1, _self.insertPointY + y1, x2 - x1, y2 - y1);
            //    }
            //});
        }

        Donut.prototype = Object.create(lib.Vgx.Entity.prototype);
        Donut.prototype.constructor = Donut;

        return Donut;
    })();
    lib.Vgx.Donut = Donut;

})(library);
/// <reference path="Entity.js" />

(function (lib) {

    var Ellipse = (function () {

        function Ellipse() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _xRadius = 0;
            var _yRadius = 0;

            Object.defineProperty(this, "xRadius", {
                get: function () { return _xRadius; },
                set: function (v) {
                    if (_xRadius != v) {
                        _xRadius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "yRadius", {
                get: function () { return _yRadius; },
                set: function (v) {
                    if (_yRadius != v) {
                        _yRadius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawEllipse(_self);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, 0, -_self.yRadius));
                    //drawingContext.drawVertex(_self.insertPoint);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, _self.xRadius, 0));
                }
            });

            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var x = _self.insertPointX - _xRadius;
                    var y = _self.insertPointY - _yRadius;
                    var w = _xRadius * 2;
                    var h = _yRadius * 2;
                    return new lib.Vgx.Rect(x, y, w, h);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var x = _self.insertPointX - _xRadius;
            //        var y = _self.insertPointY - _yRadius;
            //        var w = _xRadius * 2;
            //        var h = _yRadius * 2;
            //        return new lib.Vgx.Rect(x, y, w, h);
            //    }
            //});
        }

        Ellipse.prototype = Object.create(lib.Vgx.Entity.prototype);
        Ellipse.prototype.constructor = Ellipse;

        return Ellipse;
    })();
    lib.Vgx.Ellipse = Ellipse;

})(library);

(function (lib) {

    var Group = (function () {

        function Group() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _children;
            

            function _init() {
                _children = new lib.Extra.Collection();
                _children.onItemsAdded.addHandler(function (s, e) {
                    _self.geometryDirty = true;
                });
                _children.onItemsRemoved.addHandler(function (s, e) {
                    _self.geometryDirty = true;
                });
                _children.onCollectionCleared.addHandler(function (s, e) {
                    _self.geometryDirty = true;
                });
            }


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var result = new lib.Vgx.Rect();
                    _children.forEach(function (v, i, o) {
                        result.union(v.getBounds());
                    });
                    result.x += _self.insertPointX;
                    result.y += _self.insertPointY;
                    return result
                }
            });


            Object.defineProperty(this, "children", {
                get: function () { return _children; }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawGroup(_self);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var result = new lib.Vgx.Rect();
            //        _children.forEach(function (v, i, o) {
            //            console.log(v.constructor.name);
            //            result.union(v.getBounds());
            //        });
            //        result = _self.transform.transformRect(result.x, result.y, result.width, result.height);
            //        result.x = _self.insertPointX;
            //        result.y = _self.insertPointY;
            //        return result;
            //    }
            //});


            _init();
        }

        Group.prototype = Object.create(lib.Vgx.Entity.prototype);
        Group.prototype.constructor = Group;

        return Group;

    })();
    lib.Vgx.Group = Group;

})(library);
/// <reference path="Entity.js" />

(function (lib) {

    var Image = (function () {
        function Image() {
            lib.Vgx.Entity.call(this);

            var _self = this;
            var _width = 0;
            var _height = 0;
            var _src = null;
            var _img = null;


            function init() {
                _img = new window.Image();
                _img.onload = onImageLoad;
            }


            function onImageLoad(e) {
                computeDimensions();
                _self.appearanceDirty = true;
                if (_self.drawing)
                    _self.drawing.isDirty = true;
            }

            function computeDimensions() {
                if (_width <= 0 && _height <= 0) {
                    // use natural size
                    _width = _img.naturalWidth;
                    _height = _img.naturalHeight;
                }
                else {
                    var aspect = _img.naturalHeight / _img.naturalWidth;
                    if (_width <= 0) {
                        _width = _height / aspect;
                    }
                    else if (_height <= 0) {
                        _height = _width * aspect;
                    }
                }
            }

            Object.defineProperty(this, "width", {
                get: function () { return _width; },
                set: function (v) {
                    if (_width != v) {
                        _width = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "height", {
                get: function () { return _height; },
                set: function (v) {
                    if (_height != v) {
                        _height = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "src", {
                get: function () { return _src; },
                set: function (v) {
                    if (_src != v) {
                        var oldValue = _src;
                        _src = v;
                        _img.src = _src;
                    }
                }
            });

            Object.defineProperty(this, "image", {
                get: function () { return _img; }
            });


            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawImage(_self);
                    //drawingContext.drawVertex(_self.insertPoint);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, _self.width, _self.height));
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY, _self.width, _self.height);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY, _self.width, _self.height);
            //    }
            //});


            // ctor
            init();
        }

        Image.prototype = Object.create(lib.Vgx.Entity.prototype);
        Image.prototype.constructor = Image;

        return Image;
    })();
    lib.Vgx.Image = Image;

})(library);
/// <reference path="Entity.js" />

(function (lib) {

    var Line = (function () {
        function Line() {
            lib.Vgx.Entity.call(this);

            var _self = this;
            var _startPoint = { x: 0, y: 0 };
            var _endPoint = { x: 0, y: 0 };
            var _path = null;


            // @override
            Object.defineProperty(this, "_getPath", {
                configurable: false,
                value: function () {
                    if (_path == null || _self.geometryDirty) {
                        _path = new Path2D();
                        _path.moveTo(0, 0);
                        _path.lineTo(_self.endPoint.x - _self.insertPoint.x, _self.endPoint.y - _self.insertPoint.y);
                    }
                    return _path;
                }
            });

            // @override
            Object.defineProperty(this, "_getVertices", {
                configurable: false,
                value: function () {
                    return [
                        _self.insertPoint,
                        _self.endPoint
                    ]
                }
            });

            // @override @sealed
            //Object.defineProperty(this, "insertPoint", {
            //    configurable: false,
            //    get: function () { return _startPoint; },
            //    set: function (v) {
            //        var dx = v.x - _startPoint.x;
            //        var dy = v.y - _startPoint.y;
            //        _startPoint.x = v.x;
            //        _startPoint.y = v.y;
            //        _endPoint.x += dx;
            //        _endPoint.y += dy;
            //    }
            //});
            Object.defineProperty(this, "insertPointX", {
                configurable: false,
                get: function () { return _startPoint.x; },
                set: function (v) {
                    var dx = v - _startPoint.x;
                    _startPoint.x = v;
                    _endPoint.x += dx;
                }
            });
            Object.defineProperty(this, "insertPointY", {
                configurable: false,
                get: function () { return _startPoint.y; },
                set: function (v) {
                    var dy = v - _startPoint.y;
                    _startPoint.y = v;
                    _endPoint.y += dy;
                }
            });

            Object.defineProperty(this, "startPoint", {
                get: function () { return _startPoint; },
                set: function (v) {
                    if (_startPoint != v) {
                        _startPoint = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "endPoint", {
                get: function () { return _endPoint; },
                set: function (v) {
                    if (_endPoint != v) {
                        _endPoint = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawLine(_self);
                    //drawingContext.drawVertices([_self.startPoint, _self.endPoint], _self.transform, _self.startPoint.x, _self.startPoint.y);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var minX = Math.min(_self.startPoint.x, _self.endPoint.x);
                    var minY = Math.min(_self.startPoint.y, _self.endPoint.y);
                    var maxX = Math.max(_self.startPoint.x, _self.endPoint.x);
                    var maxY = Math.max(_self.startPoint.y, _self.endPoint.y);
                    return new lib.Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var minX = Math.min(_self.startPoint.x, _self.endPoint.x);
            //        var minY = Math.min(_self.startPoint.y, _self.endPoint.y);
            //        var maxX = Math.max(_self.startPoint.x, _self.endPoint.x);
            //        var maxY = Math.max(_self.startPoint.y, _self.endPoint.y);
            //        return new lib.Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
            //    }
            //});
        }

        Line.prototype = Object.create(lib.Vgx.Entity.prototype);
        Line.prototype.constructor = Line;

        return Line;
    })();
    lib.Vgx.Line = Line;

})(library);


//var VgxPathCommand;
//(function (VgxPathCommand) {
//    VgxPathCommand[VgxPathCommand["MOVE_TO"] = 1] = "MOVE_TO";
//    VgxPathCommand[VgxPathCommand["LINE_TO"] = 2] = "LINE_TO";
//    VgxPathCommand[VgxPathCommand["HORIZONTAL_LINE_TO"] = 3] = "HORIZONTAL_LINE_TO";
//    VgxPathCommand[VgxPathCommand["VERTICAL_LINE_TO"] = 4] = "VERTICAL_LINE_TO";
//    VgxPathCommand[VgxPathCommand["ARC_TO"] = 5] = "ARC_TO";
//    VgxPathCommand[VgxPathCommand["BEZIER_CURVE_TO"] = 6] = "BEZIER_CURVE_TO";
//    VgxPathCommand[VgxPathCommand["QUADRATIC_CURVE_TO"] = 7] = "QUADRATIC_CURVE_TO";
//    VgxPathCommand[VgxPathCommand["CLOSE_PATH"] = 8] = "CLOSE_PATH";
//    VgxPathCommand[VgxPathCommand["RECTANGLE"] = 9] = "RECTANGLE";
//    VgxPathCommand[VgxPathCommand["ELLIPSE"] = 10] = "ELLIPSE";
//    VgxPathCommand[VgxPathCommand["ARC"] = 11] = "ARC";
//    VgxPathCommand[VgxPathCommand["PATH"] = 12] = "PATH";
//})(VgxPathCommand || (VgxPathCommand = {}));
//Vgx.VgxPathCommand = VgxPathCommand;

(function (lib) {

    var Path = (function () {

        function Path() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;

            var _lastX = 0;
            var _lastY = 0;
            var _fillRule = "nonzero";
            var _listPath2D = [];
            var _currentFigure = null;


            function _init() {
                _self.beginNewFigure();
            }



            function createFigureObj(pathData) {
                if (typeof pathData === "string") {
                    return {
                        path: new Path2D(pathData),
                        isEmpty: false
                    };
                }
                else {
                    return {
                        path: new Path2D(),
                        isEmpty: true
                    };
                }
            }


            function collectPath2D() {
                if (_currentFigure != null && !_currentFigure.isEmpty)
                    _listPath2D.push(_currentFigure.path);
                _currentFigure = null;
            }

            function createNewFigure(pathData) {

                var result;
                if (typeof pathData === "string") {
                    result = createFigureObj(pathData);
                }

                if (_currentFigure != null) {
                    if (!_currentFigure.isEmpty)
                        collectPath2D();
                }

                if (!result) {
                    result = createFigureObj();
                }

                _currentFigure = result;
            }

            function ensureHasFigure() {
                if (!_currentFigure)
                    createNewFigure();
            }



            Object.defineProperty(this, "figures", {
                get: function () {
                    return _listPath2D.slice(0);
                }
            });


            this.clear = function () {
                _listPath2D.length = 0;
                _currentFigure = null;
                _self.geometryDirty = true;
            };


            this.beginNewFigure = function () {
                createNewFigure();
                _self.geometryDirty = true;
            };

            this.moveTo = function (x, y) {
                ensureHasFigure();
                _currentFigure.path.moveTo(x, y);
                _currentFigure.isEmpty = false;
                _lastX = x;
                _lastY = y;
            };

            this.lineTo = function (x, y) {
                ensureHasFigure();
                _currentFigure.path.lineTo(x, y);
                _currentFigure.isEmpty = false;
                _lastX = x;
                _lastY = y;
            };

            this.horizontalLineTo = function (x) {
                ensureHasFigure();
                _currentFigure.path.lineTo(x, _lastY);
                _currentFigure.isEmpty = false;
                _lastX = x;
            };

            this.verticalLineTo = function (y) {
                ensureHasFigure();
                _currentFigure.path.lineTo(_lastX, y);
                _currentFigure.isEmpty = false;
                _lastY = y;
            };

            this.arcTo = function (cpx, cpy, x, y, radius) {
                ensureHasFigure();
                _currentFigure.path.arcTo(cpx, cpy, x, y, radius);
                _currentFigure.isEmpty = false;
                _lastX = x;
                _lastY = y;
            };

            this.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
                ensureHasFigure();
                _currentFigure.path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                _currentFigure.isEmpty = false;
                _lastX = x;
                _lastY = y;
            };

            this.quadraticCurveTo = function (cpx, cpy, x, y) {
                ensureHasFigure();
                _currentFigure.path.quadraticCurveTo(cpx, cpy, x, y);
                _currentFigure.isEmpty = false;
                _lastX = x;
                _lastY = y;
            };

            this.closeFigure = function () {
                if (_currentFigure) {
                    _currentFigure.path.closePath();
                    _self.beginNewFigure();
                }
            };

            this.endFigure = function () {
                collectPath2D();
                _self.geometryDirty = true;
            };



            this.addFigure = function (pathData) {
                createNewFigure(pathData);
                collectPath2D();
                _self.geometryDirty = true;
                //createNewFigure();
                //var path = new Path2D(pathData);
                //_currentFigure.path.addPath(path);
                //collectPath2D();
                //_self.geometryDirty = true;
            };

            this.addRect = function (x, y, width, height) {
                createNewFigure();
                _currentFigure.path.rect(x, y, width, height);
                _currentFigure.isEmpty = false;
                collectPath2D();
                _self.geometryDirty = true;
            };

            this.addEllipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, optAnticlockwise) {
                optAnticlockwise = !!optAnticlockwise;
                createNewFigure();
                _currentFigure.path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, optAnticlockwise);
                _currentFigure.isEmpty = false;
                collectPath2D();
                _self.geometryDirty = true;
            };

            this.addArc = function (x, y, radius, startAngle, endAngle, optAnticlockwise) {
                optAnticlockwise = !!optAnticlockwise;
                createNewFigure();
                _currentFigure.path.arc(x, y, radius, startAngle, endAngle, optAnticlockwise);
                _currentFigure.isEmpty = false;
                collectPath2D();
                _self.geometryDirty = true;
            };


            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawPath(_self);
                    //drawingContext.drawVertex(_self.insertPoint.x, _self.insertPoint.y, _self.transform);
                }
            });


            //Object.defineProperty(this, "pathData", {
            //    get: function () { return _pathData; },
            //    set: function (v) {
            //        if (typeof v !== "string")
            //            return;
            //        if (_pathData != v) {
            //            _pathData = v;
            //            loadPathData();
            //            _self.geometryDirty = true;
            //        }
            //    }
            //});


            Object.defineProperty(this, "fillRule", {
                get: function () { return _fillRule; },
                set: function (v) {
                    if (typeof v !== "string" && v !== "nonzero" && v !== "evenodd")
                        return;
                    if (_fillRule != v) {
                        _fillRule = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    // TODO
                    var result = new lib.Vgx.Rect();
                    result.x = _self.insertPointX;
                    result.y = _self.insertPointY;
                    return result;
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        // TODO
            //        var result = lib.Vgx.Rect.empty;
            //        result.x = _self.insertPointX;
            //        result.y = _self.insertPointY;
            //        return result;
            //    }
            //});
        }

        Path.prototype = Object.create(lib.Vgx.Entity.prototype);
        Path.prototype.constructor = Path;

        return Path;

    })();
    lib.Vgx.Path = Path;

})(library);



//var VgxPathFigure = (function () {

//    function VgxPathFigure(path, pathData) {
//        lib.Vgx.IFillable.call(this);

//        var _self = this;
//        var _path = path;
//        var _pathData = pathData;
//        var _path2D;
//        var _fillRule = "nonzero";
//        var _isEmpty = true;


//        function _init() {
//            if (_pathData == null) {
//                _path2D = new Path2D();
//            }
//            else {
//                _path2D = new Path2D(_pathData);
//            }
//        }

//        Object.defineProperty(this, "path", {
//            get: function () { return _path2D; }
//        });

//        Object.defineProperty(this, "isEmpty", {
//            get: function () { return _isEmpty; }
//        });

//        Object.defineProperty(this, "fillRule", {
//            get: function () { return _fillRule; },
//            set: function (v) {
//                if (typeof v !== "string" && v !== "nonzero" && v !== "evenodd")
//                    return;
//                if (_fillRule != v) {
//                    _fillRule = v;
//                    _self.appearanceDirty = true;
//                }
//            }
//        });


//        Object.defineProperty(this, "getPath2D", {
//            value: function () { return _path2D; }
//        });


//        this.moveTo = function (x, y) {
//            //addCommand(VgxPathCommand.MOVE_TO, { x: x, y: y });
//            _path2D.moveTo(x, y);
//            _lastX = x;
//            _lastY = y;
//        };

//        this.lineTo = function (x, y) {
//            //addCommand(VgxPathCommand.LINE_TO, { x: x, y: y });
//            _path2D.lineTo(x, y);
//            _lastX = x;
//            _lastY = y;
//        };

//        this.horizontalLineTo = function (x) {
//            //addCommand(VgxPathCommand.HORIZONTAL_LINE_TO, { x: x });
//            _path2D.lineTo(x, _lastY);
//            _lastX = x;
//        };

//        this.verticalLineTo = function (y) {
//            //addCommand(VgxPathCommand.VERTICAL_LINE_TO, { y: y });
//            _path2D.lineTo(_lastX, y);
//            _lastY = y;
//        };

//        this.arcTo = function (cpx, cpy, x, y, radius) {
//            //addCommand(VgxPathCommand.ARC_TO, { cpx: cpx, cpy: cpy, x: x, y: y, radius: radius });
//            _path2D.arcTo(cpx, cpy, x, y, radius);
//            _lastX = x;
//            _lastY = y;
//        };

//        this.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
//            //addCommand(VgxPathCommand.BEZIER_CURVE_TO, { cp1x: cp1x, cp1y: cp1y, cp2x: cp2x, cp2y: cp2y, x: x, y: y });
//            _path2D.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
//            _lastX = x;
//            _lastY = y;
//        };

//        this.quadraticCurveTo = function (cpx, cpy, x, y) {
//            //addCommand(VgxPathCommand.QUADRATIC_CURVE_TO, { cpx: cpx, cpy: cpy, x: x, y: y });
//            _path2D.quadraticCurveTo(cpx, cpy, x, y);
//            _lastX = x;
//            _lastY = y;
//        };


//        _init();
//    }

//    return VgxPathFigure;

//})();
//Vgx.VgxPathFigure = VgxPathFigure;
/// <reference path="Entity.js" />

(function (lib) {

    var Pie = (function () {

        function Pie() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _degToRad = 0.017453292519943295;

            var _self = this;
            var _radius = 0;
            var _startAngle = 0;
            var _endAngle = 0;
            var _startAngleRad = 0;
            var _endAngleRad = 0;
            var _isAntiClockwise = false;


            Object.defineProperty(this, "radius", {
                get: function () { return _radius; },
                set: function (v) {
                    if (_radius != v) {
                        _radius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "startAngle", {
                get: function () { return _startAngle; },
                set: function (v) {
                    if (_startAngle != v) {
                        _startAngle = v;
                        _startAngleRad = v * _degToRad;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "startAngleRad", {
                get: function () { return _startAngleRad; }
            });

            Object.defineProperty(this, "endAngle", {
                get: function () { return _endAngle; },
                set: function (v) {
                    if (_endAngle != v) {
                        _endAngle = v;
                        _endAngleRad = v * _degToRad;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "endAngleRad", {
                get: function () { return _endAngleRad; }
            });

            Object.defineProperty(this, "isAntiClockwise", {
                get: function () { return _isAntiClockwise; },
                set: function (v) {
                    if (_isAntiClockwise != v) {
                        _isAntiClockwise = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            //var boundsRect = new lib.Vgx.Rectangle();
            //boundsRect.stroke = "magenta";
            //boundsRect.strokeWidth = 2;
            //boundsRect.fill = null;

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawPie(_self);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, 0, -_self.radius));
                    //drawingContext.drawVertex(_self.insertPoint);
                    //drawingContext.drawVertex(Point2D.sumValues(_self.insertPoint, _self.radius, 0));

                    //var bounds = _self.getBounds();
                    //boundsRect.insertPointX = bounds.x;
                    //boundsRect.insertPointY = bounds.y;
                    //boundsRect.width = bounds.width;
                    //boundsRect.height = bounds.height;
                    //drawingContext.drawRectangle(boundsRect);
                }
            });

            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    // TODO
                    var xsa = Math.cos(_startAngleRad) * _radius;
                    var ysa = Math.sin(_startAngleRad) * _radius;
                    var xea = Math.cos(_endAngleRad) * _radius;
                    var yea = Math.sin(_endAngleRad) * _radius;
                    var x1 = Math.min(xsa, xea);
                    var y1 = Math.min(ysa, yea);
                    var x2 = Math.max(xsa, xea);
                    var y2 = Math.max(ysa, yea);
                    return new lib.Vgx.Rect(_self.insertPointX + x1, _self.insertPointY + y1, x2 - x1, y2 - y1);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        // TODO
            //        var xsa = Math.cos(_startAngleRad) * _radius;
            //        var ysa = Math.sin(_startAngleRad) * _radius;
            //        var xea = Math.cos(_endAngleRad) * _radius;
            //        var yea = Math.sin(_endAngleRad) * _radius;

            //        var x1 = Math.min(xsa, xea);
            //        var y1 = Math.min(ysa, yea);
            //        var x2 = Math.max(xsa, xea);
            //        var y2 = Math.max(ysa, yea);

            //        return new lib.Vgx.Rect(_self.insertPointX + x1, _self.insertPointY + y1, x2 - x1, y2 - y1);
            //    }
            //});
        }

        Pie.prototype = Object.create(lib.Vgx.Entity.prototype);
        Pie.prototype.constructor = Pie;

        return Pie;
    })();
    lib.Vgx.Pie = Pie;

})(library);

/// <reference path="../../Extra/Collection.js" />
/// <reference path="Entity.js" />

(function (lib) {

    var Polygon = (function () {
        function Polygon() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _points = new lib.Extra.Collection();

            // @override @sealed
            //Object.defineProperty(this, "insertPoint", {
            //    configurable: false,
            //    get: function () { return _points.at(0); },
            //    set: function (v) {
            //        var firstPoint = _points.at(0);
            //        var dx = v.x - firstPoint.x;
            //        var dy = v.y - firstPoint.y;
            //        _points.forEach(function (v, i, a) {
            //            v.x += dx;
            //            v.y += dy;
            //        });
            //    }
            //});
            Object.defineProperty(this, "insertPointX", {
                configurable: false,
                get: function () { return _points.at(0).x; },
                set: function (v) {
                    var firstPoint = _points.at(0);
                    var dx = v - firstPoint.x;
                    _points.forEach(function (v, i, a) {
                        v.x += dx;
                    });
                }
            });
            Object.defineProperty(this, "insertPointY", {
                configurable: false,
                get: function () { return _points.at(0).y; },
                set: function (v) {
                    var firstPoint = _points.at(0);
                    var dy = v - firstPoint.y;
                    _points.forEach(function (v, i, a) {
                        v.y += dy;
                    });
                }
            });

            Object.defineProperty(this, "points", {
                get: function () { return _points; }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawPolygon(_self);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    return lib.Vgx.MathUtils.getPointsBounds(_points.toArray());
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        return lib.Vgx.MathUtils.getPointsBounds(_points.toArray());
            //    }
            //});
        }

        Polygon.prototype = Object.create(lib.Vgx.Entity.prototype);
        Polygon.prototype.constructor = Polygon;

        return Polygon;
    })();
    lib.Vgx.Polygon = Polygon;

})(library);

/// <reference path="../../Extra/Collection.js" />
/// <reference path="Entity.js" />


(function (lib) {

    var Polyline = (function () {
        function Polyline() {
            lib.Vgx.Entity.call(this);

            var _self = this;
            var _points = new lib.Extra.Collection();

            // @override @sealed
            //Object.defineProperty(this, "insertPoint", {
            //    configurable: false,
            //    get: function () { return _points.at(0); },
            //    set: function (v) {
            //        if (_points.length == 0)
            //            return;
            //        var firstPoint = _points.at(0);
            //        var dx = v.x - firstPoint.x;
            //        var dy = v.y - firstPoint.y;
            //        _points.forEach(function (v, i, a) {
            //            v.x += dx;
            //            v.y += dy;
            //        });
            //    }
            //});
            Object.defineProperty(this, "insertPointX", {
                configurable: false,
                get: function () { return _points.at(0).x; },
                set: function (v) {
                    var firstPoint = _points.at(0);
                    var dx = v - firstPoint.x;
                    _points.forEach(function (v, i, a) {
                        v.x += dx;
                    });
                }
            });
            Object.defineProperty(this, "insertPointY", {
                configurable: false,
                get: function () { return _points.at(0).y; },
                set: function (v) {
                    var firstPoint = _points.at(0);
                    var dy = v - firstPoint.y;
                    _points.forEach(function (v, i, a) {
                        v.y += dy;
                    });
                }
            });

            Object.defineProperty(this, "points", {
                get: function () { return _points; }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawPolyline(_self);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    return lib.Vgx.MathUtils.getPointsBounds(_points.toArray());
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        return lib.Vgx.MathUtils.getPointsBounds(_points.toArray());
            //    }
            //});
        }

        Polyline.prototype = Object.create(lib.Vgx.Entity.prototype);
        Polyline.prototype.constructor = Polyline;

        return Polyline;
    })();
    lib.Vgx.Polyline = Polyline;

})(library);
/// <reference path="Entity.js" />

(function (lib) {

    var Quad = (function () {
        function Quad() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _point1;
            var _point2;
            var _point3;
            var _point4;

            // @override @sealed
            //Object.defineProperty(this, "insertPoint", {
            //    configurable: false,
            //    get: function () { return _point1; },
            //    set: function (v) {
            //        var dx = v.x - _point1.x;
            //        var dy = v.y - _point1.y;
            //        _point1.x = v.x;
            //        _point1.y = v.y;
            //        _point2.x += dx;
            //        _point2.y += dy;
            //        _point3.x += dx;
            //        _point3.y += dy;
            //        _point4.x += dx;
            //        _point4.y += dy;
            //    }
            //});
            Object.defineProperty(this, "insertPointX", {
                configurable: false,
                get: function () { return _point1.x; },
                set: function (v) {
                    var dx = v - _point1.x;
                    _point1.x = v;
                    _point2.x += dx;
                    _point3.x += dx;
                    _point4.x += dx;
                }
            });
            Object.defineProperty(this, "insertPointY", {
                configurable: false,
                get: function () { return _point1.y; },
                set: function (v) {
                    var dy = v - _point1.y;
                    _point1.y = v;
                    _point2.y += dy;
                    _point3.y += dy;
                    _point4.y += dy;
                }
            });

            Object.defineProperty(this, "point1", {
                get: function () { return _point1; },
                set: function (v) {
                    if (_point1 != v) {
                        _point1 = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "point2", {
                get: function () { return _point2; },
                set: function (v) {
                    if (_point2 != v) {
                        _point2 = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "point3", {
                get: function () { return _point3; },
                set: function (v) {
                    if (_point3 != v) {
                        _point3 = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "point4", {
                get: function () { return _point4; },
                set: function (v) {
                    if (_point4 != v) {
                        _point4 = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawQuad(_self);
                    //drawingContext.drawVertex(_point1);
                    //drawingContext.drawVertex(_point2);
                    //drawingContext.drawVertex(_point3);
                    //drawingContext.drawVertex(_point4);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var minX = Number.MAX_VALUE;
                    var minY = Number.MAX_VALUE;
                    var maxX = Number.MIN_VALUE;
                    var maxY = Number.MIN_VALUE;
                    var points = [_point1, _point2, _point3, _point4];
                    for (var i = 0; i < points.length; i++) {
                        var p = points[i];
                        minX = Math.min(minX, p.x);
                        minY = Math.min(minY, p.y);
                        maxX = Math.max(maxX, p.x);
                        maxY = Math.max(maxY, p.y);
                    }
                    return new lib.Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var minX = Number.MAX_VALUE;
            //        var minY = Number.MAX_VALUE;
            //        var maxX = Number.MIN_VALUE;
            //        var maxY = Number.MIN_VALUE;
            //        var points = [_point1, _point2, _point3, _point4];
            //        for (var i = 0; i < points.length; i++) {
            //            var p = points[i];
            //            minX = Math.min(minX, p.x);
            //            minY = Math.min(minY, p.y);
            //            maxX = Math.max(maxX, p.x);
            //            maxY = Math.max(maxY, p.y);
            //        }
            //        return new lib.Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
            //    }
            //});
        }

        Quad.prototype = Object.create(lib.Vgx.Entity.prototype);
        Quad.prototype.constructor = Quad;

        return Quad;
    })();
    lib.Vgx.Quad = Quad;

})(library);

/// <reference path="../../Extra/Collection.js" />
/// <reference path="../MathUtils.js" />
/// <reference path="Entity.js" />


(function (lib) {

    var QuadraticCurve = (function () {
        function QuadraticCurve() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _points = new lib.Extra.Collection();
            var _controlsPoints = new lib.Extra.Collection();
            var _isClosed = false;

            // @override @sealed
            //Object.defineProperty(this, "insertPoint", {
            //    configurable: false,
            //    get: function () { return _points.at(0); },
            //    set: function (v) {
            //        var firstPoint = _points.at(0);
            //        var dx = v.x - firstPoint.x;
            //        var dy = v.y - firstPoint.y;
            //        _points.forEach(function (v, i, a) {
            //            v.x += dx;
            //            v.y += dy;
            //        });
            //        _controlsPoints.forEach(function (v, i, a) {
            //            v.x += dx;
            //            v.y += dy;
            //        });
            //    }
            //});
            Object.defineProperty(this, "insertPointX", {
                configurable: false,
                get: function () { return _points.length > 0 ? _points.at(0).x : 0; },
                set: function (v) {
                    var firstPoint = _points.at(0);
                    var dx = v - firstPoint.x;
                    _points.forEach(function (p, i, a) {
                        p.x += dx;
                    });
                    _controlsPoints.forEach(function (p, i, a) {
                        p.x += dx;
                    });
                }
            });
            Object.defineProperty(this, "insertPointY", {
                configurable: false,
                get: function () { return _points.length > 0 ? _points.at(0).y : 0; },
                set: function (v) {
                    var firstPoint = _points.at(0);
                    var dy = v - firstPoint.y;
                    _points.forEach(function (p, i, a) {
                        p.y += dy;
                    });
                    _controlsPoints.forEach(function (p, i, a) {
                        p.y += dy;
                    });
                }
            });

            Object.defineProperty(this, "points", {
                get: function () { return _points; }
            });

            Object.defineProperty(this, "controlPoints", {
                get: function () { return _controlsPoints; }
            });

            Object.defineProperty(this, "isClosed", {
                get: function () { return _isClosed; },
                set: function (v) {
                    v = !!v;
                    if (_isClosed != v) {
                        _isClosed = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawQuadraticCurve(_self);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var allBoundsPoints = new Array();
                    allBoundsPoints.concat(_points.toArray());
                    allBoundsPoints.concat(_controlsPoints.toArray());
                    return lib.Vgx.MathUtils.getPointsBounds(allBoundsPoints);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var allBoundsPoints = new Array();
            //        allBoundsPoints.concat(_points.toArray());
            //        allBoundsPoints.concat(_controlsPoints.toArray());
            //        return lib.Vgx.MathUtils.getPointsBounds(allBoundsPoints);
            //    }
            //});
        }

        QuadraticCurve.prototype = Object.create(lib.Vgx.Entity.prototype);
        QuadraticCurve.prototype.constructor = QuadraticCurve;

        /*QuadraticCurve.fromPoints = function (points, isClosed) {
            var quadraticCurveSegments = MathUtils.interpolatePointWithQuadraticCurves(points, isClosed);
            var result = new QuadraticCurve();
            result.points.add(points[0]);
            for (var i = 0; i < quadraticCurveSegments.length; i++) {
                var segment = quadraticCurveSegments[i];
                result.controlPoints1.add(segment.controlPoint);
                result.points.add(segment.endPoint);
            }
            return result;
        };*/

        return QuadraticCurve;
    })();
    lib.Vgx.QuadraticCurve = QuadraticCurve;

})(library);
/// <reference path="Entity.js" />

(function (lib) {

    var Rectangle = (function () {
        function Rectangle() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _width = 0;
            var _height = 0;
            var _cornersRadius = 0;
            var _path = null;
            var _cachedBounds = new lib.Vgx.Rect();


            //function updateCachedBounds() {
            //    var mtx = _self.transform.getMatrix().clone();
            //    mtx.offsetX = -(_self.insertPointX + _self.transform.originX);
            //    mtx.offsetY = -(_self.insertPointY + _self.transform.originY);
            //    _cachedBounds = mtx.transformRect(_self.insertPointX, _self.insertPointY, _self.width, _self.height);
            //}

            

            // abstract override
            Object.defineProperty(this, "_getPath", {
                configurable: false,
                value: function () {
                    if (_path == null || _self.geometryDirty) {
                        _path = new Path2D();
                        _path.rect(0, 0, _self.width, _self.height);
                    }
                    return _path;
                }
            });

            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY, _self.width, _self.height);
                }
            });

            // virtual override
            Object.defineProperty(this, "_getVertices", {
                configurable: false,
                value: function () {
                    return [
                        {
                            x: _self.insertPointX,
                            y: _self.insertPointY,
                        },
                        {
                            x: _self.insertPointX + _self.width,
                            y: _self.insertPointY + _self.height,
                        }
                    ]
                }
            });


            Object.defineProperty(this, "width", {
                get: function () { return _self._getValue("width", _width); },
                set: function (v) {
                    // TODO: handle binding
                    if (_width != v) {
                        _width = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "height", {
                get: function () { return _self._getValue("height", _height); },
                set: function (v) {
                    if (_height != v) {
                        _height = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "cornersRadius", {
                get: function () { return _self._getValue("cornersRadius", _cornersRadius); },
                set: function (v) {
                    if (_cornersRadius != v) {
                        _cornersRadius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawRectangle(_self);
                    //drawingContext.drawVertex(_self.insertPointX, _self.insertPointY, _self.transform);
                    //drawingContext.drawVertex(_self.insertPointX + _self.width, _self.insertPointY + _self.height, _self.transform);
                    //drawingContext.drawVertices(_self._getVertices(), _self.transform);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        if (_self.geometryDirty) {
            //            updateCachedBounds();
            //        }
            //        return _cachedBounds;
            //    }
            //});


        }

        Rectangle.prototype = Object.create(lib.Vgx.Entity.prototype);
        Rectangle.prototype.constructor = Rectangle;

        return Rectangle;
    })();
    lib.Vgx.Rectangle = Rectangle;

})(library);
/// <reference path="Entity.js" />

(function (lib) {

    var Square = (function () {

        function Square() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _size = 0;
            var _cornersRadius = 0;
            var _path = null;


            // @override
            Object.defineProperty(this, "_getPath", {
                configurable: false,
                value: function () {
                    if (_path == null || _self.geometryDirty) {
                        _path = new Path2D();
                        _path.rect(0, 0, _self.size, _self.size);
                    }
                    return _path;
                }
            });

            // @override
            Object.defineProperty(this, "_getVertices", {
                configurable: false,
                value: function () {
                    return [
                        _self.insertPoint,
                        {
                            x: _self.insertPoint.x + _self.size,
                            y: _self.insertPoint.y + _self.size,
                        }
                    ]
                }
            });


            Object.defineProperty(this, "size", {
                get: function () { return _self._getValue("size", _size); },
                set: function (v) {
                    // TODO: handle binding
                    if (_size != v) {
                        _size = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "cornersRadius", {
                get: function () { return _self._getValue("cornersRadius", _cornersRadius); },
                set: function (v) {
                    if (_cornersRadius != v) {
                        _cornersRadius = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawSquare(_self);
                    //drawingContext.drawVertex(_self.insertPointX, _self.insertPointY, _self.transform);
                    //drawingContext.drawVertex(_self.insertPointX + _self.size, _self.insertPointY + _self.size, _self.transform);
                    //drawingContext.drawVertices(_self._getVertices(), _self.transform);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY, _self.size, _self.size);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY, _self.size, _self.size);
            //    }
            //});


        }

        Square.prototype = Object.create(lib.Vgx.Entity.prototype);
        Square.prototype.constructor = Square;

        return Square;
    })();
    lib.Vgx.Square = Square;

})(library);
/// <reference path="../Vars.js" />
/// <reference path="Entity.js" />

(function (lib) {

    var Text = (function () {

        function Text() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _fontFamily = lib.Vgx.Vars.fontFamily;
            var _fontSize = lib.Vgx.Vars.fontSize;
            var _text = "";
            var _textAlign = "left";
            var _textBaseline = "alphabetic";
            var _textMeasure = null;


            function getBaselineOffset(textMetrics) {
                switch (_textBaseline) {
                    case "top":
                        return 0;
                    case "hanging":
                        // TODO:
                        return textMetrics.height * 0.1951;
                    case "middle":
                        return textMetrics.height * 0.5;
                    case "alphabetic":
                        // TODO:
                        return textMetrics.height * 0.8;
                    case "ideographic":
                    // TODO:
                    case "bottom":
                        return textMetrics.height;
                    default:
                        throw new Error("invalid textBaseline");
                }
            }


            // @override
            Object.defineProperty(this, "_getPath", {
                configurable: false,
                value: function () {
                    if (_path == null || _self.geometryDirty) {
                        //_path = new Path2D();
                        //_path.rect(0, 0, _self.width, _self.height);
                        throw new Error("not implemented");
                    }
                    return _path;
                }
            });

            // @override
            Object.defineProperty(this, "_getVertices", {
                configurable: false,
                value: function () {
                    return [
                        {
                            x: _self.insertPointX,
                            y: _self.insertPointY,
                        }
                        /*, TODO
                        {
                            x: _self.insertPoint.x + _self.width,
                            y: _self.insertPoint.y + _self.height,
                        }*/
                    ]
                }
            });


            Object.defineProperty(this, "fontFamily", {
                get: function () { return _fontFamily; },
                set: function (v) {
                    if (typeof v !== "string")
                        return;
                    if (_fontFamily != v) {
                        _fontFamily = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "fontSize", {
                get: function () { return _fontSize; },
                set: function (v) {
                    if (typeof v !== "number")
                        return;
                    if (_fontSize != v) {
                        _fontSize = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "text", {
                get: function () { return _text; },
                set: function (v) {
                    if (typeof v !== "string" && typeof v !== "undefined")
                        return;
                    if (_text != v) {
                        _text = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "textAlign", {
                get: function () { return _textAlign; },
                set: function (v) {
                    if (_textAlign != v) {
                        _textAlign = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "textBaseline", {
                get: function () { return _textBaseline; },
                set: function (v) {
                    // "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom"
                    /*
                    "top"
                    The text baseline is the top of the em square.
                    "hanging"
                    The text baseline is the hanging baseline. (Used by Tibetan and other Indic scripts.)
                    "middle"
                    The text baseline is the middle of the em square.
                    "alphabetic" (default value)
                    The text baseline is the normal alphabetic baseline.
                    "ideographic"
                    The text baseline is the ideographic baseline; this is the bottom of the body of the characters, if the main body of characters protrudes beneath the alphabetic baseline. (Used by Chinese, Japanese and Korean scripts.)
                    "bottom"
                    The text baseline is the bottom of the bounding box. This differs from the ideographic baseline in that the ideographic baseline doesn't consider descenders.
                    */
                    if (_textBaseline != v) {
                        _textBaseline = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawText(_self, true);
                    //drawingContext.drawVertices(
                    //    [
                    //        _self.insertPoint,
                    //        { x: _self.insertPoint.x + _textMeasure.width, y: _self.insertPoint.y /*+ _self.fontSize*/ }
                    //    ],
                    //    _self.transform,
                    //    _self.insertPoint.x,
                    //    _self.insertPoint.y
                    //);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    _textMeasure = lib.Vgx.TextUtils.measureText(_self.text, _self.fontFamily, _self.fontSize);
                    var baselineOffset = getBaselineOffset(_textMeasure);
                    return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY - baselineOffset, _textMeasure ? _textMeasure.width : 0, _textMeasure ? _textMeasure.height : 0);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        // TODO:
            //        _textMeasure = lib.Vgx.TextUtils.measureText(_self.text, _self.fontFamily, _self.fontSize);
            //        var baselineOffset = getBaselineOffset(_textMeasure);
            //        return new lib.Vgx.Rect(_self.insertPointX, _self.insertPointY - baselineOffset, _textMeasure ? _textMeasure.width : 0, _textMeasure ? _textMeasure.height : 0);
            //    }
            //});
        }

        Text.prototype = Object.create(lib.Vgx.Entity.prototype);
        Text.prototype.constructor = Text;

        return Text;
    })();
    lib.Vgx.Text = Text;

})(library);
/// <reference path="Entity.js" />

(function (lib) {

    var Triangle = (function () {
        function Triangle() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _point1;
            var _point2;
            var _point3;

            // @override @sealed
            //Object.defineProperty(this, "insertPoint", {
            //    configurable: false,
            //    get: function () { return _point1; },
            //    set: function (v) {
            //        var dx = v.x - _point1.x;
            //        var dy = v.y - _point1.y;
            //        _point1.x = v.x;
            //        _point1.y = v.y;
            //        _point2.x += dx;
            //        _point2.y += dy;
            //        _point3.x += dx;
            //        _point3.y += dy;
            //    }
            //});
            Object.defineProperty(this, "insertPointX", {
                configurable: false,
                get: function () { return _point1.x; },
                set: function (v) {
                    var dx = v - _point1.x;
                    _point1.x = v;
                    _point2.x += dx;
                    _point3.x += dx;
                }
            });
            Object.defineProperty(this, "insertPointY", {
                configurable: false,
                get: function () { return _point1.y; },
                set: function (v) {
                    var dy = v - _point1.y;
                    _point1.y = v;
                    _point2.y += dy;
                    _point3.y += dy;
                }
            });

            Object.defineProperty(this, "point1", {
                get: function () { return _point1; },
                set: function (v) {
                    if (_point1 != v) {
                        _point1 = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "point2", {
                get: function () { return _point2; },
                set: function (v) {
                    if (_point2 != v) {
                        _point2 = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "point3", {
                get: function () { return _point3; },
                set: function (v) {
                    if (_point3 != v) {
                        _point3 = v;
                        _self.geometryDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawTriangle(_self);
                    //drawingContext.drawVertex(_point1);
                    //drawingContext.drawVertex(_point2);
                    //drawingContext.drawVertex(_point3);
                }
            });


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var minX = Number.MAX_VALUE;
                    var minY = Number.MAX_VALUE;
                    var maxX = Number.MIN_VALUE;
                    var maxY = Number.MIN_VALUE;
                    var points = [_point1, _point2, _point3];
                    for (var i = 0; i < points.length; i++) {
                        var p = points[i];
                        minX = Math.min(minX, p.x);
                        minY = Math.min(minY, p.y);
                        maxX = Math.max(maxX, p.x);
                        maxY = Math.max(maxY, p.y);
                    }
                    return new lib.Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var minX = Number.MAX_VALUE;
            //        var minY = Number.MAX_VALUE;
            //        var maxX = Number.MIN_VALUE;
            //        var maxY = Number.MIN_VALUE;
            //        var points = [_point1, _point2, _point3];
            //        for (var i = 0; i < points.length; i++) {
            //            var p = points[i];
            //            minX = Math.min(minX, p.x);
            //            minY = Math.min(minY, p.y);
            //            maxX = Math.max(maxX, p.x);
            //            maxY = Math.max(maxY, p.y);
            //        }
            //        return new lib.Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
            //    }
            //});
        }

        Triangle.prototype = Object.create(lib.Vgx.Entity.prototype);
        Triangle.prototype.constructor = Triangle;

        return Triangle;
    })();
    lib.Vgx.Triangle = Triangle;

})(library);

/// <reference path="../Cgx/Renderer.js" />

/// <reference path="../extra/Events.js" />
/// <reference path="../engine/ViewTransform.js" />

/// <reference path="../../Cgx/Engine.js" />
/// <reference path="../DrawingContext.js" />

(function (lib) {

    var Viewport = (function () {

        function Viewport(optCanvas, optDrawing) {

            const ZOOM_STEP = 0.85;

            var _self = this;
            var _events = new lib.Extra.Events(this);

            var _htmlElement;
            var _canvas;
            var _drawing;

            var _drawingContext;
            var _viewTransform = new lib.Vgx.ViewTransform();

            var _isDirty = true;
            var _needRedraw = true;
            var _onDrag;
            var _lastMouseX;
            var _lastMouseY;
            var _nerverResized = true;
            var _autosize = true;
            var _width = 800;
            var _height = 600;

            var _hasDrawing = false;
            var _drawAxes = false;


            function init() {

                var drawing;

                _htmlElement = window.document.createElement("div");

                if (optCanvas instanceof HTMLCanvasElement) {
                    _canvas = optCanvas;
                }
                else {
                    _canvas = window.document.createElement("canvas");
                }

                _htmlElement.appendChild(_canvas);

                if (optDrawing instanceof lib.Vgx.Drawing) {
                    drawing = optDrawing;
                }
                else {
                    drawing = new lib.Vgx.Drawing();
                }

                _drawingContext = new lib.Vgx.DrawingContext(_drawing, _canvas, _viewTransform);
                _self.drawing = drawing;

                setupMouseEvents();
                window.addEventListener("resize", onResize);

                _viewTransform.setViewTarget(0, 0);

                requestAnimationFrame(onRender);
            }

            function setupMouseEvents() {
                _canvas.addEventListener("mousedown", onMouseDown);
                _canvas.addEventListener("mousemove", onMouseMove);
                _canvas.addEventListener("mouseup", onMouseUp);
                _canvas.addEventListener("wheel", onMouseWheel);
            }

            function checkNeedRedraw() {
                _needRedraw = _isDirty;
                if (_drawing && _drawing.isDirty) {
                    _needRedraw = true;
                    _drawing.isDirty = false;
                }
                _isDirty = false;
            }

            function invalidate() {
                _isDirty = true;
            }

            function render() {

                checkNeverResized();

                if (_needRedraw) {

                    if (_hasDrawing) {

                        if (_drawing.background) {
                            _drawingContext.clear(_drawing.background);
                        } else {
                            _drawingContext.clear();
                        }

                        _drawingContext._beginRender();

                        var children = _drawing.getChildren();
                        for (var i = 0; i < children.length; i++) {
                            var child = children[i];
                            if (child) {
                                if (child.visible) {
                                    // TODO: check view intersection
                                    child.draw(_drawingContext);
                                }
                            }
                        }

                        _drawingContext._endRender();
                    }

                    if (_self.drawAxes)
                        _drawingContext.drawAxes();
                }

                _needRedraw = false;
            }

            function handleViewChanged() {
                _events.raise("onViewChanged", { rect: getCurrentViewBounds() });
            }

            function getCurrentViewBounds() {
                return _viewTransform.getViewBounds();
            }

            function checkNeverResized() {
                if (_htmlElement.parentElement && _nerverResized) {
                    _nerverResized = false;
                    onResize(null);
                }
            }

            function onRender() {

                if (_htmlElement.parentElement != null) {
                    checkNeedRedraw();
                    if (_needRedraw) {
                        //console.log("redraw");
                        render();
                    }
                }

                requestAnimationFrame(onRender);
            }

            function onDrawingDirty() {
                invalidate();
            }

            function onMouseDown(e) {
                if (!_hasDrawing)
                    return;
                _lastMouseX = e.x;
                _lastMouseY = e.y;
                _onDrag = true;
            }

            function onMouseMove(e) {
                if (!_hasDrawing)
                    return;
                if (_onDrag) {
                    var cw = _viewTransform.localToGlobalPoint(e.x, e.y);
                    var lw = _viewTransform.localToGlobalPoint(_lastMouseX, _lastMouseY);
                    var difX = cw.x - lw.x;
                    var difY = cw.y - lw.y;
                    //if (!_viewTransform.isBottomUp)
                    //difY = -difY;
                    _self.move(-difX, -difY);
                }
                _lastMouseX = e.x;
                _lastMouseY = e.y;
            }

            function onMouseUp(e) {
                if (!_hasDrawing)
                    return;
                _onDrag = false;
            }

            function onMouseWheel(e) {
                if (!_hasDrawing)
                    return;
                //var sceneMousePos = _viewTransform.localToGlobalPoint(e.x, e.y);
                if (e.deltaY > 0) {
                    //_self.zoomFrom(ZOOM_STEP, sceneMousePos.x, sceneMousePos.y);
                    _self.zoom(ZOOM_STEP);
                }
                else {
                    //_self.zoomFrom(1 / ZOOM_STEP, sceneMousePos.x, sceneMousePos.y);
                    _self.zoom(1 / ZOOM_STEP);
                }
            }

            function onResize(e) {
                if (_autosize && _htmlElement.parentElement) {
                    _htmlElement.style.width = _htmlElement.parentElement.clientWidth + "px";
                    _htmlElement.style.height = _htmlElement.parentElement.clientHeight + "px";
                }
                else {
                    _htmlElement.style.width = _width + "px";
                    _htmlElement.style.height = _height + "px";
                }

                _canvas.width = _htmlElement.clientWidth;
                _canvas.height = _htmlElement.clientHeight;

                _isDirty = true;
                _viewTransform.setViewPixelSize(_canvas.width, _canvas.height);

                if (!_drawing)
                    return;
                invalidate();
            }

            function onDrawingChanged(oldValue, newValue) {
                if (oldValue != null) {
                    //oldValue.EntitiesCollectionChanged -= Entities_CollectionChanged;
                    oldValue._unregisterDirtyEventHandler(onDrawingDirty);
                }
                _hasDrawing = false;
                if (newValue != null) {
                    _hasDrawing = true;
                    _drawingContext.drawing = newValue;
                    //newValue.EntitiesCollectionChanged += Entities_CollectionChanged;
                    newValue._registerDirtyEventHandler(onDrawingDirty);
                }
                checkNeverResized();
            }
            

            


            //#region Properties

            Object.defineProperty(this, "autosize", {
                get: function () { return _autosize; },
                set: function (v) {
                    v = !!v;
                    if (_autosize != v) {
                        var oldValue = _autosize;
                        _autosize = v;
                        onResize(null);
                    }
                }
            });

            Object.defineProperty(this, "canvas", {
                get: function () { return _canvas; }
            });

            Object.defineProperty(this, "currentZoom", {
                get: function () { return _viewTransform.viewZoom; }
            });

            Object.defineProperty(this, "currentTargetX", {
                get: function () { return _viewTransform.viewTargetX; }
            });

            Object.defineProperty(this, "currentTargetY", {
                get: function () { return _viewTransform.viewTargetY; }
            });

            Object.defineProperty(this, "drawAxes", {
                get: function () { return _drawAxes; },
                set: function (v) {
                    _drawAxes = v;
                    invalidate();
                }
            });

            Object.defineProperty(this, "drawing", {
                get: function () { return _drawing; },
                set: function (v) {
                    if (_drawing != v) {
                        var oldValue = _drawing;
                        _drawing = v;
                        onDrawingChanged(oldValue, _drawing);
                    }
                }
            });

            Object.defineProperty(this, "height", {
                get: function () { return _autosize ? _htmlElement.height : _height; },
                set: function (v) {
                    if (_autosize) {
                        _height = v;
                    }
                    else {
                        if (_height != v) {
                            _height = v;
                            onResize(null);
                        }
                    }
                }
            });

            Object.defineProperty(this, "htmlElement", {
                get: function () { return _htmlElement; }
            });

            //Object.defineProperty(this, "orientation", {
            //    get: function () { return _viewTransform.isBottomUp ? ViewportOrientation.BOTTOM_UP : ViewportOrientation.TOP_DOWN; },
            //    set: function (v) {
            //        switch (v) {
            //            case ViewportOrientation.TOP_DOWN:
            //                _viewTransform.isBottomUp = false;
            //                break;
            //            case ViewportOrientation.BOTTOM_UP:
            //                _viewTransform.isBottomUp = true;
            //                break;
            //            default:
            //                throw new Error("invalid value");
            //        }
            //        invalidate();
            //    }
            //});

            Object.defineProperty(this, "scaleStyles", {
                get: function () { return _drawingContext.scaleStyles; },
                set: function (v) {
                    _drawingContext.scaleStyles = v;
                    invalidate();
                }
            });

            Object.defineProperty(this, "width", {
                get: function () { return _autosize ? _htmlElement.width : _width; },
                set: function (v) {
                    if (_autosize) {
                        _width = v;
                    }
                    else {
                        if (_width != v) {
                            _width = v;
                            onResize(null);
                        }
                    }
                }
            });

            //#endregion


            //#region Methods

            Object.defineProperty(this, "getCursorPosition", {
                value: function () {
                    return _viewTransform.localToGlobalPoint(_lastMouseX, _lastMouseY);
                }
            });

            Object.defineProperty(this, "getCurrentViewBounds", {
                value: function () {
                    return getCurrentViewBounds();
                }
            });

            Object.defineProperty(this, "redraw", {
                value: function () {
                    _isDirty = true;
                    onRender();
                }
            });

            Object.defineProperty(this, "move", {
                value: function (offsetX, offsetY) {
                    _viewTransform.moveViewTarget(offsetX, offsetY);
                    handleViewChanged();
                    invalidate();
                }
            });

            Object.defineProperty(this, "moveTo", {
                value: function (centerX, centerY) {
                    _viewTransform.setViewTarget(centerX, centerY);
                    handleViewChanged();
                    invalidate();
                }
            });

            Object.defineProperty(this, "zoom", {
                value: function (zoomIncrement) {
                    _viewTransform.setViewZoom(_viewTransform.viewZoom * zoomIncrement);
                    handleViewChanged();
                    invalidate();
                }
            });

            Object.defineProperty(this, "zoomTo", {
                value: function (zoomIncrement, centerX, centerY) {
                    _viewTransform.setViewZoomTo(_viewTransform.viewZoom * zoomIncrement, centerX, centerY);
                    handleViewChanged();
                    invalidate();
                }
            });

            Object.defineProperty(this, "zoomAt", {
                value: function (zoomFactor, centerX, centerY) {
                    _viewTransform.setViewZoomTo(zoomFactor, centerX, centerY);
                    handleViewChanged();
                    invalidate();
                }
            });

            Object.defineProperty(this, "zoomAll", {
                value: function () {
                    var drawingBounds = this.drawing.getBounds();
                    if (drawingBounds.width == 0 || drawingBounds.height == 0)
                        return;
                    var drawingAspectRatio = drawingBounds.height / drawingBounds.width;
                    var viewPixelWidth = _canvas.width;
                    var viewPixelHeight = _canvas.height;
                    var viewPixelBounds = new lib.Vgx.Rect(0, 0, viewPixelWidth, viewPixelHeight);
                    var viewAspectRatio = viewPixelHeight / viewPixelWidth;
                    var currentZoom = _viewTransform.viewZoom;
                    var viewGlobalBounds = _viewTransform.localToGlobalRect(viewPixelBounds.x, viewPixelBounds.y, viewPixelBounds.width, viewPixelBounds.height);
                    var zoomFactor = 1.0;
                    if (drawingAspectRatio > viewAspectRatio) {
                        // esegue il 'fit' in altezza
                        zoomFactor = viewGlobalBounds.height / drawingBounds.height;
                    }
                    else {
                        // esegue il 'fit' in larghezza
                        zoomFactor = viewGlobalBounds.width / drawingBounds.width;
                    }
                    var centerX = drawingBounds.x + (drawingBounds.width * 0.5);
                    var centerY = drawingBounds.y + (drawingBounds.height * 0.5);
                    zoomFactor *= 0.9;
                    if (lib.Vgx.MathUtils.isZero(zoomFactor))
                        zoomFactor = 0.1;
                    this.zoomAt(zoomFactor, centerX, centerY);
                }
            });

            //Object.defineProperty(this, "zoomFrom", {
            //    value: function (zoomFactor, x, y) {
            //        _viewTransform._setViewZoomFrom(zoomFactor, x, y);
            //        handleViewChanged();
            //        invalidate();
            //    }
            //});

            //#endregion


            //#region Events

            _events.create("onViewChanged");

            //#endregion


            // ctor
            init();
        }

        return Viewport;
    })();
    lib.Vgx.Viewport = Viewport;

})(library);
/// <reference path="Viewport.js" />
/// <reference path="ViewportsLayout.js" />

(function (lib) {

    var VectorGraphicsView = (function () {

        function VectorGraphicsView() {

            var _self = this;
            var _events = new lib.Extra.Events(this);
            var _htmlElement;
            var _viewports = new Array();
            var _currentViewport;
            var _drawing;
            var _hasDrawing = false;
            var _viewportsLayout = lib.Vgx.ViewportsLayout.ONE;
            var _viewportsSpace = 2;
            var _neverArranged = true;


            function init() {
                _htmlElement = window.document.createElement("div");
                _htmlElement.classList.add("VectorGraphicsView");
                _htmlElement.style.width = "100%";
                _htmlElement.style.height = "100%";
                addNewViewport();
                window.addEventListener("resize", function () { return arrangeLayout(); });
            }


            function arrangeLayout() {
                if (!_htmlElement.parentElement)
                    return;
                switch (_viewportsLayout) {
                    case lib.Vgx.ViewportsLayout.ONE:
                        break;
                    case lib.Vgx.ViewportsLayout.TWO_VERTICAL:
                        {
                            var width = (_htmlElement.offsetWidth - _viewportsSpace) * 0.5;
                            var height = _htmlElement.offsetHeight;
                            var viewportLeft = _viewports[0];
                            viewportLeft.width = width;
                            viewportLeft.height = height;
                            var viewportRight = _viewports[1];
                            viewportRight.width = width;
                            viewportRight.height = height;
                            viewportRight.htmlElement.style.left = (width + _viewportsSpace) + "px";
                            viewportRight.htmlElement.style.top = "0px";
                        }
                        break;
                    case lib.Vgx.ViewportsLayout.TWO_HORIZONTAL:
                        {
                            var width = _htmlElement.offsetWidth;
                            var height = (_htmlElement.offsetHeight - _viewportsSpace) * 0.5;
                            var viewportTop = _viewports[0];
                            viewportTop.width = width;
                            viewportTop.height = height;
                            var viewportBottom = _viewports[1];
                            viewportBottom.width = width;
                            viewportBottom.height = height;
                            viewportBottom.htmlElement.style.left = "0px";
                            viewportBottom.htmlElement.style.top = (height + _viewportsSpace) + "px";
                        }
                        break;
                }
                _neverArranged = false;
            }

            function addNewViewport() {
                var viewport = new lib.Vgx.Viewport();
                if (_drawing != null) {
                    viewport.drawing = _drawing;
                }
                addViewport(viewport);
            }

            function addViewport(viewport) {
                if (_viewports.indexOf(viewport) != -1)
                    return;
                viewport.htmlElement.classList.add("viewport");
                _viewports.push(viewport);
                _htmlElement.appendChild(viewport.htmlElement);
                setActiveViewport(viewport);
                arrangeLayout();
            }

            function removeLastViewport() {
                var viewport = _viewports.pop();
                viewport.htmlElement.remove();
                if (_currentViewport == viewport) {
                    _currentViewport = _viewports[_viewports.length - 1];
                }
            }

            function setActiveViewport(viewport) {
                _currentViewport = viewport;
            }

            function ensureViewportsCount(count) {
                if (count > _viewports.length) {
                    while (_viewports.length < count)
                        addNewViewport();
                }
                else if (count < _viewports.length) {
                    while (_viewports.length > count)
                        removeLastViewport();
                }
            }

            function checkNeverArranged() {
                if (_neverArranged) {
                    arrangeLayout();
                }
            }

            function onDrawingChanged(oldValue, newValue) {
                if (oldValue != null) {
                    // TODO
                }
                _hasDrawing = false;
                if (newValue != null) {
                    for (var i = 0; i < _viewports.length; i++) {
                        _viewports[i].drawing = newValue;
                    }
                }
                checkNeverArranged();
            }

            function onViewportsLayoutChanged(oldValue, newValue) {
                _neverArranged = true;
                switch (newValue) {
                    case 1://ViewportsLayout.ONE:
                        {
                            ensureViewportsCount(1);
                            _viewports[0].htmlElement.style.position = "relative";
                            _viewports[0].autosize = true;
                        }
                        break;
                    case 2: //ViewportsLayout.TWO_VERTICAL:
                    case 3://ViewportsLayout.TWO_HORIZONTAL:
                        {
                            ensureViewportsCount(2);
                            _viewports[0].htmlElement.style.position = "absolute";
                            _viewports[0].autosize = false;
                            _viewports[1].htmlElement.style.position = "absolute";
                            _viewports[1].autosize = false;
                        }
                        break;
                }
                arrangeLayout();

                _events.raise("onViewportsLayoutChanged", { layout: newValue });
            }




            Object.defineProperty(this, "htmlElement", {
                get: function () { return _htmlElement; }
            });

            Object.defineProperty(this, "drawing", {
                get: function () { return _drawing; },
                set: function (v) {
                    if (_drawing != v) {
                        var oldValue = _drawing;
                        _drawing = v;
                        onDrawingChanged(oldValue, _drawing);
                    }
                }
            });

            Object.defineProperty(this, "viewportsLayout", {
                get: function () { return _viewportsLayout; },
                set: function (v) {
                    if (_viewportsLayout != v) {
                        var oldValue = _viewportsLayout;
                        _viewportsLayout = v;
                        onViewportsLayoutChanged(oldValue, _viewportsLayout);
                    }
                }
            });

            Object.defineProperty(this, "viewportsSpace", {
                get: function () { return _viewportsSpace; },
                set: function (v) {
                    if (_viewportsSpace != v) {
                        _viewportsSpace = v;
                        arrangeLayout();
                    }
                }
            });

            Object.defineProperty(this, "viewportsCount", {
                get: function () { return _viewports.length; }
            });

            Object.defineProperty(this, "currentViewport", {
                get: function () { return _currentViewport; }
            });


            Object.defineProperty(this, "getViewport", {
                value: function (index) {
                    if (index < 0 || index >= _viewports.length)
                        return null;
                    return _viewports[index];
                }
            });

            //Object.defineProperty(this, "addNewViewport", {
            //    value: function () { addViewport(new Viewport()); }
            //});
            // ctor


            _events.create("onViewportsLayoutChanged");


            init();
        }

        return VectorGraphicsView;
    })();
    lib.Vgx.VectorGraphicsView = VectorGraphicsView;

})(library);

(function (lib) {

    var ViewportsLayout;
    (function (ViewportsLayout) {
        ViewportsLayout[ViewportsLayout["ONE"] = 1] = "ONE";
        ViewportsLayout[ViewportsLayout["TWO_VERTICAL"] = 2] = "TWO_VERTICAL";
        ViewportsLayout[ViewportsLayout["TWO_HORIZONTAL"] = 3] = "TWO_HORIZONTAL";
    })(ViewportsLayout || (ViewportsLayout = {}));
    lib.Vgx.ViewportsLayout = ViewportsLayout;

})(library);


(function (window, lib) {

    var exports = {};

    // Cgx
    Object.defineProperty(exports, "LinearGradientBrush", { value: lib.Cgx.LinearGradientBrush });
    Object.defineProperty(exports, "RadialGradientBrush", { value: lib.Cgx.RadialGradientBrush });
    Object.defineProperty(exports, "PatternBrush", { value: lib.Cgx.PatternBrush });
    Object.defineProperty(exports, "CoreGraphics", { value: lib.Cgx.CoreGraphics });
    Object.defineProperty(exports, "Matrix", { value: lib.Cgx.Matrix });
    Object.defineProperty(exports, "Transform", { value: lib.Cgx.Transform });

    // Extra
    //Object.defineProperty(exports, "Events", { value: lib.Extra.Events });
    //Object.defineProperty(exports, "EventGroup", { value: lib.Extra.EventGroup });
    Object.defineProperty(exports, "Collection", { value: lib.Extra.Collection });
    Object.defineProperty(exports, "HttpClient", { value: lib.Extra.HttpClient });

    // Vgx
    Object.defineProperty(exports, "DrawingContext", { value: lib.Vgx.DrawingContext });
    Object.defineProperty(exports, "Point2D", { value: lib.Vgx.Point2D });
    Object.defineProperty(exports, "PointDefinition", { value: lib.Vgx.PointDefinition });
    Object.defineProperty(exports, "PointDefinitions", { value: lib.Vgx.PointDefinitions });
    Object.defineProperty(exports, "Rect", { value: lib.Vgx.Rect });
    Object.defineProperty(exports, "Vars", { value: lib.Vgx.Vars });
    Object.defineProperty(exports, "ViewTransform", { value: lib.Vgx.ViewTransform });
    // Vgx/objectModel
    Object.defineProperty(exports, "VgxObject", { value: lib.Vgx.Object });
    Object.defineProperty(exports, "Drawable", { value: lib.Vgx.Drawable });
    Object.defineProperty(exports, "Entity", { value: lib.Vgx.Entity });
    Object.defineProperty(exports, "Arc", { value: lib.Vgx.Arc });
    Object.defineProperty(exports, "Circle", { value: lib.Vgx.Circle });
    Object.defineProperty(exports, "CubicCurve", { value: lib.Vgx.CubicCurve });
    Object.defineProperty(exports, "Drawing", { value: lib.Vgx.Drawing });
    Object.defineProperty(exports, "Donut", { value: lib.Vgx.Donut });
    Object.defineProperty(exports, "Ellipse", { value: lib.Vgx.Ellipse });
    Object.defineProperty(exports, "Group", { value: lib.Vgx.Group });
    Object.defineProperty(exports, "Image", { value: lib.Vgx.Image });
    Object.defineProperty(exports, "Line", { value: lib.Vgx.Line });
    Object.defineProperty(exports, "Path", { value: lib.Vgx.Path });
    Object.defineProperty(exports, "Pie", { value: lib.Vgx.Pie });
    Object.defineProperty(exports, "Point", { value: lib.Vgx.Point });
    Object.defineProperty(exports, "Polygon", { value: lib.Vgx.Polygon });
    Object.defineProperty(exports, "Polyline", { value: lib.Vgx.Polyline });
    Object.defineProperty(exports, "Quad", { value: lib.Vgx.Quad });
    Object.defineProperty(exports, "QuadraticCurve", { value: lib.Vgx.QuadraticCurve });
    Object.defineProperty(exports, "Rectangle", { value: lib.Vgx.Rectangle });
    Object.defineProperty(exports, "Square", { value: lib.Vgx.Square });
    Object.defineProperty(exports, "Symbol", { value: lib.Vgx.Symbol });
    Object.defineProperty(exports, "Text", { value: lib.Vgx.Text });
    Object.defineProperty(exports, "Triangle", { value: lib.Vgx.Triangle });
    // Vgx/ui
    Object.defineProperty(exports, "VectorGraphicsView", { value: lib.Vgx.VectorGraphicsView });
    Object.defineProperty(exports, "Viewport", { value: lib.Vgx.Viewport });
    Object.defineProperty(exports, "ViewportOrientation", { value: lib.Vgx.ViewportOrientation });
    Object.defineProperty(exports, "ViewportsLayout", { value: lib.Vgx.ViewportsLayout });


    Object.defineProperty(window, "Vgx", { value: exports });

})(window, library);

delete library;