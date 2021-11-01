var Cgx;
(function (Cgx) {
    class Animator {
        constructor(startValue, endValue, totalTime, easeFunction, onValueCallback, onCompleted) {
            this._ease = "linear";
            this._elapsedTime = 0;
            this._frameIndex = 0;
            this._isRunning = false;
            this._isCompleted = false;
            this._inputIsArray = false;
            this._inputIsObject = false;
            this._deltaValue = null;
            this._isDeltaDirty = true;
            this._startValue = startValue;
            this._endValue = endValue;
            this._totalTime = totalTime;
            this._easeFunction = easeFunction;
            this._onValueCallback = onValueCallback;
            this._onCompleted = onCompleted;
            this.reset();
        }
        computeDeltaValue() {
            if (typeof this._startValue !== typeof this._endValue) {
                throw new Error("invalid type, startValue, endValue");
            }
            this._inputIsObject = false;
            this._inputIsArray = false;
            if (this._startValue instanceof Array) {
                this._inputIsArray = true;
                if (this._startValue.length != this._endValue.length) {
                    throw new Error("invalid array length, startValue, endValue");
                }
                this._deltaValue = this._endValue.map(function (v, i) {
                    return v - this._startValue[i];
                });
            }
            else if (typeof this._startValue === "object") {
                this._inputIsObject = true;
                this._deltaValue = {};
                for (var n in this._endValue) {
                    if (this._endValue.hasOwnProperty(n)) {
                        this._deltaValue[n] = this._endValue[n] - this._startValue[n];
                    }
                }
            }
            else {
                this._deltaValue = this._endValue - this._startValue;
            }
        }
        get startValue() { return this._startValue; }
        set startValue(v) {
            if (this._startValue !== v) {
                this._startValue = v;
                this.reset();
                this._isDeltaDirty = true;
            }
        }
        get endValue() { return this._endValue; }
        set endValue(v) {
            if (this._endValue !== v) {
                this._endValue = v;
                this.reset();
                this._isDeltaDirty = true;
            }
        }
        get totalTime() { return this._totalTime; }
        set totalTime(v) {
            if (this._totalTime !== v) {
                this.reset();
                this._totalTime = v;
            }
        }
        get ease() { return this._ease; }
        set ease(v) {
            if (this._ease !== v) {
                this._ease = v;
                this._easeFunction = Cgx.Ease.getEasingFunctionOrDefault(this._ease);
            }
        }
        get isCompleted() { return this._isCompleted; }
        get elapsedTime() { return this._elapsedTime; }
        get frameIndex() { return this._frameIndex; }
        provideValue() {
            var lt = this._elapsedTime / this._totalTime;
            var lv = this._easeFunction(lt);
            if (this._inputIsArray) {
                return this._deltaValue.map(function (v, i) {
                    return this._startValue[i] + (lv * v);
                });
            }
            else if (this._inputIsObject) {
                var result = {};
                for (var n in this._deltaValue) {
                    if (this._deltaValue.hasOwnProperty(n)) {
                        result[n] = this._startValue[n] + (lv * this._deltaValue[n]);
                    }
                }
                return result;
            }
            else {
                return this._startValue + (lv * this._deltaValue);
            }
        }
        notifyFrame(timeStamp) {
            if (this._isRunning) {
                if (!this._lastTimeStamp) {
                    this._lastTimeStamp = timeStamp;
                }
                this._elapsedTime += (timeStamp - this._lastTimeStamp);
                if (this._elapsedTime > this._totalTime) {
                    this.stop();
                    this._isCompleted = true;
                    this._onCompleted();
                    return;
                }
                this._lastTimeStamp = timeStamp;
                this._frameIndex++;
                this._onValueCallback(this.provideValue());
            }
        }
        start() {
            if (this._isRunning) {
                return;
            }
            if (!this._deltaValue || this._isDeltaDirty) {
                this.computeDeltaValue();
            }
            this._isRunning = true;
        }
        stop() {
            if (!this._isRunning) {
                return;
            }
            this._isRunning = false;
        }
        restart() {
            this.reset();
            this.start();
        }
        reset() {
            if (this._isRunning) {
                this.stop();
            }
            this._lastTimeStamp = null;
            this._elapsedTime = 0;
            this._frameIndex = 0;
            this._isCompleted = false;
        }
    }
    Cgx.Animator = Animator;
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    class Brush {
    }
    Cgx.Brush = Brush;
    class GradientBrush extends Brush {
        constructor() {
            super(...arguments);
            this._colorStops = [];
        }
        addColorStop(offset, color) {
            this._colorStops.push({ offset, color });
        }
        getColorStops() {
            return this._colorStops.slice(0);
        }
    }
    Cgx.GradientBrush = GradientBrush;
    class LinearGradientBrush extends GradientBrush {
        constructor() {
            super(...arguments);
            this.brushType = "linear";
            this.x0 = 0;
            this.y0 = 0;
            this.x1 = 100;
            this.y1 = 100;
        }
        clone() {
            const result = new LinearGradientBrush();
            result._colorStops = this._colorStops.slice(0);
            result.x0 = this.x0;
            result.y0 = this.y0;
            result.x1 = this.x1;
            result.y1 = this.y1;
            return result;
        }
    }
    Cgx.LinearGradientBrush = LinearGradientBrush;
    class RadialGradientBrush extends GradientBrush {
        constructor() {
            super(...arguments);
            this.brushType = "radial";
            this.x0 = 0;
            this.y0 = 0;
            this.r0 = 0;
            this.x1 = 100;
            this.y1 = 100;
            this.r1 = 0;
        }
        clone() {
            const result = new RadialGradientBrush();
            result._colorStops = this._colorStops.slice(0);
            result.x0 = this.x0;
            result.y0 = this.y0;
            result.r0 = this.r0;
            result.x1 = this.x1;
            result.y1 = this.y1;
            result.r1 = this.r1;
            return result;
        }
    }
    Cgx.RadialGradientBrush = RadialGradientBrush;
    class PatternBrush extends Brush {
        constructor() {
            super(...arguments);
            this.brushType = "pattern";
            this.image = null;
            this.repetition = "repeat";
        }
        clone() {
            const result = new PatternBrush();
            result.image = this.image.cloneNode();
            result.repetition = this.repetition;
            return result;
        }
    }
    Cgx.PatternBrush = PatternBrush;
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    class CoreGraphics {
        constructor(target) {
            this._fill = 0xffffffff;
            this._stroke = 0xff000000;
            this._strokeWidth = 1;
            this._textLineHeight = "1.5em";
            this._fontWeight = "normal";
            this._fontStyle = "normal";
            this._fontSize = "16px";
            this._fontFamily = "sans-serif";
            this._textAlign = "left";
            this._textBaseline = "bottom";
            this.FULL_ANGLE = 2 * Math.PI;
            if (target instanceof Cgx.GraphicsRenderer) {
                this._renderer = target;
                this._canvasBuffer = this._renderer.canvas;
            }
            else {
                this._canvasBuffer = target;
                this._renderer = Cgx.Engine.createDefaultRenderer(this._canvasBuffer);
            }
            this._transformManager = new Cgx.TransformManager(this._renderer);
        }
        applyEntityTransform(transform, insertPointX, insertPointY) {
            this._renderer.translate(insertPointX, insertPointY);
            var mtx;
            if (transform) {
                this._renderer.translate(transform.originX, transform.originY);
                mtx = transform.getMatrix();
                this._renderer.transform(mtx.m11, mtx.m12, mtx.m21, mtx.m22, mtx.offsetX, mtx.offsetY);
                this._renderer.translate(-transform.originX, -transform.originY);
            }
            this._renderer.translate(-insertPointX, -insertPointY);
        }
        createCanvasColorOrBrush(value) {
            if (typeof (value) === "number") {
                return "#" + value.toString(16);
            }
            else if (typeof (value) === "string") {
                return value;
            }
            else if (value instanceof Array) {
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
            else if (value instanceof Cgx.GradientBrush) {
                var result;
                if (value instanceof Cgx.LinearGradientBrush) {
                    result = this._renderer.createLinearGradient(value.x0, value.y0, value.x1, value.y1);
                }
                else if (value instanceof Cgx.RadialGradientBrush) {
                    result = this._renderer.createRadialGradient(value.x0, value.y0, value.r0, value.x1, value.y1, value.r1);
                }
                var colorStops = value.getColorStops();
                for (var i = 0; i < colorStops.length; i++) {
                    result.addColorStop(colorStops[i].offset, colorStops[i].color);
                }
                return result;
            }
            else if (value instanceof Cgx.PatternBrush) {
                return this._renderer.createPattern(value.image, value.repetition);
            }
            return value;
        }
        get canvasBuffer() {
            return this._canvasBuffer;
        }
        get renderer() {
            return this._renderer;
        }
        get shadow() {
            return this._shadow;
        }
        set shadow(v) {
            this._shadow = v;
            if (v) {
                this._renderer.shadowBlur = v.blur;
                this._renderer.shadowOffsetX = v.offsetX;
                this._renderer.shadowOffsetY = v.offsetY;
                this._renderer.shadowColor = v.color;
            }
            else {
                this._renderer.shadowBlur = 0;
                this._renderer.shadowOffsetX = 0;
                this._renderer.shadowOffsetY = 0;
                this._renderer.shadowColor = "transparent";
            }
        }
        get fillBrush() {
            return this._fill;
        }
        set fillBrush(v) {
            this._fill = v;
            this._renderer.fillStyle = this.createCanvasColorOrBrush(v);
        }
        get strokeBrush() {
            return this._stroke;
        }
        set strokeBrush(v) {
            this._stroke = v;
            this._renderer.strokeStyle = this.createCanvasColorOrBrush(v);
        }
        get strokeWidth() {
            return this._strokeWidth;
        }
        set strokeWidth(v) {
            this._strokeWidth = v;
            this._renderer.lineWidth = v;
        }
        get fontFamily() {
            return this._fontFamily;
        }
        set fontFamily(v) {
            this._fontFamily = v;
            this._renderer.fontFamily = v;
        }
        get textLineHeight() {
            return this._textLineHeight;
        }
        set textLineHeight(v) {
            this._textLineHeight = v;
            this._renderer.textLineHeight = v;
        }
        get fontSize() {
            return this._fontSize;
        }
        set fontSize(v) {
            this._fontSize = v;
            this._renderer.fontSize = v;
        }
        get fontStyle() {
            return this._fontStyle;
        }
        set fontStyle(v) {
            this._fontStyle = v;
            this._renderer.fontStyle = v;
        }
        get fontWeight() {
            return this._fontWeight;
        }
        set fontWeight(v) {
            this._fontWeight = v;
            this._renderer.fontWeight = v;
        }
        get textAlign() {
            return this._textAlign;
        }
        set textAlign(v) {
            this._textAlign = v;
            this._renderer.textAlign = v;
        }
        get textBaseline() {
            return this._textBaseline;
        }
        set textBaseline(v) {
            this._textBaseline = v;
            this._renderer.textBaseline = v;
        }
        getImageData(sx, sy, sw, sh) {
            return this._renderer.getImageData(sx, sy, sw, sh);
        }
        putImageData(imageData, x, y) {
            return this._renderer.putImageData(imageData, x, y);
        }
        getDataURL(type, quality) {
            return this._renderer.toDataURL(type, quality);
        }
        pushTransform(transform) {
            this._transformManager.push(transform);
        }
        popTransform() {
            this._transformManager.pop();
        }
        measureText(text) {
            return this._renderer.measureText(text);
        }
        clear(fillBrush) {
            this.clearRect(0, 0, this._renderer.canvas.width, this._renderer.canvas.height, fillBrush);
        }
        clearRect(x, y, width, height, fillBrush) {
            var fillStyle = null;
            if (typeof fillBrush !== "undefined" && fillBrush !== null) {
                fillStyle = this.createCanvasColorOrBrush(fillBrush);
            }
            this._renderer.clearRect(x, y, width, height, fillStyle);
        }
        clipRect(x, y, width, height) {
            this._renderer.beginPath();
            this._renderer.rect(x, y, width, height);
            this._renderer.clip();
        }
        drawArc(cx, cy, radius, startAngle, endAngle, isAntiClockwise, transform) {
            if (!this._stroke || this._strokeWidth == 0)
                return;
            this._renderer.saveState();
            this.applyEntityTransform(transform, cx, cy);
            this._renderer.beginPath();
            this._renderer.arc(cx, cy, radius, 0, startAngle, endAngle, !!isAntiClockwise);
            this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawLine(x1, y1, x2, y2, transform) {
            if (!this._stroke || this._strokeWidth == 0)
                return;
            this._renderer.saveState();
            this.applyEntityTransform(transform, x1, y1);
            this._renderer.beginPath();
            this._renderer.moveTo(x1, y1);
            this._renderer.lineTo(x2, y2);
            this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawRoundedRectangle(x, y, width, height, cornersRadius, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
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
            this._renderer.saveState();
            this.applyEntityTransform(transform, x, y);
            this._renderer.beginPath();
            var currentX = x;
            var currentY = y;
            if (topLeftCorner == 0) {
                this._renderer.moveTo(currentX, currentY);
            }
            else {
                this._renderer.moveTo(currentX + topLeftCorner, currentY);
            }
            currentX = x + width;
            if (topRightCorner == 0) {
                this._renderer.lineTo(currentX, currentY);
            }
            else {
                this._renderer.lineTo(currentX - topRightCorner, currentY);
                this._renderer.arcTo(currentX, currentY, currentX, currentY + topRightCorner, topRightCorner);
            }
            currentY = y + height;
            if (bottomRightCorner == 0) {
                this._renderer.lineTo(currentX, currentY);
            }
            else {
                this._renderer.lineTo(currentX, currentY - bottomRightCorner);
                this._renderer.arcTo(currentX, currentY, currentX - bottomRightCorner, currentY, bottomRightCorner);
            }
            currentX = x;
            if (bottomLeftCorner == 0) {
                this._renderer.lineTo(currentX, currentY);
            }
            else {
                this._renderer.lineTo(currentX + bottomLeftCorner, currentY);
                this._renderer.arcTo(currentX, currentY, currentX, currentY - bottomLeftCorner, bottomLeftCorner);
            }
            currentY = y;
            if (topLeftCorner == 0) {
                this._renderer.lineTo(currentX, currentY);
            }
            else {
                this._renderer.lineTo(currentX, currentY + topLeftCorner);
                this._renderer.arcTo(currentX, currentY, currentX + topRightCorner, currentY, topLeftCorner);
            }
            this._renderer.closePath();
            if (this._fill)
                this._renderer.fill();
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawSquare(x, y, size, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
                return;
            this._renderer.saveState();
            this.applyEntityTransform(transform, x, y);
            this._renderer.beginPath();
            this._renderer.square(x, y, size);
            if (this._fill)
                this._renderer.fill();
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawRectangle(x, y, width, height, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
                return;
            this._renderer.saveState();
            this.applyEntityTransform(transform, x, y);
            this._renderer.beginPath();
            this._renderer.rect(x, y, width, height);
            if (this._fill)
                this._renderer.fill();
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawCircle(cx, cy, radius, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
                return;
            this._renderer.saveState();
            this.applyEntityTransform(transform, cx, cy);
            this._renderer.beginPath();
            this._renderer.circle(cx, cy, radius);
            if (this._fill)
                this._renderer.fill();
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawEllipse(cx, cy, radiusX, radiusY, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
                return;
            this._renderer.saveState();
            this.applyEntityTransform(transform, cx, cy);
            this._renderer.beginPath();
            this._renderer.ellipse(cx, cy, radiusX, radiusY);
            if (this._fill)
                this._renderer.fill();
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawPolyline(points, transform) {
            if (!this._stroke || this._strokeWidth == 0)
                return;
            var p0x = points[0].x;
            var p0y = points[0].y;
            this._renderer.saveState();
            this.applyEntityTransform(transform, p0x, p0y);
            this._renderer.beginPath();
            this._renderer.moveTo(p0x, p0y);
            for (var i = 1; i < points.length; i++) {
                var p = points[i];
                this._renderer.lineTo(p.x, p.y);
            }
            this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawPolygon(points, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
                return;
            var p0x = points[0].x;
            var p0y = points[0].y;
            this._renderer.saveState();
            this.applyEntityTransform(transform, p0x, p0y);
            this._renderer.beginPath();
            this._renderer.moveTo(p0x, p0y);
            for (var i = 1; i < points.length; i++) {
                var p = points[i];
                this._renderer.lineTo(p.x, p.y);
            }
            this._renderer.closePath();
            if (this._fill)
                this._renderer.fill();
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawTriangle(point1, point2, point3, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
                return;
            this._renderer.saveState();
            this.applyEntityTransform(transform, point1.x, point1.y);
            this._renderer.beginPath();
            this._renderer.moveTo(point1.x, point1.y);
            this._renderer.lineTo(point2.x, point2.y);
            this._renderer.lineTo(point3.x, point3.y);
            this._renderer.closePath();
            if (this._fill)
                this._renderer.fill();
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawQuad(point1, point2, point3, point4, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
                return;
            this._renderer.saveState();
            this.applyEntityTransform(transform, point1.x, point1.y);
            this._renderer.beginPath();
            this._renderer.moveTo(point1.x, point1.y);
            this._renderer.lineTo(point2.x, point2.y);
            this._renderer.lineTo(point3.x, point3.y);
            this._renderer.lineTo(point4.x, point4.y);
            this._renderer.closePath();
            if (this._fill)
                this._renderer.fill();
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawCubicCurve(points, controlPoints1, controlPoints2, isClosed, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
                return;
            var p0x = points[0].x;
            var p0y = points[0].y;
            this._renderer.saveState();
            this.applyEntityTransform(transform, p0x, p0y);
            points.push(points[0]);
            this._renderer.beginPath();
            this._renderer.moveTo(p0x, p0y);
            for (var i = 0; i < controlPoints1.length; i++) {
                var c1 = controlPoints1[i];
                var c2 = controlPoints2[i];
                var p = points[i + 1];
                this._renderer.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p.x, p.y);
            }
            if (isClosed)
                this._renderer.closePath();
            if (this._fill)
                this._renderer.fill();
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawQuadraticCurve(points, controlPoints, isClosed, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
                return;
            var p0x = points[0].x;
            var p0y = points[0].y;
            this._renderer.saveState();
            this.applyEntityTransform(transform, p0x, p0y);
            points.push(points[0]);
            this._renderer.beginPath();
            this._renderer.moveTo(p0x, p0y);
            for (var i = 0; i < controlPoints.length; i++) {
                var c1 = controlPoints[i];
                var p = points[i + 1];
                this._renderer.quadraticCurveTo(c1.x, c1.y, p.x, p.y);
            }
            if (isClosed)
                this._renderer.closePath();
            if (this._fill)
                this._renderer.fill();
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawImage(image, x, y, width, height, transform) {
            if (!image && (!this._stroke || this._strokeWidth == 0))
                return;
            this._renderer.saveState();
            this.applyEntityTransform(transform, x, y);
            this._renderer.drawImage(image, x, y, width, height);
            if (this._stroke && this._strokeWidth > 0) {
                this._renderer.beginPath();
                this._renderer.rect(x, y, width, height);
                this._renderer.stroke();
            }
            this._renderer.restoreState();
        }
        drawText(x, y, text, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
                return;
            this._renderer.saveState();
            this.applyEntityTransform(transform, x, y);
            if (this._fill)
                this._renderer.fillText(text, x, y);
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.strokeText(text, x, y);
            this._renderer.restoreState();
        }
        drawPath2D(x, y, path2D, fillRule, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
                return;
            this._renderer.saveState();
            this.applyEntityTransform(transform, x, y);
            this._renderer.translate(x, y);
            if (this._fill)
                this._renderer.fillPath2D(path2D, fillRule);
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.strokePath2D(path2D);
            this._renderer.restoreState();
        }
        drawPie(cx, cy, radius, startAngle, endAngle, isAntiClockwise, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
                return;
            var deltaAngle = endAngle - startAngle;
            if (deltaAngle >= this.FULL_ANGLE) {
                this.drawCircle(cx, cy, radius, transform);
                return;
            }
            this._renderer.saveState();
            this.applyEntityTransform(transform, cx, cy);
            this._renderer.beginPath();
            this._renderer.moveTo(cx, cy);
            this._renderer.arc(cx, cy, radius, 0, startAngle, endAngle, !!isAntiClockwise);
            this._renderer.closePath();
            if (this._fill)
                this._renderer.fill();
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawDonut(cx, cy, startRadius, endRadius, startAngle, endAngle, isAntiClockwise, transform) {
            if (!this._fill && (!this._stroke || this._strokeWidth == 0))
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
            }
            var deltaAngle = endAngle - startAngle;
            if (deltaAngle >= this.FULL_ANGLE) {
                isClosed = true;
            }
            if (!hasHole) {
                if (isClosed) {
                    this.drawCircle(cx, cy, endRadius, transform);
                    return;
                }
                else {
                    this.drawPie(cx, cy, endRadius, startAngle, endAngle, false, transform);
                    return;
                }
            }
            this._renderer.saveState();
            this.applyEntityTransform(transform, cx, cy);
            this._renderer.beginPath();
            if (isClosed) {
                this._renderer.circle(cx, cy, endRadius);
                this._renderer.circle(cx, cy, startRadius);
            }
            else {
                this._renderer.arc(cx, cy, endRadius, 0, startAngle, endAngle, !!isAntiClockwise);
                this._renderer.arc(cx, cy, startRadius, 0, endAngle, startAngle, !isAntiClockwise);
                this._renderer.closePath();
            }
            if (this._fill)
                this._renderer.fill("evenodd");
            if (this._stroke && this._strokeWidth > 0)
                this._renderer.stroke();
            this._renderer.restoreState();
        }
        drawSymbol(x, y, width, height, symbolData) {
            this._renderer.saveState();
            if (!symbolData && (!this._stroke || this._strokeWidth == 0))
                return;
            this._renderer.drawImage(symbolData, x, y, width, height);
            this._renderer.restoreState();
        }
    }
    Cgx.CoreGraphics = CoreGraphics;
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    class BufferedGraphics extends Cgx.CoreGraphics {
        constructor(target) {
            super(target);
        }
        commitTo(canvasOrBitmapRenderer) {
            let bitmap = this.canvasBuffer.transferToImageBitmap();
            let bitmapRenderer;
            if (canvasOrBitmapRenderer instanceof HTMLCanvasElement) {
                bitmapRenderer = canvasOrBitmapRenderer.getContext("bitmaprenderer");
            }
            else {
                bitmapRenderer = canvasOrBitmapRenderer;
            }
            bitmapRenderer.transferFromImageBitmap(bitmap);
        }
        convertToBlob(type, quality) {
            return this.canvasBuffer.convertToBlob({
                type,
                quality
            });
        }
        convertToObjectURL(type, quality) {
            return this.convertToBlob(type, quality)
                .then(res => {
                return URL.createObjectURL(res);
            });
        }
    }
    Cgx.BufferedGraphics = BufferedGraphics;
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    class GraphicsRenderer {
        constructor(canvas) {
            this.canvas = canvas;
        }
    }
    GraphicsRenderer.support = (() => {
        return {};
    })();
    GraphicsRenderer.defaultValues = {
        get globalAlpha() { return 1.0; },
        get globalCompositeOperation() { return "source-over"; },
        get fillStyle() { return "#000"; },
        get strokeStyle() { return "#000"; },
        get shadowBlur() { return 0; },
        get shadowColor() { return "#000"; },
        get shadowOffsetX() { return 0; },
        get shadowOffsetY() { return 0; },
        get lineCap() { return "butt"; },
        get lineJoin() { return "miter"; },
        get lineWidth() { return 1.0; },
        get miterLimit() { return 10.0; },
        get lineDashOffset() { return 0; },
        get textLineHeight() { return "1.5em"; },
        get fontStyle() { return "normal"; },
        get fontWeight() { return "normal"; },
        get fontSize() { return "16px"; },
        get fontFamily() { return "sans-serif"; },
        get textAlign() { return "left"; },
        get textBaseline() { return "bottom"; },
        get direction() { return "inherit"; },
        get imageSmoothingEnabled() { return true; }
    };
    Cgx.GraphicsRenderer = GraphicsRenderer;
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    class CanvasRenderer extends Cgx.GraphicsRenderer {
        constructor(canvas) {
            super(canvas);
            this.name = "CanvasRenderer";
            this._context = canvas.getContext("2d");
            this.setDefaultValues();
            this._context.translate(-0.5, -0.5);
        }
        setDefaultValues() {
            this.globalAlpha = Cgx.GraphicsRenderer.defaultValues.globalAlpha;
            this.globalCompositeOperation = Cgx.GraphicsRenderer.defaultValues.globalCompositeOperation;
            this.fillStyle = Cgx.GraphicsRenderer.defaultValues.fillStyle;
            this.strokeStyle = Cgx.GraphicsRenderer.defaultValues.strokeStyle;
            this.shadowBlur = Cgx.GraphicsRenderer.defaultValues.shadowBlur;
            this.shadowColor = Cgx.GraphicsRenderer.defaultValues.shadowColor;
            this.shadowOffsetX = Cgx.GraphicsRenderer.defaultValues.shadowOffsetX;
            this.shadowOffsetY = Cgx.GraphicsRenderer.defaultValues.shadowOffsetY;
            this.lineCap = Cgx.GraphicsRenderer.defaultValues.lineCap;
            this.lineJoin = Cgx.GraphicsRenderer.defaultValues.lineJoin;
            this.lineWidth = Cgx.GraphicsRenderer.defaultValues.lineWidth;
            this.miterLimit = Cgx.GraphicsRenderer.defaultValues.miterLimit;
            this.lineDashOffset = Cgx.GraphicsRenderer.defaultValues.lineDashOffset;
            this.textLineHeight = Cgx.GraphicsRenderer.defaultValues.textLineHeight;
            this.fontStyle = Cgx.GraphicsRenderer.defaultValues.fontStyle;
            this.fontWeight = Cgx.GraphicsRenderer.defaultValues.fontWeight;
            this.fontSize = Cgx.GraphicsRenderer.defaultValues.fontSize;
            this.fontFamily = Cgx.GraphicsRenderer.defaultValues.fontFamily;
            this.textAlign = Cgx.GraphicsRenderer.defaultValues.textAlign;
            this.textBaseline = Cgx.GraphicsRenderer.defaultValues.textBaseline;
            this.direction = Cgx.GraphicsRenderer.defaultValues.direction;
            this.imageSmoothingEnabled = Cgx.GraphicsRenderer.defaultValues.imageSmoothingEnabled;
        }
        ellipsePath(cx, cy, rx, ry, otpRotation, startAngle, endAngle) {
            otpRotation = otpRotation || 0;
            startAngle = startAngle || 0;
            endAngle = endAngle || 2 * Math.PI;
            var halfRadiusX = rx * 0.545;
            var halfRadiusY = ry * 0.545;
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
            this.moveTo(pA.x, pA.y);
            this.bezierCurveTo(c1B.x, c1B.y, c2B.x, c2B.y, pB.x, pB.y);
            this.bezierCurveTo(c1C.x, c1C.y, c2C.x, c2C.y, pC.x, pC.y);
            this.bezierCurveTo(c1D.x, c1D.y, c2D.x, c2D.y, pD.x, pD.y);
            this.bezierCurveTo(c1A.x, c1A.y, c2A.x, c2A.y, pA.x, pA.y);
            this.closePath();
        }
        buildFontValue() {
            const values = [];
            if (this.fontStyle) {
                values.push(this.fontStyle);
            }
            if (this.fontWeight) {
                values.push(this.fontWeight);
            }
            if (this.textLineHeight) {
                values.push(`${this.fontSize}/${this.textLineHeight}`);
            }
            else {
                values.push(this.fontSize);
            }
            values.push(this.fontFamily);
            return values.join(" ");
        }
        get globalAlpha() {
            return this._context.globalAlpha;
        }
        set globalAlpha(value) {
            this._context.globalAlpha = value;
        }
        get globalCompositeOperation() {
            return this._context.globalCompositeOperation;
        }
        set globalCompositeOperation(value) {
            this._context.globalCompositeOperation = value;
        }
        get fillStyle() {
            return this._context.fillStyle;
        }
        set fillStyle(value) {
            this._context.fillStyle = value;
        }
        get strokeStyle() {
            return this._context.strokeStyle;
        }
        set strokeStyle(value) {
            this._context.strokeStyle = value;
        }
        get shadowBlur() {
            return this._context.shadowBlur;
        }
        set shadowBlur(value) {
            this._context.shadowBlur = value;
        }
        get shadowColor() {
            return this._context.shadowColor;
        }
        set shadowColor(value) {
            this._context.shadowColor = value;
        }
        get shadowOffsetX() {
            return this._context.shadowOffsetX;
        }
        set shadowOffsetX(value) {
            this._context.shadowOffsetX = value;
        }
        get shadowOffsetY() {
            return this._context.shadowOffsetY;
        }
        set shadowOffsetY(value) {
            this._context.shadowOffsetY = value;
        }
        createLinearGradient(x0, y0, x1, y1) {
            return this._context.createLinearGradient(x0, y0, x1, y1);
        }
        createRadialGradient(x0, y0, r0, x1, y1, r1) {
            return this._context.createRadialGradient(x0, y0, r0, x1, y1, r1);
        }
        createPattern(image, repetition) {
            return this._context.createPattern(image, repetition);
        }
        get lineCap() {
            return this._context.lineCap;
        }
        set lineCap(value) {
            this._context.lineCap = value;
        }
        get lineJoin() {
            return this._context.lineJoin;
        }
        set lineJoin(value) {
            this._context.lineJoin = value;
        }
        get lineWidth() {
            return this._context.lineWidth;
        }
        set lineWidth(value) {
            this._context.lineWidth = value;
        }
        get miterLimit() {
            return this._context.miterLimit;
        }
        set miterLimit(value) {
            this._context.miterLimit = value;
        }
        get lineDashOffset() {
            return this._context.lineDashOffset;
        }
        set lineDashOffset(value) {
            this._context.lineDashOffset = value;
        }
        getLineDash() {
            return this._context.getLineDash();
        }
        setLineDash(segments) {
            this._context.setLineDash(segments);
        }
        get textLineHeight() {
            return this._textLineHeight;
        }
        set textLineHeight(value) {
            this._textLineHeight = value;
            this._context.font = this.buildFontValue();
        }
        get fontSize() {
            return this._fontSize;
        }
        set fontSize(value) {
            this._fontSize = value;
            this._context.font = this.buildFontValue();
        }
        get fontStyle() {
            return this._fontStyle;
        }
        set fontStyle(value) {
            this._fontStyle = value;
            this._context.font = this.buildFontValue();
        }
        get fontWeight() {
            return this._fontWeight;
        }
        set fontWeight(value) {
            this._fontWeight = value;
            this._context.font = this.buildFontValue();
        }
        get fontFamily() {
            return this._fontFamily;
        }
        set fontFamily(value) {
            this._fontFamily = value;
            this._context.font = this.buildFontValue();
        }
        get textAlign() {
            return this._context.textAlign;
        }
        set textAlign(value) {
            this._context.textAlign = value;
        }
        get textBaseline() {
            return this._context.textBaseline;
        }
        set textBaseline(value) {
            this._context.textBaseline = value;
        }
        get direction() {
            return this._context.direction;
        }
        set direction(value) {
            this._context.direction = value;
        }
        saveState() {
            this._context.save();
        }
        restoreState() {
            this._context.restore();
        }
        toDataURL(type, quality) {
            if (this.canvas instanceof HTMLCanvasElement) {
                return this.canvas.toDataURL(type, quality);
            }
            else {
                const imageData = this._context.getImageData(0, 0, this.canvas.width, this.canvas.height);
                const canvasGraphics = Cgx.Engine.createGraphics(this.canvas.width, this.canvas.height);
                canvasGraphics.putImageData(imageData, 0, 0);
                return canvasGraphics.getDataURL(type, quality);
            }
        }
        clearRect(x, y, width, height, fillStyle) {
            if (typeof fillStyle === "undefined" || fillStyle === null) {
                this._context.clearRect(x, y, width, height);
            }
            else {
                this._context.fillStyle = fillStyle;
                this._context.fillRect(x, y, width, height);
            }
        }
        strokeRect(x, y, width, height) {
            this._context.strokeRect(x, y, width, height);
        }
        fillRect(x, y, width, height) {
            this._context.fillRect(x, y, width, height);
        }
        stroke() {
            this._context.stroke();
        }
        fill(fillRule) {
            this._context.fill(fillRule);
        }
        strokePath2D(path2D) {
            this._context.stroke(path2D);
        }
        fillPath2D(path2D, fillRule) {
            this._context.fill(path2D, fillRule);
        }
        clip() {
            this._context.clip();
        }
        rect(x, y, width, height) {
            this._context.rect(x, y, width, height);
        }
        square(x, y, size) {
            this._context.rect(x, y, size, size);
        }
        ellipse(x, y, rx, ry, rotation, startAngle, endAngle) {
            if (CanvasRenderer.support.ellipseDrawing) {
                rotation = rotation || 0;
                startAngle = startAngle || 0;
                endAngle = endAngle || 2 * Math.PI;
                this._context.ellipse(x, y, rx, ry, rotation, startAngle, endAngle);
            }
            else {
                this.ellipsePath(x, y, rx, ry, rotation, startAngle, endAngle);
            }
        }
        circle(x, y, r) {
            if (CanvasRenderer.support.ellipseDrawing) {
                this._context.ellipse(x, y, r, r, 0, 0, 2 * Math.PI);
            }
            else {
                this._context.arc(x, y, r, 0, 2 * Math.PI, false);
            }
        }
        arc(x, y, r, rotation, startAngle, endAngle, anticlockwise) {
            this._context.arc(x, y, r, startAngle, endAngle, anticlockwise);
        }
        beginPath() {
            this._context.beginPath();
        }
        closePath() {
            this._context.closePath();
        }
        arcTo(x1, y1, x2, y2, radius) {
            this._context.arcTo(x1, y1, x2, y2, radius);
        }
        moveTo(x, y) {
            this._context.moveTo(x, y);
        }
        lineTo(x, y) {
            this._context.lineTo(x, y);
        }
        bezierCurveTo(c1x, c1y, c2x, c2y, x, y) {
            this._context.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
        }
        quadraticCurveTo(cx, cy, x, y) {
            this._context.quadraticCurveTo(cx, cy, x, y);
        }
        isPointInPath(x, y, fillRule) {
            return this._context.isPointInPath(x, y, fillRule);
        }
        isPointInPath2D(path2D, x, y, fillRule) {
            return this._context.isPointInPath(path2D, x, y, fillRule);
        }
        isPointInStroke(x, y) {
            return this._context.isPointInStroke(x, y);
        }
        isPointInPath2DStroke(path2D, x, y) {
            return this._context.isPointInStroke(path2D, x, y);
        }
        addHitRegion(options) {
            if (CanvasRenderer.support.addHitRegion) {
                this._context.addHitRegion(options);
            }
            else {
                console.log("unsupported function 'addHitRegion'");
            }
        }
        removeHitRegion(id) {
            if (CanvasRenderer.support.removeHitRegion) {
                this._context.removeHitRegion(id);
            }
            else {
                console.log("unsupported function 'removeHitRegion'");
            }
        }
        clearHitRegions() {
            if (CanvasRenderer.support.clearHitRegion) {
                this._context.clearHitRegions();
            }
            else {
                console.log("unsupported function 'clearHitRegions'");
            }
        }
        drawImage(img, x, y, width, height, sx, sy, sw, sh) {
            if (sx != null && sy != null && sw != null && sh != null) {
                this._context.drawImage(img, x, y, width, height, sx, sy, sw, sh);
            }
            else {
                this._context.drawImage(img, x, y, width, height);
            }
        }
        createImageData(width, height) {
            return this._context.createImageData(width, height);
        }
        cloneImageData(imageData) {
            var imageDataArrayCopy = new Uint8ClampedArray(imageData.data);
            imageDataArrayCopy.set(imageData.data);
            return new ImageData(imageDataArrayCopy, imageData.width, imageData.height);
        }
        getImageData(sx, sy, sw, sh) {
            sx = sx || 0;
            sy = sy || 0;
            sw = sw || this._context.canvas.width;
            sh = sh || this._context.canvas.height;
            return this._context.getImageData(sx, sy, sw, sh);
        }
        putImageData(imageData, x, y) {
            this._context.putImageData(imageData, x, y);
        }
        get imageSmoothingEnabled() {
            return this._context.mozImageSmoothingEnabled || this._context.webkitImageSmoothingEnabled || this._context.msImageSmoothingEnabled || this._context.imageSmoothingEnabled;
        }
        set imageSmoothingEnabled(v) {
            this._context.mozImageSmoothingEnabled = v;
            this._context.webkitImageSmoothingEnabled = v;
            this._context.msImageSmoothingEnabled = v;
            this._context.imageSmoothingEnabled = v;
        }
        fillText(text, x, y, maxWidth) {
            this._context.fillText(text, x, y, maxWidth);
        }
        strokeText(text, x, y, maxWidth) {
            this._context.strokeText(text, x, y, maxWidth);
        }
        measureText(text) {
            return this._context.measureText(text);
        }
        rotate(angle) {
            this._context.rotate(angle);
        }
        translate(dx, dy) {
            this._context.translate(dx, dy);
        }
        scale(x, y) {
            this._context.scale(x, y);
        }
        transform(a, b, c, d, e, f) {
            this._context.transform(a, b, c, d, e, f);
        }
        setTransform(a, b, c, d, e, f) {
            this._context.setTransform(a, b, c, d, e, f);
        }
        resetTransform() {
            this._context.setTransform(1, 0, 0, 1, 0, 0);
        }
        ;
        drawFocusIfNeeded(element) {
            this._context.drawFocusIfNeeded(element);
        }
    }
    CanvasRenderer.support = (() => {
        return {
            ellipseDrawing: "ellipse" in CanvasRenderingContext2D.prototype,
            addHitRegion: "addHitRegion" in CanvasRenderingContext2D.prototype,
            removeHitRegion: "removeHitRegion" in CanvasRenderingContext2D.prototype,
            clearHitRegion: "clearHitRegions" in CanvasRenderingContext2D.prototype
        };
    })();
    Cgx.CanvasRenderer = CanvasRenderer;
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    class Ease {
        static getEaseFunctionNames() {
            return this.easeFunctions.slice(0);
        }
        static getEasingFunctionOrDefault(easing) {
            if (easing in Ease) {
                return Ease[easing];
            }
            return Ease.linear;
        }
        static linear(t) {
            return t;
        }
        static quadraticIn(t) {
            return Math.pow(t, 2);
        }
        static quadraticOut(t) {
            return 1 - Math.pow(1 - t, 2);
        }
        static quadraticInOut(t) {
            if (t < 0.5) {
                t *= 2;
                return Math.pow(t, 2) * 0.5;
            }
            else {
                t = (t - 0.5) * 2;
                return ((1 - Math.pow(1 - t, 2)) * 0.5) + 0.5;
            }
        }
        static cubicIn(t) {
            return Math.pow(t, 3);
        }
        static cubicOut(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        static cubicInOut(t) {
            if (t < 0.5) {
                t *= 2;
                return Math.pow(t, 3) * 0.5;
            }
            else {
                t = (t - 0.5) * 2;
                return ((1 - Math.pow(1 - t, 3)) * 0.5) + 0.5;
            }
        }
        static quarticIn(t) {
            return Math.pow(t, 4);
        }
        static quarticOut(t) {
            return 1 - Math.pow(1 - t, 4);
        }
        static quarticInOut(t) {
            if (t < 0.5) {
                t *= 2;
                return Math.pow(t, 4) * 0.5;
            }
            else {
                t = (t - 0.5) * 2;
                return ((1 - Math.pow(1 - t, 4)) * 0.5) + 0.5;
            }
        }
        static quinticIn(t) {
            return Math.pow(t, 5);
        }
        static quinticOut(t) {
            return 1 - Math.pow(1 - t, 5);
        }
        static quinticInOut(t) {
            if (t < 0.5) {
                t *= 2;
                return Math.pow(t, 5) * 0.5;
            }
            else {
                t = (t - 0.5) * 2;
                return ((1 - Math.pow(1 - t, 5)) * 0.5) + 0.5;
            }
        }
        static sineIn(t) {
            return -Math.cos(t * Math.PI * 0.5) + 1;
        }
        static sineOut(t) {
            return Math.sin(t * Math.PI * 0.5);
        }
        static sineInOut(t) {
            return -0.5 * (Math.cos(t * Math.PI) - 1);
        }
        static expoIn(t) {
            return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
        }
        static expoOut(t) {
            return (t == 1) ? 1 : -Math.pow(2, -10 * t) + 1;
        }
        static expoInOut(t) {
            if (t == 0)
                return 0;
            if (t == 1)
                return 1;
            t = t / 0.5;
            if (t < 1)
                return Math.pow(2, 10 * (t - 1)) * 0.5;
            return (-Math.pow(2, -10 * --t) + 2) * 0.5;
        }
        static bounceIn(t) {
            t = 1 - t;
            return 1 - Ease.bounceOut(t);
        }
        static bounceOut(t) {
            if (t < 0.3637) {
                return 7.5625 * t * t;
            }
            else if (t < 0.7272) {
                return (7.5625 * (t -= 0.5454) * t + 0.75);
            }
            else if (t < 0.9090) {
                return (7.5625 * (t -= 0.8181) * t + 0.9375);
            }
            else {
                return (7.5625 * (t -= 0.9545) * t + 0.984375);
            }
        }
        static bounceInOut(t) {
            if (t < 0.5) {
                return Ease.bounceIn(t * 2) * 0.5;
            }
            else {
                return Ease.bounceOut((t * 2) - 1) * 0.5 + 0.5;
            }
        }
        static backIn(t) {
            var s = 1.70158;
            return t * t * ((s + 1) * t - s);
        }
        static backOut(t) {
            var s = 1.70158;
            t = t - 1;
            return (t * t * ((s + 1) * t + s) + 1);
        }
        static backInOut(t) {
            var d = 1;
            var s = 1.70158;
            t = t / 0.5;
            if (t < 1) {
                return (t * t * (((s *= (1.525)) + 1) * t - s)) * 0.5;
            }
            else {
                return ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) * 0.5;
            }
        }
        static elasticIn(t) {
            if (t === 0 || t === 1) {
                return t;
            }
            var p = 0.3, s = p / 4;
            return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
        }
        static elasticOut(t) {
            return 1 - Ease.elasticIn(1 - t);
        }
        static elasticInOut(t) {
            if (t < 0.5) {
                return Ease.elasticIn(t * 2) * 0.5;
            }
            else {
                return Ease.elasticOut((t * 2) - 1) * 0.5 + 0.5;
            }
        }
        static circularIn(t) {
            return -(Math.sqrt(1 - t * t) - 1);
        }
        static circularOut(t) {
            t = t - 1;
            return Math.sqrt(1 - t * t);
        }
        static circularInOut(t) {
            t = t / 0.5;
            if (t < 1)
                return -(Math.sqrt(1 - t * t) - 1) * 0.5;
            return (Math.sqrt(1 - (t -= 2) * t) + 1) * 0.5;
        }
    }
    Ease.easeFunctions = [
        "linear",
        "quadraticIn", "quadraticOut", "quadraticInOut",
        "cubicIn", "cubicOut", "cubicInOut",
        "quarticIn", "quarticOut", "quarticInOut",
        "quinticIn", "quinticOut", "quinticInOut",
        "sineIn", "sineOut", "sineInOut",
        "expoIn", "expoOut", "expoInOut",
        "bounceIn", "bounceOut", "bounceInOut",
        "backIn", "backOut", "backInOut",
        "elasticIn", "elasticOut", "elasticInOut",
        "circularIn", "circularOut", "circularInOut"
    ];
    Cgx.Ease = Ease;
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    class Engine {
        static createOffscreenCanvas(width = 256, height = 256) {
            if (Engine.support.offscreenCanvas) {
                const offscreen = new OffscreenCanvas(width, height);
                return offscreen;
            }
            else {
                return this.createCanvas(width, height);
            }
        }
        static createRenderer(canvasSurface, rendererTypeName) {
            let rendererType = this.getRendererType(rendererTypeName);
            return new rendererType(canvasSurface);
        }
        static getRendererType(typeName) {
            if (this._renderers.length == 0) {
                throw new Error("no renderers registered");
            }
            var rendererEntry = this._renderers.filter(v => v[0] === typeName)[0];
            if (!rendererEntry) {
                console.error("invalid renderer name " + typeName);
                typeName = this._defaultRendererName;
                rendererEntry = this._renderers.filter(v => v[0] === typeName)[0];
                return this._defaultRendererType;
            }
            return rendererEntry[1];
        }
        static createCanvas(width = 256, height = 256) {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            return canvas;
        }
        static get defaultRenderer() { return this._defaultRendererName; }
        ;
        static set defaultRenderer(v) {
            if (typeof v !== "string")
                return;
            if (this._defaultRendererName != v) {
                this._defaultRendererName = v;
            }
        }
        static get vars() { return this._vars; }
        ;
        static registerRenderer(name, rendererBuilder) {
            var rendererEntry = this._renderers.filter(v => v[0] === name)[0];
            if (rendererEntry) {
                rendererEntry[1] = rendererBuilder;
            }
            else {
                this._renderers.push([
                    name,
                    rendererBuilder
                ]);
                if (this._renderers.length == 1 && !this._defaultRendererName) {
                    this._defaultRendererName = this._renderers[0][0];
                    this._defaultRendererType = this._renderers[0][1];
                }
            }
        }
        static loadSettings(settings) {
            if ("defaultRenderer" in settings) {
                this._defaultRendererName = settings.defaultRenderer;
            }
            if ("vars" in settings) {
                for (var n in settings.vars) {
                    if (settings.vars.hasOwnProperty(n)) {
                        this._vars[n] = settings.vars[n];
                    }
                }
            }
        }
        static createDefaultRenderer(canvasSurface) {
            if (!this._defaultRendererType)
                throw new Error("no default renderer registered");
            return new this._defaultRendererType(canvasSurface);
        }
        static createGraphicsFromCanvasSurface(canvasSurface, rendererTypeName) {
            let renderer;
            if (typeof rendererTypeName === "string") {
                renderer = this.createRenderer(canvasSurface, rendererTypeName);
            }
            else {
                renderer = this.createDefaultRenderer(canvasSurface);
            }
            return new Cgx.CoreGraphics(renderer);
        }
        static createGraphics(width, height, rendererTypeName) {
            const canvas = this.createCanvas(width, height);
            return this.createGraphicsFromCanvasSurface(canvas, rendererTypeName);
        }
        static createOffscreenGraphics(width, height, rendererTypeName) {
            let canvasSurface = this.createOffscreenCanvas(width, height);
            return this.createGraphicsFromCanvasSurface(canvasSurface);
        }
        static createBufferedGraphics(width, height, rendererTypeName) {
            if (Engine.support.bufferedGraphics) {
                let canvasSurface = this.createOffscreenCanvas(width, height);
                let renderer;
                if (typeof rendererTypeName === "string") {
                    renderer = this.createRenderer(canvasSurface, rendererTypeName);
                }
                else {
                    renderer = this.createDefaultRenderer(canvasSurface);
                }
                return new Cgx.BufferedGraphics(renderer);
            }
            else {
                console.log("unsupported feature 'bufferedGraphics'");
            }
        }
    }
    Engine.support = (() => {
        const imageBitmapRenderingContext = "ImageBitmapRenderingContext" in window;
        const offscreenCanvas = "OffscreenCanvas" in window;
        const offscreenCanvasTransferToImageBitmap = offscreenCanvas && "transferToImageBitmap" in OffscreenCanvas.prototype;
        return {
            imageBitmapRenderingContext: imageBitmapRenderingContext,
            offscreenCanvas: offscreenCanvas,
            offscreenCanvasTransferToImageBitmap: offscreenCanvasTransferToImageBitmap,
            bufferedGraphics: offscreenCanvas && offscreenCanvasTransferToImageBitmap
        };
    })();
    Engine._renderers = [];
    Engine._vars = {};
    Cgx.Engine = Engine;
    (function () {
        Engine.registerRenderer("CanvasRenderer", Cgx.CanvasRenderer);
    })();
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    class FpsCounter {
        constructor() {
            this._isRunning = false;
            this._accumulatedFrames = 0;
            this._accumulatedTime = 0;
            this.sampleInterval = 500;
        }
        get fps() {
            return this._fps;
        }
        notifyFrame(timestamp) {
            if (this._isRunning) {
                if (!this._lastTimestamp) {
                    this._lastTimestamp = timestamp;
                }
                var deltaTime = timestamp - this._lastTimestamp;
                this._lastTimestamp = timestamp;
                if (this.sampleInterval <= 0) {
                    this._fps = 1000 / deltaTime;
                }
                else {
                    this._accumulatedTime += deltaTime;
                    this._accumulatedFrames++;
                    if (this._accumulatedTime >= this.sampleInterval) {
                        this._fps = (1000 / this._accumulatedTime) * this._accumulatedFrames;
                        this._accumulatedTime = 0;
                        this._accumulatedFrames = 0;
                    }
                }
            }
            else {
                this._fps = 0;
            }
        }
        start() {
            this._isRunning = true;
        }
        stop() {
            this._isRunning = false;
        }
    }
    Cgx.FpsCounter = FpsCounter;
})(Cgx || (Cgx = {}));
if (typeof module !== "undefined") {
    module.exports = Cgx;
}
var Cgx;
(function (Cgx) {
    class Matrix {
        constructor(m11, m12, m21, m22, offsetX, offsetY) {
            this.m11 = m11 || 1.0;
            this.m12 = m12 || 0.0;
            this.m21 = m21 || 0.0;
            this.m22 = m22 || 1.0;
            this.offsetX = offsetX || 0.0;
            this.offsetY = offsetY || 0.0;
        }
        static createRotationRadians(angle, centerX, centerY) {
            var sinAngle = Math.sin(angle);
            var cosAngle = Math.cos(angle);
            var offsetX = (centerX * (1.0 - cosAngle)) + (centerY * sinAngle);
            var offsetY = (centerY * (1.0 - cosAngle)) - (centerX * sinAngle);
            return new Matrix(cosAngle, sinAngle, -sinAngle, cosAngle, offsetX, offsetY);
        }
        static multiplyRefMatrix(refMatrix, matrix) {
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
        static invert(matrix) {
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
        static multiplyMatrix(matrix1, matrix2) {
            var m11 = (matrix1.m11 * matrix2.m11) + (matrix1.m12 * matrix2.m21);
            var m12 = (matrix1.m11 * matrix2.m12) + (matrix1.m12 * matrix2.m22);
            var m21 = (matrix1.m21 * matrix2.m11) + (matrix1.m22 * matrix2.m21);
            var m22 = (matrix1.m21 * matrix2.m12) + (matrix1.m22 * matrix2.m22);
            var m31 = ((matrix1.offsetX * matrix2.m11) + (matrix1.offsetY * matrix2.m21)) + matrix2.offsetX;
            var m32 = ((matrix1.offsetX * matrix2.m12) + (matrix1.offsetY * matrix2.m22)) + matrix2.offsetY;
            return new Matrix(m11, m12, m21, m22, m31, m32);
        }
        static multiplyValue(matrix, value) {
            var m11 = matrix.m11 * value;
            var m12 = matrix.m12 * value;
            var m21 = matrix.m21 * value;
            var m22 = matrix.m22 * value;
            var m31 = matrix.offsetX * value;
            var m32 = matrix.offsetY * value;
            return new Matrix(m11, m12, m21, m22, m31, m32);
        }
        isZero(value) {
            return (Math.abs(value) < 2.2204460492503131E-15);
        }
        multiplyPoint(x, y) {
            var ox = (y * this.m21) + this.offsetX;
            var oy = (x * this.m12) + this.offsetY;
            x *= this.m11;
            x += ox;
            y *= this.m22;
            y += oy;
            return { x: x, y: y };
        }
        getDeterminant() {
            return ((this.m11 * this.m22) - (this.m21 * this.m12));
        }
        clone() {
            return new Matrix(this.m11, this.m12, this.m21, this.m22, this.offsetX, this.offsetY);
        }
        hasInverse() {
            return !this.isZero(this.getDeterminant());
        }
        isIdentity() {
            return (this.m11 == 1.0 && this.m12 == 0.0 && this.m21 == 0.0 && this.m22 == 1.0 && this.offsetX == 0.0 && this.offsetY == 0.0);
        }
        reset() {
            this.m11 = 1.0;
            this.m12 = 0.0;
            this.m21 = 0.0;
            this.m22 = 1.0;
            this.offsetX = 0.0;
            this.offsetY = 0.0;
        }
        rotate(angle) {
            angle = angle % 360.0;
            var rotationMatrix = Matrix.createRotationRadians(angle * 0.017453292519943295, 0.0, 0.0);
            Matrix.multiplyRefMatrix(this, rotationMatrix);
        }
        rotateAt(angle, centerX, centerY) {
            angle = angle % 360.0;
            var rotationMatrix = Matrix.createRotationRadians(angle * 0.017453292519943295, centerX, centerY);
            Matrix.multiplyRefMatrix(this, rotationMatrix);
        }
        scale(scaleX, scaleY) {
            var scaleMatrix = new Matrix(scaleX, 0.0, 0.0, scaleY, 0.0, 0.0);
            Matrix.multiplyRefMatrix(this, scaleMatrix);
        }
        scaleAt(scaleX, scaleY, centerX, centerY) {
            var scaleAtMatrix = new Matrix(scaleX, 0.0, 0.0, scaleY, centerX - (scaleX * centerX), centerY - (scaleY * centerY));
            Matrix.multiplyRefMatrix(this, scaleAtMatrix);
        }
        skew(skewX, skewY) {
            skewX = (skewX % 360.0) * 0.017453292519943295;
            skewY = (skewY % 360.0) * 0.017453292519943295;
            var skewMatrix = new Matrix(1.0, Math.tan(skewY), Math.tan(skewX), 1.0, 0.0, 0.0);
            Matrix.multiplyRefMatrix(this, skewMatrix);
        }
        transformPoint(x, y) {
            return this.multiplyPoint(x, y);
        }
        transformRect(x, y, width, height) {
            var endX = x + width;
            var endY = y + height;
            var start = this.multiplyPoint(x, y);
            var end = this.multiplyPoint(endX, endY);
            var lx, ly, lw, lh;
            lx = start.x;
            ly = start.y;
            lw = end.x - lx;
            lh = end.y - ly;
            return { x: lx, y: ly, width: lw, height: lh };
        }
        translate(offsetX, offsetY) {
            this.offsetX += offsetX;
            this.offsetY += offsetY;
        }
    }
    Matrix.indentity = new Matrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    Cgx.Matrix = Matrix;
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    class RenderLoop {
        constructor(loopCallback) {
            this._maxFps = 0;
            this._isRunning = false;
            this._loopArgs = {
                instance: this,
                data: null,
                deltaTime: 0
            };
            this._renderTimeAccumulator = 0;
            this._lastRenderDeltaTime = 0;
            this._animators = [];
            this._animatorsToRemove = [];
            if (typeof loopCallback !== "function") {
                throw new Error("missing loop callback");
            }
            this._loopCallback = loopCallback;
            this._fpsCounter = new Cgx.FpsCounter();
            this.computeTimeInterval();
            this._lastLoopTime = Date.now();
            requestAnimationFrame(this.onRenderFrame.bind(this));
        }
        onRenderFrame(timeStamp) {
            if (this._isRunning) {
                if (!this._lastLoopTime)
                    this._lastLoopTime = timeStamp;
                var timeElapsed = timeStamp - this._lastLoopTime;
                if (timeElapsed < 0)
                    timeElapsed = 0;
                this._lastLoopTime = timeStamp;
                if (this._renderTimeInterval > 0) {
                    this._renderTimeAccumulator += timeElapsed;
                    if (this._renderTimeAccumulator >= this._renderTimeInterval) {
                        this._renderTimeAccumulator -= this._renderTimeInterval;
                        this._loopArgs.deltaTime = this._lastLoopTime - this._lastRenderDeltaTime;
                        this._lastRenderDeltaTime = this._lastLoopTime;
                        this._loopCallback(this._loopArgs);
                        this._fpsCounter.notifyFrame(timeStamp);
                        this.onAnimatorFrame(timeStamp);
                    }
                }
                else {
                    this._loopArgs.deltaTime = timeElapsed;
                    this._loopCallback(this._loopArgs);
                    this._fpsCounter.notifyFrame(timeStamp);
                    this.onAnimatorFrame(timeStamp);
                }
            }
            requestAnimationFrame(this.onRenderFrame.bind(this));
        }
        onAnimatorFrame(timeStamp) {
            this._animators.forEach(a => {
                a.notifyFrame(timeStamp);
                if (a.isCompleted) {
                    var i = this._animatorsToRemove.indexOf(a);
                    if (i >= 0) {
                        this._animatorsToRemove.splice(i, 1);
                        this._animators.splice(this._animators.indexOf(a), 1);
                    }
                }
            });
        }
        computeTimeInterval() {
            if (this._maxFps <= 0 || !Number.isFinite(this._maxFps)) {
                this._renderTimeInterval = 0;
            }
            else {
                this._renderTimeInterval = 1000 / this._maxFps;
            }
        }
        get currentFps() { return this._fpsCounter.fps; }
        get maxFps() { return this._maxFps; }
        set maxFps(v) {
            if (this._maxFps != v) {
                this._maxFps = v;
                this.computeTimeInterval();
            }
        }
        get data() { return this._loopArgs.data; }
        set data(v) {
            this._loopArgs.data = v;
        }
        get isRunning() { return this._isRunning; }
        start() {
            this._isRunning = true;
            this._fpsCounter.start();
        }
        stop() {
            this._isRunning = false;
            this._fpsCounter.stop();
        }
        animate(startValue, endValue, totalTime, easing, onValueCallback, onCompleted) {
            var animator = this.createAnimator(startValue, endValue, totalTime, easing, onValueCallback, onCompleted);
            this.addAnimator(animator, true);
            animator.start();
        }
        createAnimator(startValue, endValue, totalTime, easing, onValueCallback, onCompleted) {
            return new Cgx.Animator(startValue, endValue, totalTime, Cgx.Ease.getEasingFunctionOrDefault(easing), onValueCallback, onCompleted);
        }
        addAnimator(animator, autoRemoveOnCompleted) {
            if (this._animators.indexOf(animator) === -1) {
                this._animators.push(animator);
                if (autoRemoveOnCompleted) {
                    this._animatorsToRemove.push(animator);
                }
                return this._animators.length - 1;
            }
            return -1;
        }
        removeAnimator(animator) {
            var index = this._animatorsToRemove.indexOf(animator);
            if (index >= 0) {
                this._animatorsToRemove.splice(index, 1);
            }
            index = this._animators.indexOf(animator);
            if (index >= 0) {
                this._animators.splice(index, 1);
                return true;
            }
            return false;
        }
    }
    Cgx.RenderLoop = RenderLoop;
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    let Shapes;
    (function (Shapes) {
        const isFillShape = (type) => type.fillBrush !== undefined;
        const isStrokeShape = (type) => type.strokeBrush !== undefined &&
            type.strokeWidth !== undefined;
        class Shape {
            constructor() {
                this.shadow = null;
                this.transform = null;
            }
            render(gfx) {
                const currentFill = gfx.fillBrush;
                let hasFill = false;
                if (isFillShape(this) && this.fillBrush) {
                    hasFill = true;
                    gfx.fillBrush = this.fillBrush;
                }
                const currentStroke = gfx.strokeBrush;
                const currentStrokeWidth = gfx.strokeWidth;
                let hasStroke = false;
                let hasStrokeWidth = false;
                if (isStrokeShape(this)) {
                    if (this.strokeBrush) {
                        gfx.strokeBrush = this.strokeBrush;
                        hasStroke = true;
                    }
                    if (this.strokeWidth !== undefined) {
                        gfx.strokeWidth = this.strokeWidth;
                        hasStrokeWidth = true;
                    }
                }
                const currentShadow = gfx.shadow;
                if (this.shadow) {
                    gfx.shadow = this.shadow;
                }
                this.onRender(gfx);
                if (this.shadow) {
                    gfx.shadow = currentShadow;
                }
                if (hasFill) {
                    gfx.fillBrush = currentFill;
                }
                if (hasStroke) {
                    gfx.strokeBrush = currentStroke;
                }
                if (hasStrokeWidth) {
                    gfx.strokeWidth = currentStrokeWidth;
                }
            }
        }
        Shapes.Shape = Shape;
        class Arc extends Shape {
            constructor() {
                super(...arguments);
                this.centerPoint = Cgx.createPoint();
                this.radius = 0;
                this.startAngle = 0;
                this.endAngle = 0;
            }
            static fromGeometry(geometry, strokeBrush, strokeWidth) {
                const result = new Arc();
                result.centerPoint = geometry.centerPoint;
                result.radius = geometry.radius;
                result.startAngle = geometry.startAngle;
                result.endAngle = geometry.endAngle;
                result.isAntiClockwise = geometry.isAntiClockwise;
                if (strokeWidth !== undefined) {
                    result.strokeWidth = strokeWidth;
                }
                if (strokeBrush !== undefined) {
                    result.strokeBrush = strokeBrush;
                }
                return result;
            }
            onRender(gfx) {
                gfx.drawArc(this.centerPoint.x, this.centerPoint.y, this.radius, this.startAngle, this.endAngle, this.isAntiClockwise, this.transform);
            }
        }
        Shapes.Arc = Arc;
        class Line extends Shape {
            constructor() {
                super(...arguments);
                this.startPoint = Cgx.createPoint();
                this.endPoint = Cgx.createPoint();
            }
            static fromGeometry(geometry, strokeBrush, strokeWidth) {
                const result = new Line();
                result.startPoint = geometry.startPoint;
                result.endPoint = geometry.endPoint;
                if (strokeWidth !== undefined) {
                    result.strokeWidth = strokeWidth;
                }
                if (strokeBrush !== undefined) {
                    result.strokeBrush = strokeBrush;
                }
                return result;
            }
            onRender(gfx) {
                gfx.drawLine(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y, this.transform);
            }
        }
        Shapes.Line = Line;
        class Rectangle extends Shape {
            constructor() {
                super(...arguments);
                this.origin = Cgx.createPoint();
            }
            static fromGeometry(geometry, strokeBrush, strokeWidth, fillBrush) {
                const result = new Rectangle();
                result.origin = geometry.origin;
                result.width = geometry.width;
                result.height = geometry.height;
                if (strokeWidth !== undefined) {
                    result.strokeWidth = strokeWidth;
                }
                if (strokeBrush !== undefined) {
                    result.strokeBrush = strokeBrush;
                }
                if (fillBrush !== undefined) {
                    result.fillBrush = fillBrush;
                }
                return result;
            }
            onRender(gfx) {
                gfx.drawRoundedRectangle(this.origin.x, this.origin.y, this.width, this.height, this.cornerRadius, this.transform);
            }
        }
        Shapes.Rectangle = Rectangle;
        class Ellipse extends Shape {
            constructor() {
                super(...arguments);
                this.centerPoint = Cgx.createPoint();
                this.radiusX = 0;
                this.radiusY = 0;
            }
            static fromGeometry(geometry, strokeBrush, strokeWidth, fillBrush) {
                const result = new Ellipse();
                result.centerPoint = geometry.centerPoint;
                result.radiusX = geometry.radiusX;
                result.radiusY = geometry.radiusY;
                if (strokeWidth !== undefined) {
                    result.strokeWidth = strokeWidth;
                }
                if (strokeBrush !== undefined) {
                    result.strokeBrush = strokeBrush;
                }
                if (fillBrush !== undefined) {
                    result.fillBrush = fillBrush;
                }
                return result;
            }
            onRender(gfx) {
                gfx.drawEllipse(this.centerPoint.x, this.centerPoint.y, this.radiusX, this.radiusY, this.transform);
            }
        }
        Shapes.Ellipse = Ellipse;
        class Polygonal extends Shape {
            constructor() {
                super(...arguments);
                this.points = new Array();
            }
            static fromGeometry(geometry, strokeBrush, strokeWidth, fillBrush) {
                const result = new Polygonal();
                result.isClosed = geometry.isClosed;
                result.points = geometry.points;
                if (strokeWidth !== undefined) {
                    result.strokeWidth = strokeWidth;
                }
                if (strokeBrush !== undefined) {
                    result.strokeBrush = strokeBrush;
                }
                if (fillBrush !== undefined) {
                    result.fillBrush = fillBrush;
                }
                return result;
            }
            onRender(gfx) {
                if (this.isClosed) {
                    gfx.drawPolygon(this.points, this.transform);
                }
                else {
                    gfx.drawPolyline(this.points, this.transform);
                }
            }
        }
        Shapes.Polygonal = Polygonal;
        class QuadraticCurve extends Shape {
            constructor() {
                super(...arguments);
                this.points = new Array();
                this.controlPoints = new Array();
            }
            static fromGeometry(geometry, strokeBrush, strokeWidth, fillBrush) {
                const result = new QuadraticCurve();
                result.isClosed = geometry.isClosed;
                result.points = geometry.points;
                result.controlPoints = geometry.controlPoints;
                if (strokeWidth !== undefined) {
                    result.strokeWidth = strokeWidth;
                }
                if (strokeBrush !== undefined) {
                    result.strokeBrush = strokeBrush;
                }
                if (fillBrush !== undefined) {
                    result.fillBrush = fillBrush;
                }
                return result;
            }
            onRender(gfx) {
                gfx.drawQuadraticCurve(this.points, this.controlPoints, this.isClosed, this.transform);
            }
        }
        Shapes.QuadraticCurve = QuadraticCurve;
        class CubicCurve extends Shape {
            constructor() {
                super(...arguments);
                this.points = new Array();
                this.controlPoints1 = new Array();
                this.controlPoints2 = new Array();
            }
            static fromGeometry(geometry, strokeBrush, strokeWidth, fillBrush) {
                const result = new CubicCurve();
                result.isClosed = geometry.isClosed;
                result.points = geometry.points;
                result.controlPoints1 = geometry.controlPoints1;
                result.controlPoints2 = geometry.controlPoints2;
                if (strokeWidth !== undefined) {
                    result.strokeWidth = strokeWidth;
                }
                if (strokeBrush !== undefined) {
                    result.strokeBrush = strokeBrush;
                }
                if (fillBrush !== undefined) {
                    result.fillBrush = fillBrush;
                }
                return result;
            }
            onRender(gfx) {
                gfx.drawCubicCurve(this.points, this.controlPoints1, this.controlPoints2, this.isClosed, this.transform);
            }
        }
        Shapes.CubicCurve = CubicCurve;
        class Image extends Shape {
            constructor() {
                super(...arguments);
                this.origin = Cgx.createPoint();
            }
            static fromGeometry(geometry, strokeBrush, strokeWidth) {
                const result = new Image();
                result.origin = geometry.origin;
                result.width = geometry.width;
                result.height = geometry.height;
                if (strokeWidth !== undefined) {
                    result.strokeWidth = strokeWidth;
                }
                if (strokeBrush !== undefined) {
                    result.strokeBrush = strokeBrush;
                }
                return result;
            }
            onRender(gfx) {
                gfx.drawImage(this.image, this.origin.x, this.origin.y, this.width, this.height, this.transform);
            }
        }
        Shapes.Image = Image;
        class Text extends Shape {
            constructor() {
                super(...arguments);
                this.origin = Cgx.createPoint();
            }
            static fromGeometry(geometry, strokeBrush, strokeWidth, fillBrush) {
                const result = new Text();
                result.origin = geometry.origin;
                result.text = geometry.text;
                if (strokeWidth !== undefined) {
                    result.strokeWidth = strokeWidth;
                }
                if (strokeBrush !== undefined) {
                    result.strokeBrush = strokeBrush;
                }
                if (fillBrush !== undefined) {
                    result.fillBrush = fillBrush;
                }
                return result;
            }
            onRender(gfx) {
                gfx.drawText(this.origin.x, this.origin.y, this.text, this.transform);
            }
        }
        Shapes.Text = Text;
        class Path extends Shape {
            constructor() {
                super(...arguments);
                this.origin = Cgx.createPoint();
            }
            static fromGeometry(geometry, strokeBrush, strokeWidth, fillBrush) {
                const result = new Path();
                result.origin = geometry.origin;
                result.path = geometry.path;
                result.fillRule = geometry.fillRule;
                if (strokeWidth !== undefined) {
                    result.strokeWidth = strokeWidth;
                }
                if (strokeBrush !== undefined) {
                    result.strokeBrush = strokeBrush;
                }
                if (fillBrush !== undefined) {
                    result.fillBrush = fillBrush;
                }
                return result;
            }
            onRender(gfx) {
                gfx.drawPath2D(this.origin.x, this.origin.y, this.path, this.fillRule, this.transform);
            }
        }
        Shapes.Path = Path;
        class Pie extends Shape {
            constructor() {
                super(...arguments);
                this.centerPoint = Cgx.createPoint();
                this.radius = 0;
                this.startAngle = 0;
                this.endAngle = 0;
            }
            static fromGeometry(geometry, strokeBrush, strokeWidth, fillBrush) {
                const result = new Pie();
                result.centerPoint = geometry.centerPoint;
                result.endAngle = geometry.endAngle;
                result.isAntiClockwise = geometry.isAntiClockwise;
                result.radius = geometry.radius;
                result.startAngle = geometry.startAngle;
                if (strokeWidth !== undefined) {
                    result.strokeWidth = strokeWidth;
                }
                if (strokeBrush !== undefined) {
                    result.strokeBrush = strokeBrush;
                }
                if (fillBrush !== undefined) {
                    result.fillBrush = fillBrush;
                }
                return result;
            }
            onRender(gfx) {
                gfx.drawPie(this.centerPoint.x, this.centerPoint.y, this.radius, this.startAngle, this.endAngle, this.isAntiClockwise, this.transform);
            }
        }
        Shapes.Pie = Pie;
        class Donut extends Shape {
            constructor() {
                super(...arguments);
                this.centerPoint = Cgx.createPoint();
                this.startRadius = 0;
                this.endRadius = 0;
                this.startAngle = 0;
                this.endAngle = 0;
            }
            static fromGeometry(geometry, strokeBrush, strokeWidth, fillBrush) {
                const result = new Donut();
                result.centerPoint = geometry.centerPoint;
                result.endAngle = geometry.endAngle;
                result.endRadius = geometry.endRadius;
                result.isAntiClockwise = geometry.isAntiClockwise;
                result.startAngle = geometry.startAngle;
                result.startRadius = geometry.startRadius;
                if (strokeWidth !== undefined) {
                    result.strokeWidth = strokeWidth;
                }
                if (strokeBrush !== undefined) {
                    result.strokeBrush = strokeBrush;
                }
                if (fillBrush !== undefined) {
                    result.fillBrush = fillBrush;
                }
                return result;
            }
            onRender(gfx) {
                gfx.drawDonut(this.centerPoint.x, this.centerPoint.y, this.startRadius, this.endRadius, this.startAngle, this.endAngle, this.isAntiClockwise, this.transform);
            }
        }
        Shapes.Donut = Donut;
    })(Shapes = Cgx.Shapes || (Cgx.Shapes = {}));
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    class Transform {
        constructor() {
            this._isDirty = true;
            this._originX = 0.0;
            this._originY = 0.0;
            this._translationX = 0.0;
            this._translationY = 0.0;
            this._scaleX = 1.0;
            this._scaleY = 1.0;
            this._rotation = 0.0;
            this._propertyChanged = (p) => { };
        }
        clone() {
            const result = new Transform();
            result._originX = this._originX;
            result._originY = this._originY;
            result._translationX = this._translationX;
            result._translationY = this._translationY;
            result._scaleX = this._scaleX;
            result._scaleY = this._scaleY;
            result._rotation = this._rotation;
            return result;
        }
        get originX() {
            return this._originX;
        }
        set originX(v) {
            if (typeof v === "number") {
                if (this._originX !== v) {
                    this._originX = v;
                    this._isDirty = true;
                    this._propertyChanged("originX");
                }
            }
        }
        get originY() {
            return this._originY;
        }
        set originY(v) {
            if (typeof v === "number") {
                if (this._originY !== v) {
                    this._originY = v;
                    this._isDirty = true;
                    this._propertyChanged("originY");
                }
            }
        }
        get translationX() {
            return this._translationX;
        }
        set translationX(v) {
            if (typeof v === "number") {
                if (this._translationX !== v) {
                    this._translationX = v;
                    this._isDirty = true;
                    this._propertyChanged("translationX");
                }
            }
        }
        get translationY() {
            return this._translationY;
        }
        set translationY(v) {
            if (typeof v === "number") {
                if (this._translationY !== v) {
                    this._translationY = v;
                    this._isDirty = true;
                    this._propertyChanged("translationY");
                }
            }
        }
        get scaleX() {
            return this._scaleX;
        }
        set scaleX(v) {
            if (typeof v === "number") {
                if (this._scaleX !== v) {
                    this._scaleX = v;
                    this._isDirty = true;
                    this._propertyChanged("scaleX");
                }
            }
        }
        get scaleY() {
            return this._scaleY;
        }
        set scaleY(v) {
            if (typeof v === "number") {
                if (this._scaleY !== v) {
                    this._scaleY = v;
                    this._isDirty = true;
                    this._propertyChanged("scaleY");
                }
            }
        }
        get rotation() {
            return this._rotation;
        }
        set rotation(v) {
            if (typeof v === "number") {
                if (this._rotation !== v) {
                    this._rotation = v;
                    this._isDirty = true;
                    this._propertyChanged("rotation");
                }
            }
        }
        get isIdentity() {
            if (this._translationX == 0 && this._translationY == 0) {
                if (this._scaleX == 1 && this._scaleY == 1) {
                    if (this._rotation == 0) {
                        return true;
                    }
                }
            }
            return false;
        }
        getMatrix() {
            if (this._matrix == null || this._isDirty) {
                this._matrix = new Cgx.Matrix();
                this._matrix.translate(this.translationX, this.translationY);
                this._matrix.rotate(this.rotation);
                this._matrix.scale(this.scaleX, this.scaleY);
            }
            return this._matrix;
        }
        reset() {
            this._originX = 0.0;
            this._originY = 0.0;
            this._translationX = 0.0;
            this._translationY = 0.0;
            this._scaleX = 1.0;
            this._scaleY = 1.0;
            this._rotation = 0.0;
            this._matrix = null;
        }
        setDirty() {
            this._isDirty = true;
        }
        transformPoint(x, y) {
            return this.getMatrix().transformPoint(x, y);
        }
        transformRect(x, y, width, height) {
            return this.getMatrix().transformRect(x, y, width, height);
        }
    }
    Cgx.Transform = Transform;
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    class TransformManager {
        constructor(renderer) {
            this._transforms = [];
            this._renderer = renderer;
        }
        push(transform) {
            var mtx = transform.getMatrix();
            this._transforms.push(transform);
            this._renderer.saveState();
            this._renderer.transform(mtx.m11, mtx.m12, mtx.m21, mtx.m22, mtx.offsetX, mtx.offsetY);
        }
        pop() {
            var result = this._transforms.push();
            this._renderer.restoreState();
            return result;
        }
        get length() {
            return this._transforms.length;
        }
    }
    Cgx.TransformManager = TransformManager;
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    function createPoint(x = 0, y = 0) {
        return { x, y };
    }
    Cgx.createPoint = createPoint;
})(Cgx || (Cgx = {}));
var Cgx;
(function (Cgx) {
    class WebGLRenderer extends Cgx.GraphicsRenderer {
        constructor(canvas) {
            super(canvas);
            this.name = "WebGLRenderer";
            this._context = canvas.getContext("webgl");
            this.setDefaultValues();
        }
        setDefaultValues() {
            this.globalAlpha = Cgx.GraphicsRenderer.defaultValues.globalAlpha;
            this.globalCompositeOperation = Cgx.GraphicsRenderer.defaultValues.globalCompositeOperation;
            this.fillStyle = Cgx.GraphicsRenderer.defaultValues.fillStyle;
            this.strokeStyle = Cgx.GraphicsRenderer.defaultValues.strokeStyle;
            this.shadowBlur = Cgx.GraphicsRenderer.defaultValues.shadowBlur;
            this.shadowColor = Cgx.GraphicsRenderer.defaultValues.shadowColor;
            this.shadowOffsetX = Cgx.GraphicsRenderer.defaultValues.shadowOffsetX;
            this.shadowOffsetY = Cgx.GraphicsRenderer.defaultValues.shadowOffsetY;
            this.lineCap = Cgx.GraphicsRenderer.defaultValues.lineCap;
            this.lineJoin = Cgx.GraphicsRenderer.defaultValues.lineJoin;
            this.lineWidth = Cgx.GraphicsRenderer.defaultValues.lineWidth;
            this.miterLimit = Cgx.GraphicsRenderer.defaultValues.miterLimit;
            this.lineDashOffset = Cgx.GraphicsRenderer.defaultValues.lineDashOffset;
            this.textLineHeight = Cgx.GraphicsRenderer.defaultValues.textLineHeight;
            this.fontStyle = Cgx.GraphicsRenderer.defaultValues.fontStyle;
            this.fontWeight = Cgx.GraphicsRenderer.defaultValues.fontWeight;
            this.fontSize = Cgx.GraphicsRenderer.defaultValues.fontSize;
            this.fontFamily = Cgx.GraphicsRenderer.defaultValues.fontFamily;
            this.textAlign = Cgx.GraphicsRenderer.defaultValues.textAlign;
            this.textBaseline = Cgx.GraphicsRenderer.defaultValues.textBaseline;
            this.direction = Cgx.GraphicsRenderer.defaultValues.direction;
            this.imageSmoothingEnabled = Cgx.GraphicsRenderer.defaultValues.imageSmoothingEnabled;
        }
        createLinearGradient(x0, y0, x1, y1) {
            throw new Error("Method not implemented.");
        }
        createRadialGradient(x0, y0, r0, x1, y1, r1) {
            throw new Error("Method not implemented.");
        }
        createPattern(image, repetition) {
            throw new Error("Method not implemented.");
        }
        getLineDash() {
            throw new Error("Method not implemented.");
        }
        setLineDash(segments) {
            throw new Error("Method not implemented.");
        }
        saveState() {
            throw new Error("Method not implemented.");
        }
        restoreState() {
            throw new Error("Method not implemented.");
        }
        toDataURL(type, quality) {
            throw new Error("Method not implemented.");
        }
        clearRect(x, y, width, height, fillStyle) {
            throw new Error("Method not implemented.");
        }
        strokeRect(x, y, width, height) {
            throw new Error("Method not implemented.");
        }
        fillRect(x, y, width, height) {
            throw new Error("Method not implemented.");
        }
        stroke() {
            throw new Error("Method not implemented.");
        }
        fill(fillRule) {
            throw new Error("Method not implemented.");
        }
        strokePath2D(path2D) {
            throw new Error("Method not implemented.");
        }
        fillPath2D(path2D, fillRule) {
            throw new Error("Method not implemented.");
        }
        clip() {
            throw new Error("Method not implemented.");
        }
        rect(x, y, width, height) {
            throw new Error("Method not implemented.");
        }
        square(x, y, size) {
            throw new Error("Method not implemented.");
        }
        ellipse(x, y, rx, ry, rotation, startAngle, endAngle) {
            throw new Error("Method not implemented.");
        }
        circle(x, y, r) {
            throw new Error("Method not implemented.");
        }
        arc(x, y, r, rotation, startAngle, endAngle, anticlockwise) {
            throw new Error("Method not implemented.");
        }
        beginPath() {
            throw new Error("Method not implemented.");
        }
        closePath() {
            throw new Error("Method not implemented.");
        }
        arcTo(x1, y1, x2, y2, radius) {
            throw new Error("Method not implemented.");
        }
        moveTo(x, y) {
            throw new Error("Method not implemented.");
        }
        lineTo(x, y) {
            throw new Error("Method not implemented.");
        }
        bezierCurveTo(c1x, c1y, c2x, c2y, x, y) {
            throw new Error("Method not implemented.");
        }
        quadraticCurveTo(cx, cy, x, y) {
            throw new Error("Method not implemented.");
        }
        isPointInPath(x, y, fillRule) {
            throw new Error("Method not implemented.");
        }
        isPointInPath2D(path2D, x, y, fillRule) {
            throw new Error("Method not implemented.");
        }
        isPointInStroke(x, y) {
            throw new Error("Method not implemented.");
        }
        isPointInPath2DStroke(path2D, x, y) {
            throw new Error("Method not implemented.");
        }
        addHitRegion(options) {
            throw new Error("Method not implemented.");
        }
        removeHitRegion(id) {
            throw new Error("Method not implemented.");
        }
        clearHitRegions() {
            throw new Error("Method not implemented.");
        }
        drawImage(img, dx, dy, dw, dh, sx, sy, sw, sh) {
            throw new Error("Method not implemented.");
        }
        createImageData(width, height) {
            throw new Error("Method not implemented.");
        }
        cloneImageData(imageData) {
            throw new Error("Method not implemented.");
        }
        getImageData(sx, sy, sw, sh) {
            throw new Error("Method not implemented.");
        }
        putImageData(imageData, x, y) {
            throw new Error("Method not implemented.");
        }
        fillText(text, x, y, maxWidth) {
            throw new Error("Method not implemented.");
        }
        strokeText(text, x, y, maxWidth) {
            throw new Error("Method not implemented.");
        }
        measureText(text) {
            throw new Error("Method not implemented.");
        }
        rotate(angle) {
            throw new Error("Method not implemented.");
        }
        translate(dx, dy) {
            throw new Error("Method not implemented.");
        }
        scale(x, y) {
            throw new Error("Method not implemented.");
        }
        transform(a, b, c, d, e, f) {
            throw new Error("Method not implemented.");
        }
        setTransform(a, b, c, d, e, f) {
            throw new Error("Method not implemented.");
        }
        resetTransform() {
            throw new Error("Method not implemented.");
        }
        drawFocusIfNeeded(element) {
            throw new Error("Method not implemented.");
        }
    }
    WebGLRenderer.support = (() => {
        return {};
    })();
    Cgx.WebGLRenderer = WebGLRenderer;
})(Cgx || (Cgx = {}));
//# sourceMappingURL=cgx.js.map