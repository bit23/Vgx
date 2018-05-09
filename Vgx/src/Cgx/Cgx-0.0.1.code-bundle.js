
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