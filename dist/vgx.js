var Vgx;
(function (Vgx) {
    class ReactiveObject {
        constructor() {
            this._events = new Vgx.EventsManager(this);
            this.onPropertyChanged = new Vgx.EventSet(this._events, "onPropertyChanged");
        }
        _raisePropertyChanged(propertyName) {
            this._events.trigger("onPropertyChanged", { propertyName });
        }
    }
    Vgx.ReactiveObject = ReactiveObject;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class Artboard extends Vgx.ReactiveObject {
        constructor() {
            super();
            this._background = "#aaaaaa";
            this._border = "#666666";
            this._borderWidth = 1;
        }
        get border() { return this._border; }
        set border(v) {
            if (this._border != v) {
                this._border = v;
                this._raisePropertyChanged("border");
            }
        }
        get borderWidth() { return this._borderWidth; }
        set borderWidth(v) {
            if (this._borderWidth != v) {
                this._borderWidth = v;
                this._raisePropertyChanged("borderWidth");
            }
        }
        get background() { return this._background; }
        set background(v) {
            if (this._background != v) {
                this._background = v;
                this._raisePropertyChanged("background");
            }
        }
        get shadow() { return this._shadow; }
        set shadow(v) {
            if (this._shadow != v) {
                this._shadow = v;
                this._raisePropertyChanged("shadow");
            }
        }
        get clipContent() { return this._clipContent; }
        set clipContent(v) {
            v = !!v;
            if (this._clipContent != v) {
                this._clipContent = v;
                this._raisePropertyChanged("clipContent");
            }
        }
        get bounds() { return this._bounds; }
        set bounds(v) {
            if (this._bounds != v) {
                this._bounds = v;
                this._raisePropertyChanged("bounds");
            }
        }
    }
    Vgx.Artboard = Artboard;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class Drawing {
        constructor() {
            this._isDirty = true;
            this._usedHandles = [];
            this._children = new Vgx.VgxEntityCollection(this);
            this._children.onCollectionChanged.add(this._onChildrenChanged, this);
            this._redrawHandlers = [];
        }
        static fromJSON(json) {
            const jobject = JSON.parse(json);
            return Vgx.DrawingLoader.loadFromObject(jobject);
        }
        static fromScript(script) {
            var drawing = new Drawing();
            const func = new Function("drawing", script);
            func.call(null, drawing);
            return drawing;
        }
        _onChildrenChanged(s, e) {
            this.isDirty = true;
        }
        _artboardPropertyChanged(s, e) {
        }
        get background() { return this._background; }
        set background(v) {
            const vType = typeof v;
            if ((vType === "number" || vType === "string") || (v instanceof CanvasGradient || v instanceof CanvasPattern)) {
                if (this._background != v) {
                    this._background = v;
                    this.isDirty = true;
                }
            }
        }
        get isDirty() { return this._isDirty; }
        set isDirty(v) {
            v = !!v;
            if (this._isDirty != v) {
                this._isDirty = v;
                this._redrawHandlers.forEach((a) => a());
            }
        }
        get artboard() { return this._artboard; }
        set artboard(v) {
            if (v instanceof Vgx.Artboard) {
                if (this._artboard) {
                    this._artboard.onPropertyChanged.remove(this._artboardPropertyChanged);
                }
                this._artboard = v;
                this._artboard.onPropertyChanged.add(this._artboardPropertyChanged, this);
                this.isDirty = true;
            }
            else if (!v) {
                if (this._artboard) {
                    this._artboard.onPropertyChanged.remove(this._artboardPropertyChanged);
                }
                this._artboard = null;
                this.isDirty = true;
            }
        }
        registerDirtyEventHandler(eventHandler) {
            if (typeof eventHandler === "function") {
                this._redrawHandlers.push(eventHandler);
            }
        }
        unregisterDirtyEventHandler(eventHandler) {
            if (typeof eventHandler === "function") {
                let index;
                while ((index = this._redrawHandlers.indexOf(eventHandler)) >= 0) {
                    this._redrawHandlers.splice(index, 1);
                }
            }
        }
        getFreeHandle() {
            let handle;
            do {
                handle = Vgx.Utils.createUUID(false).substr(0, 8);
            } while (this._usedHandles.indexOf(handle) != -1);
            this._usedHandles.push(handle);
            return handle;
        }
        addChild(vgxEntity) {
            if (vgxEntity.drawing != this) {
                vgxEntity.addToDrawing(this);
                return;
            }
            this._children.add(vgxEntity);
            this.isDirty = true;
        }
        removeChild(vgxEntity) {
            const index = this._children.indexOf(vgxEntity);
            if (index < 0) {
                return null;
            }
            const result = this._children.elementAt(index);
            this._children.removeAt(index);
            this.isDirty = true;
            return result;
        }
        getChildren() {
            return this._children;
        }
        clear() {
            this._children.clear();
            this.isDirty = true;
        }
        getBounds() {
            const result = Vgx.Rect.empty;
            if (this._artboard) {
                return this._artboard.bounds;
            }
            else {
                if (this._children.count > 0) {
                    for (const child of this._children) {
                        const childBounds = child.getBounds();
                        result.union(childBounds);
                    }
                }
            }
            return result;
        }
    }
    Vgx.Drawing = Drawing;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class DrawingContext {
        constructor(drawing, canvas, viewTransform) {
            this._scaleStyles = true;
            this._drawing = drawing;
            this._canvas = canvas;
            this._viewTransform = viewTransform;
            this._graphics = new Cgx.CoreGraphics(this._canvas);
            this._shadow = new Vgx.Shadow();
        }
        _beginRender() {
            this._graphics.pushTransform(this._viewTransform);
        }
        _endRender() {
            this._graphics.popTransform();
        }
        _getImageData() {
            this._graphics.getImageData(0, 0, this._canvas.width, this._canvas.height);
        }
        _attachToDrawing(drawing) {
            this._drawing = drawing;
        }
        get drawing() { return this._drawing; }
        get fillBrush() { return this._graphics.fillBrush; }
        set fillBrush(v) { this._graphics.fillBrush = v; }
        get fontFamily() { return this._graphics.fontFamily; }
        set fontFamily(v) { this._graphics.fontFamily = v; }
        get fontSize() { return this._graphics.fontSize; }
        set fontSize(v) { this._graphics.fontSize = v; }
        get scaleStyles() { return this._scaleStyles; }
        set scaleStyles(v) { this._scaleStyles = v; }
        get shadow() { return this._shadow; }
        set shadow(v) {
            this._shadow = v;
            this._graphics.shadow = v;
        }
        get strokeBrush() { return this._graphics.strokeBrush; }
        set strokeBrush(v) { this._graphics.strokeBrush = v; }
        get strokeWidth() {
            if (this._scaleStyles) {
                return this._graphics.strokeWidth;
            }
            else {
                return this._graphics.strokeWidth * this._viewTransform.viewZoom;
            }
        }
        set strokeWidth(v) {
            if (this._scaleStyles) {
                this._graphics.strokeWidth = v;
            }
            else {
                this._graphics.strokeWidth = v / this._viewTransform.viewZoom;
            }
        }
        get textBaseline() { return this._graphics.textBaseline; }
        set textBaseline(v) { this._graphics.textBaseline = v; }
        clear(fillBrush = null) {
            this._graphics.clear(fillBrush);
        }
        drawArtboard(artboard, background) {
            const originalStrokeBrush = this.strokeBrush;
            const originalStrokeWidth = this.strokeWidth;
            const originalShadow = this.shadow;
            const originalFillBrush = this.fillBrush;
            this.strokeBrush = null;
            if (artboard.shadow) {
                this.shadow = artboard.shadow;
                this.strokeBrush = null;
                this._graphics.drawRectangle(artboard.bounds.x, artboard.bounds.y, artboard.bounds.width, artboard.bounds.height);
                this.shadow = originalShadow;
            }
            this.strokeBrush = artboard.border;
            this.strokeWidth = artboard.borderWidth;
            this.fillBrush = background || "#ffffff";
            this._graphics.drawRectangle(artboard.bounds.x, artboard.bounds.y, artboard.bounds.width, artboard.bounds.height);
            this.strokeBrush = originalStrokeBrush;
            this.strokeWidth = originalStrokeWidth;
            this.fillBrush = originalFillBrush;
        }
        drawArc(arc) {
            this._graphics.strokeBrush = arc.stroke;
            this.strokeWidth = arc.strokeWidth;
            this._graphics.shadow = arc.shadow;
            this._graphics.drawArc(arc.insertPointX, arc.insertPointY, arc.radius, arc.startAngleRad, arc.endAngleRad, arc.isAntiClockwise, arc.transform);
        }
        drawLine(line) {
            this._graphics.strokeBrush = line.stroke;
            this.strokeWidth = line.strokeWidth;
            this._graphics.shadow = line.shadow;
            this._graphics.drawLine(line.insertPointX, line.insertPointY, line.endPoint.x, line.endPoint.y, line.transform);
        }
        drawRectangle(rectangle) {
            this._graphics.strokeBrush = rectangle.stroke;
            this.strokeWidth = rectangle.strokeWidth;
            this._graphics.fillBrush = rectangle.fill;
            this._graphics.shadow = rectangle.shadow;
            if (rectangle.cornersRadius === 0) {
                this._graphics.drawRectangle(rectangle.insertPointX, rectangle.insertPointY, rectangle.width, rectangle.height, rectangle.transform);
            }
            else {
                this._graphics.drawRoundedRectangle(rectangle.insertPointX, rectangle.insertPointY, rectangle.width, rectangle.height, rectangle.cornersRadius, rectangle.transform);
            }
        }
        drawSquare(square) {
            this._graphics.strokeBrush = square.stroke;
            this.strokeWidth = square.strokeWidth;
            this._graphics.fillBrush = square.fill;
            this._graphics.shadow = square.shadow;
            if (square.cornersRadius === 0) {
                this._graphics.drawSquare(square.insertPointX, square.insertPointY, square.size, square.transform);
            }
            else {
                this._graphics.drawRoundedRectangle(square.insertPointX, square.insertPointY, square.size, square.size, square.cornersRadius, square.transform);
            }
        }
        drawCircle(circle) {
            this._graphics.strokeBrush = circle.stroke;
            this.strokeWidth = circle.strokeWidth;
            this._graphics.fillBrush = circle.fill;
            this._graphics.shadow = circle.shadow;
            this._graphics.drawCircle(circle.insertPointX, circle.insertPointY, circle.radius, circle.transform);
        }
        drawEllipse(ellipse) {
            this._graphics.strokeBrush = ellipse.stroke;
            this.strokeWidth = ellipse.strokeWidth;
            this._graphics.fillBrush = ellipse.fill;
            this._graphics.shadow = ellipse.shadow;
            this._graphics.drawEllipse(ellipse.insertPointX, ellipse.insertPointY, ellipse.xRadius, ellipse.yRadius, ellipse.transform);
        }
        drawPolyline(polyline) {
            this._graphics.strokeBrush = polyline.stroke;
            this.strokeWidth = polyline.strokeWidth;
            this._graphics.fillBrush = polyline.fill;
            this._graphics.shadow = polyline.shadow;
            this._graphics.drawPolyline(polyline.points.toArray(), polyline.transform);
        }
        drawPolygon(polygon) {
            this._graphics.strokeBrush = polygon.stroke;
            this.strokeWidth = polygon.strokeWidth;
            this._graphics.fillBrush = polygon.fill;
            this._graphics.shadow = polygon.shadow;
            this._graphics.drawPolygon(polygon.points.toArray(), polygon.transform);
        }
        drawTriangle(triangle) {
            this._graphics.strokeBrush = triangle.stroke;
            this.strokeWidth = triangle.strokeWidth;
            this._graphics.fillBrush = triangle.fill;
            this._graphics.shadow = triangle.shadow;
            this._graphics.drawTriangle(triangle.point1, triangle.point2, triangle.point3, triangle.transform);
        }
        drawQuad(quad) {
            this._graphics.strokeBrush = quad.stroke;
            this.strokeWidth = quad.strokeWidth;
            this._graphics.fillBrush = quad.fill;
            this._graphics.shadow = quad.shadow;
            this._graphics.drawQuad(quad.point1, quad.point2, quad.point3, quad.point4, quad.transform);
        }
        drawCubicCurve(cubicCurve) {
            this._graphics.strokeBrush = cubicCurve.stroke;
            this.strokeWidth = cubicCurve.strokeWidth;
            this._graphics.fillBrush = cubicCurve.fill;
            this._graphics.shadow = cubicCurve.shadow;
            this._graphics.drawCubicCurve(cubicCurve.points.toArray(), cubicCurve.controlPoints1.toArray(), cubicCurve.controlPoints2.toArray(), cubicCurve.isClosed, cubicCurve.transform);
        }
        drawQuadraticCurve(quadraticCurve) {
            this._graphics.strokeBrush = quadraticCurve.stroke;
            this.strokeWidth = quadraticCurve.strokeWidth;
            this._graphics.fillBrush = quadraticCurve.fill;
            this._graphics.shadow = quadraticCurve.shadow;
            this._graphics.drawQuadraticCurve(quadraticCurve.points.toArray(), quadraticCurve.controlPoints.toArray(), quadraticCurve.isClosed, quadraticCurve.transform);
        }
        drawImage(image) {
            this._graphics.strokeBrush = image.stroke;
            this.strokeWidth = image.strokeWidth;
            this._graphics.shadow = image.shadow;
            this._graphics.drawImage(image.source, image.insertPointX, image.insertPointY, image.width, image.height, image.transform);
        }
        drawText(text, measure = false) {
            this._graphics.strokeBrush = text.stroke;
            this.strokeWidth = text.strokeWidth;
            this._graphics.fillBrush = text.fill;
            this._graphics.shadow = text.shadow;
            this._graphics.fontFamily = text.fontFamily;
            this._graphics.fontSize = text.fontSize + "px";
            this._graphics.textAlign = text.alignment;
            this._graphics.textBaseline = text.baseline;
            this._graphics.drawText(text.insertPointX, text.insertPointY, text.source, text.transform);
            if (measure)
                return this._graphics.measureText(text.source);
        }
        drawPath(path) {
            this._graphics.strokeBrush = path.stroke;
            this.strokeWidth = path.strokeWidth;
            this._graphics.fillBrush = path.fill;
            this._graphics.shadow = path.shadow;
            for (const path2D of path.figures) {
                this._graphics.drawPath2D(path.insertPointX, path.insertPointY, path2D, path.fillRule, path.transform);
            }
        }
        drawPie(pie) {
            this._graphics.strokeBrush = pie.stroke;
            this.strokeWidth = pie.strokeWidth;
            this._graphics.fillBrush = pie.fill;
            this._graphics.shadow = pie.shadow;
            this._graphics.drawPie(pie.insertPointX, pie.insertPointY, pie.radius, pie.startAngleRad, pie.endAngleRad, pie.isAntiClockwise, pie.transform);
        }
        drawDonut(donut) {
            this._graphics.strokeBrush = donut.stroke;
            this.strokeWidth = donut.strokeWidth;
            this._graphics.fillBrush = donut.fill;
            this._graphics.shadow = donut.shadow;
            this._graphics.drawDonut(donut.insertPointX, donut.insertPointY, donut.startRadius, donut.endRadius, donut.startAngleRad, donut.endAngleRad, donut.isAntiClockwise, donut.transform);
        }
        drawGroup(group) {
            this._graphics.strokeBrush = group.stroke;
            this.strokeWidth = group.strokeWidth;
            this._graphics.fillBrush = group.fill;
            this._graphics.shadow = group.shadow;
            var t = new Cgx.Transform();
            t.translationX = group.insertPointX;
            t.translationY = group.insertPointY;
            this._graphics.pushTransform(t);
            this._drawEntityCollection(group.children);
            this._graphics.popTransform();
        }
        drawView(view) {
            this._graphics.strokeBrush = view.stroke;
            this.strokeWidth = view.strokeWidth;
            this._graphics.fillBrush = view.fill;
            this._graphics.shadow = view.shadow;
            const hasClipBounds = view.clip && !Vgx.Rect.isEmpty(view.clipBounds);
            var t = new Cgx.Transform();
            t.translationX = view.insertPointX;
            t.translationY = view.insertPointY;
            this._graphics.pushTransform(t);
            if (hasClipBounds) {
                this._graphics.clipRect(view.clipBounds.x, view.clipBounds.y, view.clipBounds.width, view.clipBounds.height);
            }
            this._drawEntityCollection(view.children);
            if (hasClipBounds) {
                this._graphics.strokeBrush = view.stroke;
                this.strokeWidth = view.strokeWidth;
                this._graphics.drawRectangle(view.clipBounds.x, view.clipBounds.y, view.clipBounds.width, view.clipBounds.height);
            }
            this._graphics.popTransform();
        }
        drawAxes() {
            var localOrigin = this._viewTransform.globalToLocalPoint(0, 0);
            this.strokeWidth = 1;
            this._graphics.strokeBrush = "rgba(255,0,0,0.5)";
            this._graphics.drawLine(0, localOrigin.y, this._graphics.canvasBuffer.width, localOrigin.y);
            this._graphics.strokeBrush = "rgba(0,255,0,0.5)";
            this._graphics.drawLine(localOrigin.x, 0, localOrigin.x, this._graphics.canvasBuffer.height);
        }
        drawDrawing(drawing) {
            if (!drawing.artboard) {
                if (drawing.background) {
                    this.clear(drawing.background);
                }
                else {
                    this.clear();
                }
            }
            else {
                this.clear(drawing.artboard.background);
            }
            this._beginRender();
            if (drawing.artboard) {
                this.drawArtboard(drawing.artboard, drawing.background);
                if (drawing.artboard.clipContent) {
                    this._graphics.clipRect(drawing.artboard.bounds.x, drawing.artboard.bounds.y, drawing.artboard.bounds.width, drawing.artboard.bounds.height);
                }
            }
            var children = drawing.getChildren();
            this._drawEntityCollection(children);
            this._endRender();
        }
        _drawEntityCollection(collection) {
            for (const child of collection) {
                if (child) {
                    if (child.visible) {
                        child.draw(this);
                    }
                }
            }
        }
        measureText(text) { return this._graphics.measureText(text); }
        pushTransform(transform) { return this._graphics.pushTransform(transform); }
        popTransform() { return this._graphics.popTransform(); }
    }
    Vgx.DrawingContext = DrawingContext;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    const customEntityNamePropertyKey = "name";
    const customEntityTypeNamePropertyKey = "typeName";
    const customEntityDefaultValuesPropertyKey = "defaultValues";
    class DrawingLoader {
        static resolveNamespace(nsparts) {
            let currentObject = window;
            for (const part of nsparts) {
                if (Reflect.has(currentObject, part)) {
                    currentObject = Reflect.get(currentObject, part);
                }
                else {
                    return null;
                }
            }
            return currentObject;
        }
        static getVgxType(entityName) {
            let vgxNs = Vgx;
            const entityTypeDefinition = Vgx.EntityTypeManager.getType(entityName);
            if (entityTypeDefinition == null) {
                return null;
            }
            const nsparts = entityTypeDefinition.typeName.split(".");
            const typeName = nsparts[nsparts.length - 1];
            let ns = vgxNs;
            if (nsparts.length > 1) {
                ns = DrawingLoader.resolveNamespace(nsparts.slice(0, nsparts.length - 1));
                if (ns == null) {
                    return null;
                }
            }
            return Reflect.get(ns, typeName);
        }
        static loadCustomEntities(jsonCustomEntities) {
            const drawingCustomEntities = Vgx.DictionaryObject.fromObject(jsonCustomEntities);
            for (const customEntity of drawingCustomEntities) {
                if (!Reflect.has(customEntity, customEntityNamePropertyKey))
                    continue;
                if (!Reflect.has(customEntity, customEntityTypeNamePropertyKey))
                    continue;
                const customEntityNameProperty = Reflect.get(customEntity, customEntityNamePropertyKey);
                const customEntityTypeNameProperty = Reflect.get(customEntity, customEntityTypeNamePropertyKey);
                const customEntityDefaultValuesProperty = Reflect.get(customEntity, customEntityDefaultValuesPropertyKey);
                Vgx.EntityTypeManager.registerType(customEntityNameProperty, customEntityTypeNameProperty, customEntityDefaultValuesProperty);
            }
        }
        static loadChildEntity(typeName, data) {
            const type = DrawingLoader.getVgxType(typeName);
            if (typeof type !== "function") {
                throw new Error("invalid type name '" + typeName + "'");
            }
            const instance = new type();
            if (instance == null) {
                throw new Error("invalid type name '" + typeName + "'");
            }
            instance.loadData(data);
            return instance;
        }
    }
    DrawingLoader.loadFromObject = function (jsonDrawing) {
        if (!("children" in jsonDrawing))
            throw new Error("missing 'children' element");
        var drawing = new Vgx.Drawing();
        if ("customEntities" in jsonDrawing) {
            DrawingLoader.loadCustomEntities(jsonDrawing["customEntities"]);
        }
        for (const child of jsonDrawing.children) {
            const instance = DrawingLoader.loadChildEntity(child[0], child[1]);
            drawing.addChild(instance);
        }
        if ("background" in jsonDrawing) {
            drawing.background = jsonDrawing["background"];
        }
        return drawing;
    };
    Vgx.DrawingLoader = DrawingLoader;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class EntityTransform extends Cgx.Transform {
        constructor(entity) {
            super();
            this._entity = entity;
            this._propertyChanged = (propertyName) => {
                this._entity.geometryDirty = true;
            };
        }
    }
    Vgx.EntityTransform = EntityTransform;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class DictionaryObject {
        constructor() {
            this._keys = [];
            this._values = [];
        }
        static fromObject(obj) {
            const result = new DictionaryObject();
            for (const k of Reflect.ownKeys(obj)) {
                result.set(k, Reflect.get(obj, k));
            }
            return result;
        }
        get count() {
            return this._keys.length;
        }
        get first() {
            if (this._values.length == 0) {
                return undefined;
            }
            return this._values[0];
        }
        get last() {
            if (this._values.length == 0) {
                return undefined;
            }
            return this._values[this._values.length - 1];
        }
        containsKey(key) {
            return this._keys.indexOf(key) >= 0;
        }
        remove(key) {
            const index = this._keys.indexOf(key);
            if (index < 0) {
                return false;
            }
            this._keys.splice(index, 1);
            this._values.splice(index, 1);
            return true;
        }
        get(key) {
            const index = this._keys.indexOf(key);
            if (index < 0) {
                return undefined;
            }
            return this._values[index];
        }
        set(key, value) {
            const index = this._keys.indexOf(key);
            if (index < 0) {
                this._keys.push(key);
                this._values.push(value);
            }
            else {
                this._values[index] = value;
            }
        }
        *[Symbol.iterator]() {
            let i = 0;
            while (i == this._keys.length) {
                yield {
                    key: this._keys[i],
                    value: this._values[i]
                };
            }
        }
    }
    Vgx.DictionaryObject = DictionaryObject;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class EntityTypeManager {
        static registerType(name, typeName, defaultValues = null) {
            if (this._registeredTypes.containsKey(name)) {
                throw new Error(`type '${name}' already defined`);
            }
            const definition = { name, typeName, defaultValues };
            this._registeredTypes.set(name, definition);
        }
        static getType(name, throwException = false) {
            if (!this._registeredTypes.containsKey(name)) {
                if (throwException) {
                    throw new Error(`type '${name}' doesn't exists`);
                }
                else {
                    return null;
                }
            }
            return this._registeredTypes.get(name);
        }
    }
    EntityTypeManager._registeredTypes = new Vgx.DictionaryObject();
    Vgx.EntityTypeManager = EntityTypeManager;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class MathUtils {
        static areClose(value1, value2) {
            if (value1 == value2) {
                return true;
            }
            var n = ((Math.abs(value1) + Math.abs(value2)) + 10.0) * 2.2204460492503131E-16;
            var m = value1 - value2;
            return ((-n < m) && (n > m));
        }
        static isOne(value) {
            return (Math.abs(value - 1.0) < 2.2204460492503131E-15);
        }
        static isZero(value) {
            return (Math.abs(value) < 2.2204460492503131E-15);
        }
        static interpolatePointWithCubicCurves(points, isClosed) {
            if (points.length < 3)
                return [];
            var toRet = [];
            if (isClosed)
                points.push(points[0]);
            for (var i = 0; i < points.length - 1; i++) {
                var x1 = points[i].x;
                var y1 = points[i].y;
                var x2 = points[i + 1].x;
                var y2 = points[i + 1].y;
                var x0;
                var y0;
                var previousPoint;
                if (i == 0) {
                    if (isClosed) {
                        previousPoint = points[points.length - 2];
                        x0 = previousPoint.x;
                        y0 = previousPoint.y;
                    }
                    else {
                        previousPoint = points[i];
                        x0 = previousPoint.x;
                        y0 = previousPoint.y;
                    }
                }
                else {
                    x0 = points[i - 1].x;
                    y0 = points[i - 1].y;
                }
                var x3, y3;
                var nextPoint;
                if (i == points.length - 2) {
                    if (isClosed) {
                        nextPoint = points[1];
                        x3 = nextPoint.x;
                        y3 = nextPoint.y;
                    }
                    else {
                        nextPoint = points[i + 1];
                        x3 = nextPoint.x;
                        y3 = nextPoint.y;
                    }
                }
                else {
                    x3 = points[i + 2].x;
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
        static getPointsBounds(points) {
            if (points.length == 0) {
                return Vgx.Rect.empty;
            }
            if (points.length == 1) {
                return new Vgx.Rect(points[0].x, points[0].y, 0, 0);
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
            return new Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
        }
    }
    Vgx.MathUtils = MathUtils;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class PointDefinition {
        constructor(id, figures) {
            this.anchorX = 0;
            this.anchorY = 0;
            this._id = id;
            this._figures = figures;
        }
        _buildPath() {
            this._vgxPath = new Vgx.VgxPath();
            for (const figure of this._figures) {
                switch (figure.type) {
                    case "arc":
                        this._vgxPath.addArc(figure.insertPointX, figure.insertPointY, figure.radius, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
                        break;
                    case "rect":
                        this._vgxPath.addRect(figure.insertPointX, figure.insertPointY, figure.width, figure.height);
                        break;
                    case "ellipse":
                        this._vgxPath.addEllipse(figure.insertPointX, figure.insertPointY, figure.radiusX, figure.radiusY, figure.rotation || 0, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
                        break;
                    case "path":
                        this._vgxPath.addFigure(figure.data);
                        break;
                }
            }
        }
        get id() { return this._id; }
        getPath() {
            if (this._vgxPath == null) {
                this._buildPath();
            }
            return this._vgxPath;
        }
    }
    Vgx.PointDefinition = PointDefinition;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class PointDefinitions {
        static get type1() {
            return this._type1;
        }
        static get type2() {
            return this._type2;
        }
    }
    PointDefinitions._type1 = new Vgx.PointDefinition("type1", [
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
    ]);
    PointDefinitions._type2 = new Vgx.PointDefinition("type2", [
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
    ]);
    Vgx.PointDefinitions = PointDefinitions;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    function createEmptyRect() {
        return new Rect(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    }
    function createInvalidRect() {
        return new Rect(Number.NaN, Number.NaN, Number.NaN, Number.NaN);
    }
    function unite(baseRect, otherRect) {
        if (!Rect.isEmpty(otherRect)) {
            let left = Math.min(baseRect.x, otherRect.x);
            let top = Math.min(baseRect.y, otherRect.y);
            if ((otherRect.width == Number.POSITIVE_INFINITY) || (baseRect.width == Number.POSITIVE_INFINITY)) {
                baseRect.width = Number.POSITIVE_INFINITY;
            }
            else {
                let right;
                if (baseRect.width == Number.NEGATIVE_INFINITY || baseRect.x == Number.POSITIVE_INFINITY) {
                    right = otherRect.x + otherRect.width;
                }
                else {
                    right = Math.max(baseRect.x + baseRect.width, otherRect.x + otherRect.width);
                }
                baseRect.width = Math.max(right - left, 0.0);
            }
            if ((otherRect.height == Number.POSITIVE_INFINITY) || (baseRect.height == Number.POSITIVE_INFINITY)) {
                baseRect.height = Number.POSITIVE_INFINITY;
            }
            else {
                let bottom;
                if (baseRect.height == Number.NEGATIVE_INFINITY || baseRect.y == Number.POSITIVE_INFINITY) {
                    bottom = otherRect.y + otherRect.height;
                }
                else {
                    bottom = Math.max(baseRect.y + baseRect.height, otherRect.y + otherRect.height);
                }
                baseRect.height = Math.max(bottom - top, 0.0);
            }
            baseRect.x = left;
            baseRect.y = top;
        }
    }
    class Rect {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        static isEmpty(rect) {
            if (!Number.isFinite(rect.x) || !Number.isFinite(rect.y))
                return true;
            return rect.width <= 0 && rect.height <= 0;
        }
        static equals(rect1, rect2) {
            if (rect1 == null && rect2 == null)
                return true;
            if (rect1 == null)
                return false;
            if (rect2 == null)
                return false;
            if (rect1.x != rect2.x)
                return false;
            if (rect1.y != rect2.y)
                return false;
            if (rect1.width != rect2.width)
                return false;
            if (rect1.height != rect2.height)
                return false;
            return true;
        }
        static from(values) {
            return new Rect(values.x, values.y, values.width, values.height);
        }
        union(rect) {
            unite(this, rect);
        }
    }
    Rect.empty = createEmptyRect();
    Rect.invalid = createInvalidRect();
    Vgx.Rect = Rect;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class Shadow extends Vgx.ReactiveObject {
        constructor() {
            super();
            this._blur = 0;
            this._color = "rgba(0,0,0,0)";
            this._offsetX = 0;
            this._offsetY = 0;
        }
        static isDefault(shadow) {
            if (shadow._blur == 0) {
                if (shadow._color == "rgba(0,0,0,0)") {
                    if (shadow._offsetX == 0) {
                        if (shadow._offsetY == 0) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        get blur() { return this._blur; }
        set blur(v) {
            if (typeof (v) === "number") {
                if (this._blur != v) {
                    this._blur = v;
                    this._raisePropertyChanged("blur");
                }
            }
        }
        get color() { return this._color; }
        set color(v) {
            if (typeof (v) === "number" || typeof (v) === "string") {
                if (this._color != v) {
                    this._color = v;
                    this._raisePropertyChanged("color");
                }
            }
        }
        get offsetX() { return this._offsetX; }
        set offsetX(v) {
            if (typeof (v) === "number") {
                if (this._offsetX != v) {
                    this._offsetX = v;
                    this._raisePropertyChanged("offsetX");
                }
            }
        }
        get offsetY() { return this._offsetY; }
        set offsetY(v) {
            if (typeof (v) === "number") {
                if (this._offsetY != v) {
                    this._offsetY = v;
                    this._raisePropertyChanged("offsetY");
                }
            }
        }
    }
    Vgx.Shadow = Shadow;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class TextUtils {
        static initialize() {
            this._canvasBuffer = Cgx.Engine.createCanvas(1, 1);
            this._context = this._canvasBuffer.getContext("2d");
            this._initialized = true;
        }
        static ensureInitialized() {
            if (!this._initialized) {
                this.initialize();
            }
        }
        static estimateFontHeight(fastHeightEstimation) {
            if (fastHeightEstimation) {
                return this.measureTextWidth("M");
            }
            else {
                throw new Error("not implemented");
            }
        }
        static measureTextWidth(text) {
            return this._context.measureText(text).width;
        }
        static measureText(text, fontFamily, fontSize, fastHeightEstimation = true) {
            this.ensureInitialized();
            this._context.font = fontSize + "px " + fontFamily;
            return new Vgx.Rect(0, 0, this.measureTextWidth(text), this.estimateFontHeight(fastHeightEstimation));
        }
        static getTextMetrics(text, fontFamily, fontSize) {
            this.ensureInitialized();
            this._context.font = fontSize + "px " + fontFamily;
            return this._context.measureText(text);
        }
    }
    TextUtils._initialized = false;
    Vgx.TextUtils = TextUtils;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    let _lastUUIDDate = Date.now();
    function hue2rgb(p, q, t) {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    class Utils {
        static createUUID(includeSeparators = false) {
            let d = new Date().getTime();
            while (_lastUUIDDate === d) {
                d = new Date().getTime();
            }
            _lastUUIDDate = d;
            let template = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
            if (includeSeparators)
                template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
            return template.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }
        static createCanvasColorOrBrush(canvas, value) {
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
            else if (value instanceof Cgx.LinearGradientBrush) {
                return canvas.getContext("2d").createLinearGradient(value.x0, value.y0, value.x1, value.y1);
            }
            else if (value instanceof Cgx.RadialGradientBrush) {
                return canvas.getContext("2d").createRadialGradient(value.x0, value.y0, value.r0, value.x1, value.y1, value.r1);
            }
            else if (value instanceof Cgx.PatternBrush) {
                return canvas.getContext("2d").createPattern(value.image, value.repetition);
            }
        }
        static hslToRgb(h, s, l) {
            let r, g, b;
            if (s == 0) {
                r = g = b = l;
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
        static getEntitiesBounds(entities, originX, originY) {
            let result = new Vgx.Rect();
            for (const element of entities) {
                result.union(element.getBounds());
            }
            if (typeof originX === "number") {
                result.x += originX;
            }
            if (typeof originX === "number") {
                result.y += originY;
            }
            return result;
        }
    }
    Vgx.Utils = Utils;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class Vars {
        static get pointType() { return this._pointType; }
        static set pointType(v) { this._pointType = v; }
        static get pointSize() { return this._pointSize; }
        static set pointSize(v) { this._pointSize = v; }
        static get fontFamily() { return this._fontFamily; }
        static set fontFamily(v) { this._fontFamily = v; }
        static get fontSize() { return this._fontSize; }
        static set fontSize(v) { this._fontSize = v; }
        static get vertexSize() { return this._vertexSize; }
        static set vertexSize(v) { this._vertexSize = v; }
        static get vertexFillColor() { return this._vertexFill; }
        static set vertexFillColor(v) { this._vertexFill = v; }
        static get vertexStrokeColor() { return this._vertexStroke; }
        static set vertexStrokeColor(v) { this._vertexStroke = v; }
        static get vertexStrokeWidth() { return this._vertexStrokeWidth; }
        static set vertexStrokeWidth(v) { this._vertexStrokeWidth = v; }
    }
    Vars._pointType = Vgx.PointDefinitions.type1;
    Vars._pointSize = 20;
    Vars._fontFamily = "Arial";
    Vars._fontSize = 16;
    Vars._vertexSize = 4;
    Vars._vertexFill = "#ddeeff";
    Vars._vertexStroke = "#8888ff";
    Vars._vertexStrokeWidth = 1.3;
    Vars.defaultStrokeStyle = "transparent";
    Vars.defaultStrokeWidth = 0;
    Vars.defaultFillStyle = 0xffffff;
    Vgx.Vars = Vars;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class ViewTransform {
        constructor() {
            this._matrix = new Cgx.Matrix();
            this._isDirty = true;
            this._viewZoom = 1;
            this._viewTargetX = 0;
            this._viewTargetY = 0;
            this._viewPixelWidth = 1;
            this._viewPixelHeight = 1;
            this._viewPixelHalfWidth = this._viewPixelWidth * 0.5;
            this._viewPixelHalfHeight = this._viewPixelHeight * 0.5;
        }
        _computeInternalMatrix() {
            this._matrix.reset();
            this._matrix.translate(this._viewPixelHalfWidth, this._viewPixelHalfHeight);
            this._matrix.scale(this._viewZoom, this._viewZoom);
            this._matrix.translate(-this._viewTargetX, -this._viewTargetY);
            this._isDirty = false;
            this._matrixInverted = null;
            this._setTarget(this._viewTargetX, this._viewTargetY);
        }
        _getMatrixInverted() {
            this.getMatrix();
            if (this._matrix.hasInverse()) {
                if (this._matrixInverted == null) {
                    this._matrixInverted = Cgx.Matrix.invert(this._matrix);
                }
                return this._matrixInverted;
            }
            else {
                return this._matrix;
            }
        }
        _setMatrixOffset(offsetX, offsetY) {
            this._matrix.offsetX = offsetX;
            this._matrix.offsetY = offsetY;
        }
        _setTarget(x, y) {
            const globalViewRect = this.localToGlobalRect(0, 0, this._viewPixelWidth, this._viewPixelHeight);
            var offsetX = -x + (globalViewRect.width * 0.5);
            var offsetY = -y + (globalViewRect.height * 0.5);
            offsetX *= this._viewZoom;
            offsetY *= this._viewZoom;
            this._setMatrixOffset(offsetX, offsetY);
            this._viewTargetX = x;
            this._viewTargetY = y;
        }
        get viewTargetX() { return this._viewTargetX; }
        get viewTargetY() { return this._viewTargetY; }
        get viewZoom() { return this._viewZoom; }
        getMatrix() {
            if (this._isDirty) {
                this._computeInternalMatrix();
            }
            return this._matrix;
        }
        getViewBounds() {
            return this.localToGlobalRect(0, 0, this._viewPixelWidth, this._viewPixelHeight);
        }
        globalToLocalPoint(x, y) {
            return this.getMatrix().transformPoint(x, y);
        }
        globalToLocalRect(x, y, width, height) {
            return this.getMatrix().transformRect(x, y, width, height);
        }
        localToGlobalPoint(x, y) {
            return this._getMatrixInverted().transformPoint(x, y);
        }
        localToGlobalRect(x, y, width, height) {
            return this._getMatrixInverted().transformRect(x, y, width, height);
        }
        moveViewTarget(dx, dy) {
            this._setTarget(this._viewTargetX + dx, this._viewTargetY + dy);
            this._isDirty = true;
        }
        setViewPixelSize(width, height) {
            this._viewPixelWidth = width;
            this._viewPixelHeight = height;
            this._viewPixelHalfWidth = this._viewPixelWidth * 0.5;
            this._viewPixelHalfHeight = this._viewPixelHeight * 0.5;
            this._isDirty = true;
        }
        setViewTarget(tx, ty) {
            this._setTarget(tx, ty);
            this._isDirty = true;
        }
        setViewZoom(value) {
            this._viewZoom = value;
            this._isDirty = true;
        }
        setViewZoomTo(value, tx, ty) {
            this._setTarget(tx, ty);
            this._viewZoom *= value;
            this._isDirty = true;
        }
    }
    Vgx.ViewTransform = ViewTransform;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class Collection {
        constructor() {
            this._items = [];
        }
        *[Symbol.iterator]() {
            yield* this._items;
        }
        _getItems() {
            return this._items;
        }
        add(item) {
            return this.insert(this._items.length - 1, item);
        }
        addRange(items) {
            return this.insertRange(this._items.length - 1, items);
        }
        elementAt(index) {
            return this._items[index];
        }
        indexOf(value, selector = null) {
            if (typeof selector === "function") {
                let result = -1;
                let i = 0;
                for (const element of this._items) {
                    if (selector(element) === value) {
                        result = i;
                        break;
                    }
                    i++;
                }
                return result;
            }
            else {
                return this._items.indexOf(value);
            }
        }
        toArray() {
            return this._items.slice(0);
        }
        get count() { return this._items.length; }
        _onClearCompleted(items) { }
        _onInsertCompleted(index, items) { }
        _onRemoveCompleted(index, items) { }
        clear() {
            const oldItems = this._items;
            this._items = [];
            this._onClearCompleted(oldItems);
        }
        insert(index, item) {
            if (index < 0)
                index = 0;
            if (index >= this._items.length)
                index = this._items.length;
            if (index === this._items.length) {
                this._items.push(item);
            }
            else {
                this._items.splice(index, 0, item);
            }
            this._onInsertCompleted(index, [item]);
            return index;
        }
        insertRange(index, items) {
            let i;
            if (index < 0)
                index = 0;
            if (index >= this._items.length)
                index = this._items.length;
            if (index === this._items.length) {
                for (const item of items) {
                    this._items.push(item);
                }
            }
            else {
                this._items.splice(index, 0, ...items);
            }
            if (this._items.length > index) {
                this._onInsertCompleted(index, items);
            }
            return index;
        }
        remove(value, selector = null) {
            let itemIndex = this.indexOf(value, selector);
            if (itemIndex === -1) {
                return false;
            }
            const deletedItems = this._items.splice(itemIndex, 1);
            this._onRemoveCompleted(itemIndex, deletedItems);
            return true;
        }
        removeAt(index) {
            if (index < 0 || index >= this._items.length) {
                return null;
            }
            const deletedItems = this._items.splice(index, 1);
            this._onRemoveCompleted(index, deletedItems);
            return deletedItems[0];
        }
        removeAny(predicate) {
            let deletedItems = [];
            let index = -1;
            let i = 0;
            for (const element of this._items) {
                if (predicate(element)) {
                    deletedItems.push(element);
                    if (index < 0) {
                        index = i;
                    }
                    this._items.splice(i, 1);
                }
                i++;
            }
            if (deletedItems.length > 0) {
                this._onRemoveCompleted(index, deletedItems);
            }
            return deletedItems;
        }
    }
    Vgx.Collection = Collection;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    ;
    class EventSet {
        constructor(eventGroup, eventName, bindTarget) {
            this._bindTarget = bindTarget;
            this._eventsManager = eventGroup;
            this._eventName = eventName;
        }
        add(handler, bindTarget) {
            this._eventsManager.attach(this._eventName, handler, { once: false }, bindTarget || this._bindTarget);
        }
        once(handler) {
            this._eventsManager.attach(this._eventName, handler, { once: true }, this._bindTarget);
        }
        remove(handler) {
            this._eventsManager.detach(this._eventName, handler);
        }
        has(handler) {
            return this._eventsManager.hasHandler(this._eventName, handler);
        }
        trigger(args) {
            this._eventsManager.trigger(this._eventName, args);
        }
        stop() {
            this._eventsManager.stop(this._eventName);
        }
        resume() {
            this._eventsManager.resume(this._eventName);
        }
    }
    Vgx.EventSet = EventSet;
    class EventsManager {
        constructor(owner) {
            this._validEventOptions = ["once"];
            this._disabledEventsNames = [];
            this._owner = owner;
            this._events = new Map();
        }
        getHandlerEntryIndex(evntGroup, eventHandler) {
            var positions = evntGroup.entries.map((v, i) => v.handler === eventHandler ? i : -1).filter(v => v >= 0);
            if (positions.length == 0) {
                return -1;
            }
            return positions[0];
        }
        attach(eventName, eventHandler, eventOptions, bindTarget) {
            if (typeof eventHandler !== "function") {
                return;
            }
            let lowerEventName = eventName.toLowerCase();
            let eventEntry = {
                handler: eventHandler,
                options: eventOptions,
                bindTarget: bindTarget
            };
            if (this._events.has(lowerEventName)) {
                let eventGroupEntry = this._events.get(lowerEventName);
                eventGroupEntry.entries.push(eventEntry);
            }
            else {
                let eventGroupEntry = {
                    eventName: eventName,
                    entries: [eventEntry]
                };
                this._events.set(lowerEventName, eventGroupEntry);
            }
        }
        detach(eventName, eventHandler) {
            if (typeof eventHandler !== "function") {
                return;
            }
            let lowerEventName = eventName.toLowerCase();
            if (!this._events.has(lowerEventName)) {
                return;
            }
            let eventGroupEntry = this._events.get(lowerEventName);
            let entryIndex = this.getHandlerEntryIndex(eventGroupEntry, eventHandler);
            if (entryIndex >= 0) {
                eventGroupEntry.entries.splice(entryIndex, 1);
            }
        }
        trigger(eventName, args) {
            var lowerEventName = eventName.toLowerCase();
            if (!this._events.has(lowerEventName)) {
                return;
            }
            let eventGroupEntry = this._events.get(lowerEventName);
            var disabledEventIndex = this._disabledEventsNames.indexOf(lowerEventName);
            if (disabledEventIndex !== -1 || this._disabledEventsNames.indexOf("*") !== -1)
                return;
            let handlersToDetach = [];
            for (let eventEntry of eventGroupEntry.entries) {
                let handler = eventEntry.handler;
                if (eventEntry.bindTarget) {
                    handler = eventEntry.handler.bind(eventEntry.bindTarget);
                }
                let removeAfter = false;
                if (eventEntry.options && "once" in eventEntry.options) {
                    removeAfter = !!eventEntry.options.once;
                }
                handler(this._owner, args);
                if (removeAfter) {
                    handlersToDetach.push(handler);
                }
            }
            for (let detachableHandler of handlersToDetach) {
                this.detach(eventName, detachableHandler);
            }
        }
        getHandlersCount(eventName) {
            let lowerEventName = eventName.toLowerCase();
            if (!this._events.has(lowerEventName)) {
                return 0;
            }
            return this._events.get(lowerEventName).entries.length;
        }
        hasHandler(eventName, eventHandler) {
            if (typeof eventHandler !== "function") {
                return false;
            }
            let lowerEventName = eventName.toLowerCase();
            if (!this._events.has(lowerEventName)) {
                return false;
            }
            let eventGroupEntry = this._events.get(lowerEventName);
            return this.getHandlerEntryIndex(eventGroupEntry, eventHandler) >= 0;
        }
        stop(eventName) {
            if (typeof eventName === "undefined") {
                this._disabledEventsNames = ["*"];
            }
            else if (typeof eventName === "string") {
                var eventIndex = this._disabledEventsNames.indexOf(eventName.toLowerCase());
                if (eventIndex != -1)
                    return;
                this._disabledEventsNames.push(eventName.toLowerCase());
            }
        }
        resume(eventName) {
            if (typeof eventName === "undefined") {
                this._disabledEventsNames = [];
            }
            else if (typeof eventName === "string") {
                var eventIndex = this._disabledEventsNames.indexOf(eventName.toLowerCase());
                if (eventIndex == -1)
                    return;
                this._disabledEventsNames.splice(eventIndex, 1);
            }
        }
        create(eventName) {
            var eventGroupObj = new EventSet(this, eventName);
            var descriptor = {
                enumerable: true,
                value: eventGroupObj
            };
            if (!(eventName in this._owner)) {
                Object.defineProperty(this._owner, eventName, descriptor);
            }
            return eventGroupObj;
        }
        createEventArgs(data) {
            var result = {};
            if (typeof data === "object") {
                for (let k in Object.keys(data)) {
                    result[k] = data[k];
                }
            }
            return result;
        }
    }
    Vgx.EventsManager = EventsManager;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    let CollectionChangedAction;
    (function (CollectionChangedAction) {
        CollectionChangedAction[CollectionChangedAction["Added"] = 0] = "Added";
        CollectionChangedAction[CollectionChangedAction["Removed"] = 1] = "Removed";
        CollectionChangedAction[CollectionChangedAction["Cleared"] = 2] = "Cleared";
    })(CollectionChangedAction = Vgx.CollectionChangedAction || (Vgx.CollectionChangedAction = {}));
    class ReactiveCollection extends Vgx.Collection {
        constructor() {
            super();
            this._events = new Vgx.EventsManager(this);
            this.onCollectionChanged = new Vgx.EventSet(this._events, "onCollectionChanged");
        }
        _raiseCollectionChanged(action, index, items) {
            this._events.trigger("onCollectionChanged", {
                action,
                index,
                items
            });
        }
        _onClearCompleted(items) {
            this._raiseCollectionChanged(CollectionChangedAction.Cleared, 0, items);
        }
        _onInsertCompleted(index, items) {
            this._raiseCollectionChanged(CollectionChangedAction.Added, index, items);
        }
        _onRemoveCompleted(index, items) {
            this._raiseCollectionChanged(CollectionChangedAction.Removed, index, items);
        }
    }
    Vgx.ReactiveCollection = ReactiveCollection;
})(Vgx || (Vgx = {}));
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Vgx;
(function (Vgx) {
    class Importer {
        loadFile(url) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield fetch(url);
                const text = yield response.text();
                return this.load(text);
            });
        }
    }
    Vgx.Importer = Importer;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class ImportersManager {
        static registerType(name, typeName, mimeTypes = null, defaultValues = null) {
            if (this._registeredTypes.containsKey(name)) {
                throw new Error(`importer '${name}' already defined`);
            }
            const definition = { name, typeName, mimeTypes, defaultValues };
            this._registeredTypes.set(name, definition);
        }
        static registerTypeAsDefault(name, typeName, mimeTypes = null, defaultValues = null) {
            this.registerType(name, typeName, mimeTypes, defaultValues);
            this._defaultType = this._registeredTypes.get(name);
        }
        static getDefault() {
            if (this._defaultType) {
                return this._defaultType;
            }
            if (this._registeredTypes.count > 0) {
                return this._registeredTypes.first;
            }
            return null;
        }
        static getType(name, throwException = false) {
            if (!this._registeredTypes.containsKey(name)) {
                if (throwException) {
                    throw new Error(`type '${name}' doesn't exists`);
                }
                else {
                    return null;
                }
            }
            return this._registeredTypes.get(name);
        }
        static getTypeOrDefault(name) {
            let type = this.getType(name, false);
            if (!type) {
                type = this.getDefault();
            }
            return type;
        }
    }
    ImportersManager._registeredTypes = new Vgx.DictionaryObject();
    Vgx.ImportersManager = ImportersManager;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class JsonImporter extends Vgx.Importer {
        load(source) {
            return new Promise((resolve, reject) => {
                try {
                    let drawing;
                    if (typeof (source) === "string") {
                        const jobject = JSON.parse(source);
                        drawing = Vgx.DrawingLoader.loadFromObject(jobject);
                    }
                    else if (typeof (source) === "object") {
                        drawing = Vgx.DrawingLoader.loadFromObject(source);
                    }
                    else {
                        throw new Error(`unexpected type ${typeof (source)}`);
                    }
                    resolve(drawing);
                }
                catch (err) {
                    reject(err);
                }
            });
        }
    }
    Vgx.JsonImporter = JsonImporter;
    Vgx.ImportersManager.registerTypeAsDefault("json", "Vgx.JsonImporter", ["application/json"]);
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class ScriptImporter extends Vgx.Importer {
        load(source) {
            return new Promise((resolve, reject) => {
                try {
                    var drawing = new Vgx.Drawing();
                    const func = new Function("drawing", source);
                    func.call(null, drawing);
                    resolve(drawing);
                }
                catch (err) {
                    reject(err);
                }
            });
        }
    }
    Vgx.ScriptImporter = ScriptImporter;
    Vgx.ImportersManager.registerType("script", "Vgx.ScriptImporter", ["text/javascript "]);
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class SvgImporter {
        constructor() {
        }
        loadSvgFile(url) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield fetch(url);
                const svgCode = yield response.text();
                return this.loadSvgCode(svgCode);
            });
        }
        loadSvgCode(svgCode) {
            const result = new Vgx.Drawing();
            const parser = new DOMParser();
            const document = parser.parseFromString(svgCode, "image/svg+xml");
            return result;
        }
        loadSvg(svg) {
            return __awaiter(this, void 0, void 0, function* () {
                if (svg.startsWith('<')) {
                    return this.loadSvgCode(svg);
                }
                return this.loadSvgFile(svg);
            });
        }
    }
    Vgx.SvgImporter = SvgImporter;
    Vgx.ImportersManager.registerType("svg", "Vgx.SvgImporter", ["image/svg+xml"]);
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxObject {
        constructor() {
            this._bindings = {};
            this._events = new Vgx.EventsManager(this);
            this.onHandleCreated = new Vgx.EventSet(this._events, "onHandleCreated");
            this.onHandleDestroyed = new Vgx.EventSet(this._events, "onHandleDestroyed");
        }
        _addToDrawing() {
            this._handle = this._drawing.getFreeHandle();
            if (this) {
                this._drawing.addChild(this);
                this._addedToDrawing();
            }
            this._events.trigger("onHandleCreated", {});
        }
        _removeFromDrawing() {
            if (this._handle) {
                this._handle = null;
                this._events.trigger("onHandleDestroyed", {});
            }
            if (this._drawing) {
                if (this) {
                    this._drawing.removeChild(this);
                }
            }
        }
        _addedToDrawing() { }
        _getValue(propertyName, defaultValue) {
            if (propertyName in this._bindings) {
                return this._bindings[propertyName]();
            }
            else {
                return defaultValue;
            }
        }
        get drawing() { return this._drawing; }
        get handle() { return this._handle; }
        addToDrawing(drawing) {
            if (this._drawing != drawing) {
                this.removeFromDrawing();
                this._drawing = drawing;
                this._addToDrawing();
            }
        }
        removeFromDrawing() {
            this._removeFromDrawing();
        }
        setBinding(propertyName, binding) {
            if (!binding) {
                delete this._bindings[propertyName];
            }
            else {
                this._bindings[propertyName] = binding;
            }
        }
    }
    Vgx.VgxObject = VgxObject;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxDrawable extends Vgx.VgxObject {
        constructor() {
            super();
            this._visible = true;
            this._appearanceDirty = true;
            this._geometryDirty = true;
            this._positionDirty = true;
        }
        draw(drawingContext) { }
        get appearanceDirty() { return this._appearanceDirty; }
        set appearanceDirty(v) {
            v = !!v;
            this._appearanceDirty = v;
            if (v && this.drawing)
                this.drawing.isDirty = true;
        }
        get geometryDirty() { return this._geometryDirty; }
        set geometryDirty(v) {
            v = !!v;
            this._geometryDirty = v;
            if (v && this.drawing)
                this.drawing.isDirty = true;
        }
        get positionDirty() { return this._positionDirty; }
        set positionDirty(v) {
            v = !!v;
            this._positionDirty = v;
            if (v && this.drawing)
                this.drawing.isDirty = true;
        }
        get visible() { return this._visible; }
        set visible(v) {
            if (this._visible != v) {
                this._visible = v;
                this.appearanceDirty = true;
                if (this.drawing) {
                    this.drawing.isDirty = true;
                }
            }
        }
    }
    Vgx.VgxDrawable = VgxDrawable;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxEntity extends Vgx.VgxDrawable {
        constructor() {
            super();
            this._insertPointX = 0;
            this._insertPointY = 0;
            this._stroke = null;
            this._strokeWidth = Vgx.Vars.defaultStrokeWidth;
            this._shadow = new Vgx.Shadow();
            this._shadow.onPropertyChanged.add(function () { this.appearanceDirty = true; }, {});
            this._transform = new Vgx.EntityTransform(this);
            this._cachedBounds = new Vgx.Rect();
        }
        _getVertices() {
            return [{
                    x: this._getValue("insertPointX", this._insertPointX),
                    y: this._getValue("insertPointY", this._insertPointY)
                }];
        }
        _getBounds() {
            return Vgx.Rect.empty;
        }
        loadData(data) {
            for (const n in data) {
                if (!(Reflect.has(this, n)))
                    continue;
                const propDesc = Object.getOwnPropertyDescriptor(this, n);
                if (propDesc && (!propDesc.writable || !propDesc.get)) {
                }
                else {
                    Reflect.set(this, n, data[n]);
                }
            }
        }
        getBounds() {
            if (this.geometryDirty) {
                var bounds = this._getBounds();
                if (!this._transform.isIdentity) {
                    var mtx = this.transform.getMatrix().clone();
                    mtx.offsetX = -(this.insertPointX + this.transform.originX);
                    mtx.offsetY = -(this.insertPointY + this.transform.originY);
                    this._cachedBounds = Vgx.Rect.from(mtx.transformRect(bounds.x, bounds.y, bounds.width, bounds.height));
                }
                else {
                    this._cachedBounds = bounds;
                }
            }
            return this._cachedBounds;
        }
        get insertPointX() { return this._getValue("insertPointX", this._insertPointX); }
        set insertPointX(v) {
            if (this._insertPointX != v) {
                this._insertPointX = v;
                this.positionDirty = true;
            }
        }
        get insertPointY() { return this._getValue("insertPointY", this._insertPointY); }
        set insertPointY(v) {
            if (this._insertPointY != v) {
                this._insertPointY = v;
                this.positionDirty = true;
            }
        }
        get stroke() { return this._getValue("stroke", this._stroke); }
        set stroke(v) {
            if (this._stroke != v) {
                this._stroke = v;
                this.appearanceDirty = true;
            }
        }
        get strokeWidth() { return this._getValue("strokeWidth", this._strokeWidth); }
        set strokeWidth(v) {
            if (this._strokeWidth != v) {
                this._strokeWidth = v;
                this.appearanceDirty = true;
            }
        }
        get shadow() { return this._shadow; }
        get transform() { return this._getValue("transform", this._transform); }
        set transform(v) {
            this._transform.translationX = v.translationX;
            this._transform.translationY = v.translationY;
            this._transform.scaleX = v.scaleX;
            this._transform.scaleY = v.scaleY;
            this._transform.rotation = v.rotation;
            this._transform.originX = v.originX;
            this._transform.originY = v.originY;
        }
    }
    Vgx.VgxEntity = VgxEntity;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    const degToRad = 0.017453292519943295;
    class VgxArc extends Vgx.VgxEntity {
        constructor() {
            super();
            this._radius = 0;
            this._startAngle = 0;
            this._endAngle = 0;
            this._startAngleRad = 0;
            this._endAngleRad = 0;
            this._isAntiClockwise = false;
        }
        _getBounds() {
            var xsa = Math.cos(this._startAngleRad) * this._radius;
            var ysa = Math.sin(this._startAngleRad) * this._radius;
            var xea = Math.cos(this._endAngleRad) * this._radius;
            var yea = Math.sin(this._endAngleRad) * this._radius;
            var x1 = Math.min(xsa, xea);
            var y1 = Math.min(ysa, yea);
            var x2 = Math.max(xsa, xea);
            var y2 = Math.max(ysa, yea);
            return new Vgx.Rect(this.insertPointX + x1, this.insertPointY + y1, x2 - x1, y2 - y1);
        }
        _getPath() {
            return null;
        }
        get radius() { return this._radius; }
        set radius(v) {
            if (this._radius != v) {
                this._radius = v;
                this.geometryDirty = true;
            }
        }
        get startAngle() { return this._startAngle; }
        set startAngle(v) {
            if (this._startAngle != v) {
                this._startAngle = v;
                this._startAngleRad = v * degToRad;
                this.geometryDirty = true;
            }
        }
        get startAngleRad() { return this._startAngleRad; }
        set startAngleRad(v) {
            if (this._startAngleRad != v) {
                this._startAngleRad = v;
                this._startAngle = v / degToRad;
                this.geometryDirty = true;
            }
        }
        get endAngle() { return this._endAngle; }
        set endAngle(v) {
            if (this._endAngle != v) {
                this._endAngle = v;
                this._endAngleRad = v * degToRad;
                this.geometryDirty = true;
            }
        }
        get endAngleRad() { return this._endAngleRad; }
        set endAngleRad(v) {
            if (this._endAngleRad != v) {
                this._endAngleRad = v;
                this._endAngle = v / degToRad;
                this.geometryDirty = true;
            }
        }
        get isAntiClockwise() { return this._isAntiClockwise; }
        set isAntiClockwise(v) {
            if (this._isAntiClockwise != v) {
                this._isAntiClockwise = v;
                this.geometryDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawArc(this);
        }
    }
    Vgx.VgxArc = VgxArc;
    Vgx.EntityTypeManager.registerType("Arc", "Vgx.VgxArc");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxFillableEntity extends Vgx.VgxEntity {
        get fill() { return this._getValue("fill", this._fill); }
        set fill(v) {
            if (this._fill != v) {
                this._fill = v;
                this.appearanceDirty = true;
            }
        }
    }
    Vgx.VgxFillableEntity = VgxFillableEntity;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxCircle extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._radius = 0;
        }
        _getBounds() {
            var x = this.insertPointX - this._radius;
            var y = this.insertPointY - this._radius;
            var w = this._radius * 2;
            var h = this._radius * 2;
            return new Vgx.Rect(x, y, w, h);
        }
        _getPath() {
            return null;
        }
        get radius() { return this._radius; }
        set radius(v) {
            if (this._radius != v) {
                this._radius = v;
                this.geometryDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawCircle(this);
        }
    }
    Vgx.VgxCircle = VgxCircle;
    Vgx.EntityTypeManager.registerType("Circle", "Vgx.VgxCircle");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxCubicCurve extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._points = new Vgx.ReactiveCollection();
            this._points.onCollectionChanged.add((s, e) => this.updateBounds());
            this._controlPoints1 = new Vgx.ReactiveCollection();
            this._controlPoints2 = new Vgx.ReactiveCollection();
            this.isClosed = true;
        }
        _getBounds() {
            return this._bounds;
        }
        updateBounds() {
            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxX = Number.MIN_VALUE;
            let maxY = Number.MIN_VALUE;
            for (const p of this._points) {
                if (p) {
                    minX = Math.min(minX, p.x);
                    minY = Math.min(minY, p.y);
                    maxX = Math.max(maxX, p.x);
                    maxY = Math.max(maxY, p.y);
                }
            }
            this._bounds = new Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
        }
        loadData(data) {
            super.loadData(data);
            if (Reflect.has(data, "points")) {
                this.points.clear();
                this.points.addRange(data.points);
            }
            if (Reflect.has(data, "controlPoints1")) {
                this.controlPoints1.clear();
                this.controlPoints1.addRange(data.controlPoints1);
            }
            if (Reflect.has(data, "controlPoints2")) {
                this.controlPoints2.clear();
                this.controlPoints2.addRange(data.controlPoints2);
            }
        }
        _getPath() {
            return null;
        }
        get points() { return this._points; }
        get controlPoints1() { return this._controlPoints1; }
        get controlPoints2() { return this._controlPoints2; }
        draw(drawingContext) {
            drawingContext.drawCubicCurve(this);
        }
    }
    Vgx.VgxCubicCurve = VgxCubicCurve;
    Vgx.EntityTypeManager.registerType("CubicCurve", "Vgx.VgxCubicCurve");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    const degToRad = 0.017453292519943295;
    class VgxDonut extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._startRadius = 0;
            this._endRadius = 0;
            this._startAngle = 0;
            this._endAngle = 0;
            this._startAngleRad = 0;
            this._endAngleRad = 0;
            this._isAntiClockwise = false;
        }
        _getBounds() {
            let radius = Math.max(this._startRadius, this._endRadius);
            var xsa = Math.cos(this._startAngleRad) * radius;
            var ysa = Math.sin(this._startAngleRad) * radius;
            var xea = Math.cos(this._endAngleRad) * radius;
            var yea = Math.sin(this._endAngleRad) * radius;
            var x1 = Math.min(xsa, xea);
            var y1 = Math.min(ysa, yea);
            var x2 = Math.max(xsa, xea);
            var y2 = Math.max(ysa, yea);
            return new Vgx.Rect(this.insertPointX + x1, this.insertPointY + y1, x2 - x1, y2 - y1);
        }
        _getPath() {
            return null;
        }
        get startRadius() { return this._startRadius; }
        set startRadius(v) {
            if (this._startRadius != v) {
                this._startRadius = v;
                this.geometryDirty = true;
            }
        }
        get endRadius() { return this._endRadius; }
        set endRadius(v) {
            if (this._endRadius != v) {
                this._endRadius = v;
                this.geometryDirty = true;
            }
        }
        get startAngle() { return this._startAngle; }
        set startAngle(v) {
            if (this._startAngle != v) {
                this._startAngle = v;
                this._startAngleRad = v * degToRad;
                this.geometryDirty = true;
            }
        }
        get startAngleRad() { return this._startAngleRad; }
        set startAngleRad(v) {
            if (this._startAngleRad != v) {
                this._startAngleRad = v;
                this._startAngle = v / degToRad;
                this.geometryDirty = true;
            }
        }
        get endAngle() { return this._endAngle; }
        set endAngle(v) {
            if (this._endAngle != v) {
                this._endAngle = v;
                this._endAngleRad = v * degToRad;
                this.geometryDirty = true;
            }
        }
        get endAngleRad() { return this._endAngleRad; }
        set endAngleRad(v) {
            if (this._endAngleRad != v) {
                this._endAngleRad = v;
                this._endAngle = v / degToRad;
                this.geometryDirty = true;
            }
        }
        get isAntiClockwise() { return this._isAntiClockwise; }
        set isAntiClockwise(v) {
            if (this._isAntiClockwise != v) {
                this._isAntiClockwise = v;
                this.geometryDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawDonut(this);
        }
    }
    Vgx.VgxDonut = VgxDonut;
    Vgx.EntityTypeManager.registerType("Donut", "Vgx.VgxDonut");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxEllipse extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._xRadius = 0;
            this._yRadius = 0;
        }
        _getBounds() {
            const x = this.insertPointX - this._xRadius;
            const y = this.insertPointY - this._yRadius;
            const w = this._xRadius * 2;
            const h = this._yRadius * 2;
            return new Vgx.Rect(x, y, w, h);
        }
        _getPath() {
            return null;
        }
        get xRadius() { return this._xRadius; }
        set xRadius(v) {
            if (this._xRadius != v) {
                this._xRadius = v;
                this.geometryDirty = true;
            }
        }
        get yRadius() { return this._yRadius; }
        set yRadius(v) {
            if (this._yRadius != v) {
                this._yRadius = v;
                this.geometryDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawEllipse(this);
        }
    }
    Vgx.VgxEllipse = VgxEllipse;
    Vgx.EntityTypeManager.registerType("Ellipse", "Vgx.VgxEllipse");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxEntityCollection extends Vgx.ReactiveCollection {
        constructor(owner) {
            super();
            this._owner = owner;
        }
        ofType(type) {
            var items = this._getItems();
            return items.filter(x => x instanceof type);
        }
        get owner() { return this._owner; }
    }
    Vgx.VgxEntityCollection = VgxEntityCollection;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxGroup extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._children = new Vgx.VgxEntityCollection(this);
            this._children.onCollectionChanged.add((s, e) => this.updateBounds());
        }
        _getBounds() {
            return this._bounds;
        }
        updateBounds() {
            this._bounds = Vgx.Utils.getEntitiesBounds(this._children, this.insertPointX, this.insertPointY);
        }
        loadData(data) {
            super.loadData(data);
            if (Reflect.has(data, "children")) {
                this.children.clear();
                for (const childItem of data.children) {
                    const typeName = childItem[0];
                    const childData = childItem[1];
                    var childElement = Vgx.DrawingLoader.loadChildEntity(typeName, childData);
                    if (childElement != null)
                        this.children.add(childElement);
                }
            }
        }
        _getPath() {
            return null;
        }
        get children() { return this._children; }
        draw(drawingContext) {
            drawingContext.drawGroup(this);
        }
    }
    Vgx.VgxGroup = VgxGroup;
    Vgx.EntityTypeManager.registerType("Group", "Vgx.VgxGroup");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxImage extends Vgx.VgxEntity {
        constructor() {
            super();
            this._width = 0;
            this._height = 0;
            this._cornersRadius = 0;
        }
        _getBounds() {
            return new Vgx.Rect(this.insertPointX, this.insertPointY, this._width, this._height);
        }
        _getPath() {
            return null;
        }
        get cornersRadius() { return this._cornersRadius; }
        set cornersRadius(v) {
            if (this._cornersRadius != v) {
                this._cornersRadius = v;
                this.geometryDirty = true;
            }
        }
        get height() { return this._height; }
        set height(v) {
            if (this._height != v) {
                this._height = v;
                this.geometryDirty = true;
            }
        }
        get width() { return this._width; }
        set width(v) {
            if (this._width != v) {
                this._width = v;
                this.geometryDirty = true;
            }
        }
        get source() { return this._source; }
        set source(v) {
            if (this._source != v) {
                this._source = v;
                this.appearanceDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawImage(this);
        }
    }
    Vgx.VgxImage = VgxImage;
    Vgx.EntityTypeManager.registerType("Image", "Vgx.VgxImage");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxLine extends Vgx.VgxEntity {
        constructor() {
            super();
        }
        _getBounds() {
            return this._bounds;
        }
        updateBounds() {
            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxX = Number.MIN_VALUE;
            let maxY = Number.MIN_VALUE;
            const points = [this.startPoint, this.endPoint];
            for (const p of points) {
                if (p) {
                    minX = Math.min(minX, p.x);
                    minY = Math.min(minY, p.y);
                    maxX = Math.max(maxX, p.x);
                    maxY = Math.max(maxY, p.y);
                }
            }
            this._bounds = new Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
        }
        _getPath() {
            return null;
        }
        get startPoint() { return { x: this.insertPointX, y: this.insertPointY }; }
        ;
        set startPoint(v) {
            this.insertPointX = v.x;
            this.insertPointY = v.y;
        }
        get endPoint() { return this._endPoint; }
        set endPoint(v) {
            if (this._endPoint != v) {
                this._endPoint = v;
                this.updateBounds();
                this.geometryDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawLine(this);
        }
    }
    Vgx.VgxLine = VgxLine;
    Vgx.EntityTypeManager.registerType("Line", "Vgx.VgxLine");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxPath extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._bounds = new Vgx.Rect();
            this._fillRule = "nonzero";
            this._children = new Vgx.ReactiveCollection();
            this._children.onCollectionChanged.add((s, e) => this.updateBounds());
        }
        collectPath2D() {
            if (this._currentFigure != null && !this._currentFigure.isEmpty)
                this._children.add(this._currentFigure.path);
            this._currentFigure = null;
        }
        createFigureObj(pathData = null) {
            if (pathData && typeof pathData === "string") {
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
        createNewFigure(pathData = null) {
            let result = null;
            if (pathData && typeof pathData === "string") {
                result = this.createFigureObj(pathData);
            }
            if (this._currentFigure != null) {
                if (!this._currentFigure.isEmpty) {
                    this.collectPath2D();
                }
            }
            if (!result) {
                result = this.createFigureObj();
            }
            this._currentFigure = result;
        }
        ensureHasFigure() {
            if (!this._currentFigure)
                this.createNewFigure();
        }
        _getBounds() {
            return this._bounds;
        }
        updateBounds() {
            var result = new Vgx.Rect();
            result.x = this.insertPointX;
            result.y = this.insertPointY;
            return result;
        }
        loadData(data) {
            super.loadData(data);
            if (Reflect.has(data, "figures")) {
                this._children.clear();
                for (const figure of data.figures) {
                    switch (figure.type) {
                        case "arc":
                            this.addArc(figure.insertPointX, figure.insertPointY, figure.radius, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
                            break;
                        case "rect":
                            this.addRect(figure.insertPointX, figure.insertPointY, figure.width, figure.height);
                            break;
                        case "ellipse":
                            this.addEllipse(figure.insertPointX, figure.insertPointY, figure.radiusX, figure.radiusY, figure.rotation || 0, figure.startAngle || 0, figure.endAngle || Math.PI * 2, figure.optClockwise || null);
                            break;
                        case "path":
                            this.addFigure(figure.data);
                            break;
                    }
                }
            }
        }
        _getPath() {
            return null;
        }
        get figures() { return this._children; }
        get fillRule() { return this._fillRule; }
        set fillRule(v) {
            if (this._fillRule != v) {
                this._fillRule = v;
                this.geometryDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawPath(this);
        }
        addArc(x, y, radius, startAngle, endAngle, anticlockwise = false) {
            anticlockwise = !!anticlockwise;
            this.createNewFigure();
            this._currentFigure.path.arc(x, y, radius, startAngle, endAngle, anticlockwise);
            this._currentFigure.isEmpty = false;
            this.collectPath2D();
            this.geometryDirty = true;
        }
        addFigure(pathData) {
            this.createNewFigure(pathData);
            this.collectPath2D();
            this.geometryDirty = true;
        }
        addRect(x, y, width, height) {
            this.createNewFigure();
            this._currentFigure.path.rect(x, y, width, height);
            this._currentFigure.isEmpty = false;
            this.collectPath2D();
            this.geometryDirty = true;
        }
        addEllipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise = false) {
            anticlockwise = !!anticlockwise;
            this.createNewFigure();
            this._currentFigure.path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
            this._currentFigure.isEmpty = false;
            this.collectPath2D();
            this.geometryDirty = true;
        }
        arcTo(cpx, cpy, x, y, radius) {
            this.ensureHasFigure();
            this._currentFigure.path.arcTo(cpx, cpy, x, y, radius);
            this._currentFigure.isEmpty = false;
            this._lastX = x;
            this._lastY = y;
        }
        beginNewFigure() {
            this.createNewFigure();
            this.geometryDirty = true;
        }
        bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
            this.ensureHasFigure();
            this._currentFigure.path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            this._currentFigure.isEmpty = false;
            this._lastX = x;
            this._lastY = y;
        }
        clear() {
            this._children.clear();
            this._currentFigure = null;
            this.geometryDirty = true;
        }
        closeFigure() {
            if (this._currentFigure) {
                this._currentFigure.path.closePath();
                this.beginNewFigure();
            }
        }
        endFigure() {
            this.collectPath2D();
            this.geometryDirty = true;
        }
        horizontalLineTo(x) {
            this.ensureHasFigure();
            this._currentFigure.path.lineTo(x, this._lastY);
            this._currentFigure.isEmpty = false;
            this._lastX = x;
        }
        lineTo(x, y) {
            this.ensureHasFigure();
            this._currentFigure.path.lineTo(x, y);
            this._currentFigure.isEmpty = false;
            this._lastX = x;
            this._lastY = y;
        }
        moveTo(x, y) {
            this.ensureHasFigure();
            this._currentFigure.path.moveTo(x, y);
            this._currentFigure.isEmpty = false;
            this._lastX = x;
            this._lastY = y;
        }
        quadraticCurveTo(cpx, cpy, x, y) {
            this.ensureHasFigure();
            this._currentFigure.path.quadraticCurveTo(cpx, cpy, x, y);
            this._currentFigure.isEmpty = false;
            this._lastX = x;
            this._lastY = y;
        }
        verticalLineTo(y) {
            this.ensureHasFigure();
            this._currentFigure.path.lineTo(this._lastX, y);
            this._currentFigure.isEmpty = false;
            this._lastY = y;
        }
    }
    Vgx.VgxPath = VgxPath;
    Vgx.EntityTypeManager.registerType("Path", "Vgx.VgxPath");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    const degToRad = 0.017453292519943295;
    class VgxPie extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._radius = 0;
            this._startAngle = 0;
            this._endAngle = 0;
            this._startAngleRad = 0;
            this._endAngleRad = 0;
            this._isAntiClockwise = false;
        }
        _getBounds() {
            var xsa = Math.cos(this._startAngleRad) * this._radius;
            var ysa = Math.sin(this._startAngleRad) * this._radius;
            var xea = Math.cos(this._endAngleRad) * this._radius;
            var yea = Math.sin(this._endAngleRad) * this._radius;
            var x1 = Math.min(xsa, xea);
            var y1 = Math.min(ysa, yea);
            var x2 = Math.max(xsa, xea);
            var y2 = Math.max(ysa, yea);
            return new Vgx.Rect(this.insertPointX + x1, this.insertPointY + y1, x2 - x1, y2 - y1);
        }
        _getPath() {
            return null;
        }
        get radius() { return this._radius; }
        set radius(v) {
            if (this._radius != v) {
                this._radius = v;
                this.geometryDirty = true;
            }
        }
        get startAngle() { return this._startAngle; }
        set startAngle(v) {
            if (this._startAngle != v) {
                this._startAngle = v;
                this._startAngleRad = v * degToRad;
                this.geometryDirty = true;
            }
        }
        get startAngleRad() { return this._startAngleRad; }
        set startAngleRad(v) {
            if (this._startAngleRad != v) {
                this._startAngleRad = v;
                this._startAngle = v / degToRad;
                this.geometryDirty = true;
            }
        }
        get endAngle() { return this._endAngle; }
        set endAngle(v) {
            if (this._endAngle != v) {
                this._endAngle = v;
                this._endAngleRad = v * degToRad;
                this.geometryDirty = true;
            }
        }
        get endAngleRad() { return this._endAngleRad; }
        set endAngleRad(v) {
            if (this._endAngleRad != v) {
                this._endAngleRad = v;
                this._endAngle = v / degToRad;
                this.geometryDirty = true;
            }
        }
        get isAntiClockwise() { return this._isAntiClockwise; }
        set isAntiClockwise(v) {
            if (this._isAntiClockwise != v) {
                this._isAntiClockwise = v;
                this.geometryDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawPie(this);
        }
    }
    Vgx.VgxPie = VgxPie;
    Vgx.EntityTypeManager.registerType("Pie", "Vgx.VgxPie");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxPolyline extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._points = new Vgx.ReactiveCollection();
            this._points.onCollectionChanged.add((s, e) => this.updateBounds());
        }
        _getBounds() {
            return this._bounds;
        }
        updateBounds() {
            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxX = Number.MIN_VALUE;
            let maxY = Number.MIN_VALUE;
            for (const p of this._points) {
                if (p) {
                    minX = Math.min(minX, p.x);
                    minY = Math.min(minY, p.y);
                    maxX = Math.max(maxX, p.x);
                    maxY = Math.max(maxY, p.y);
                }
            }
            this._bounds = new Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
        }
        loadData(data) {
            super.loadData(data);
            if (Reflect.has(data, "points")) {
                this.points.clear();
                this.points.addRange(data.points);
            }
        }
        _getPath() {
            return null;
        }
        get points() { return this._points; }
        draw(drawingContext) {
            drawingContext.drawPolyline(this);
        }
    }
    Vgx.VgxPolyline = VgxPolyline;
    Vgx.EntityTypeManager.registerType("Polyline", "Vgx.VgxPolyline");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxPolygon extends Vgx.VgxPolyline {
        constructor() {
            super();
        }
        draw(drawingContext) {
            drawingContext.drawPolygon(this);
        }
    }
    Vgx.VgxPolygon = VgxPolygon;
    Vgx.EntityTypeManager.registerType("Polygon", "Vgx.VgxPolygon");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxQuad extends Vgx.VgxFillableEntity {
        constructor() {
            super();
        }
        _getBounds() {
            return this._bounds;
        }
        updateBounds() {
            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxX = Number.MIN_VALUE;
            let maxY = Number.MIN_VALUE;
            const points = [this._point1, this._point2, this._point3, this._point4];
            for (const p of points) {
                if (p) {
                    minX = Math.min(minX, p.x);
                    minY = Math.min(minY, p.y);
                    maxX = Math.max(maxX, p.x);
                    maxY = Math.max(maxY, p.y);
                }
            }
            this._bounds = new Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
        }
        _getPath() {
            return null;
        }
        get point1() { return this._point1; }
        set point1(v) {
            if (this._point1 != v) {
                this._point1 = v;
                this.updateBounds();
                this.geometryDirty = true;
            }
        }
        get point2() { return this._point2; }
        set point2(v) {
            if (this._point2 != v) {
                this._point2 = v;
                this.updateBounds();
                this.geometryDirty = true;
            }
        }
        get point3() { return this._point3; }
        set point3(v) {
            if (this._point3 != v) {
                this._point3 = v;
                this.updateBounds();
                this.geometryDirty = true;
            }
        }
        get point4() { return this._point4; }
        set point4(v) {
            if (this._point4 != v) {
                this._point4 = v;
                this.updateBounds();
                this.geometryDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawQuad(this);
        }
    }
    Vgx.VgxQuad = VgxQuad;
    Vgx.EntityTypeManager.registerType("Quad", "Vgx.VgxQuad");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxQuadraticCurve extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._points = new Vgx.ReactiveCollection();
            this._points.onCollectionChanged.add((s, e) => this.updateBounds());
            this._controlPoints = new Vgx.ReactiveCollection();
            this.isClosed = true;
        }
        _getBounds() {
            return this._bounds;
        }
        updateBounds() {
            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxX = Number.MIN_VALUE;
            let maxY = Number.MIN_VALUE;
            for (const p of this._points) {
                if (p) {
                    minX = Math.min(minX, p.x);
                    minY = Math.min(minY, p.y);
                    maxX = Math.max(maxX, p.x);
                    maxY = Math.max(maxY, p.y);
                }
            }
            this._bounds = new Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
        }
        loadData(data) {
            super.loadData(data);
            if (Reflect.has(data, "points")) {
                this.points.clear();
                this.points.addRange(data.points);
            }
            if (Reflect.has(data, "controlPoints")) {
                this.controlPoints.clear();
                this.controlPoints.addRange(data.controlPoints);
            }
        }
        _getPath() {
            return null;
        }
        get points() { return this._points; }
        get controlPoints() { return this._controlPoints; }
        draw(drawingContext) {
            drawingContext.drawQuadraticCurve(this);
        }
    }
    Vgx.VgxQuadraticCurve = VgxQuadraticCurve;
    Vgx.EntityTypeManager.registerType("QuadraticCurve", "Vgx.VgxQuadraticCurve");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxRectangle extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._width = 0;
            this._height = 0;
            this._cornersRadius = 0;
        }
        _getBounds() {
            return new Vgx.Rect(this.insertPointX, this.insertPointY, this._width, this._height);
        }
        _getPath() {
            return null;
        }
        get cornersRadius() { return this._cornersRadius; }
        set cornersRadius(v) {
            if (this._cornersRadius != v) {
                this._cornersRadius = v;
                this.geometryDirty = true;
            }
        }
        get height() { return this._height; }
        set height(v) {
            if (this._height != v) {
                this._height = v;
                this.geometryDirty = true;
            }
        }
        get width() { return this._width; }
        set width(v) {
            if (this._width != v) {
                this._width = v;
                this.geometryDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawRectangle(this);
        }
    }
    Vgx.VgxRectangle = VgxRectangle;
    Vgx.EntityTypeManager.registerType("Rectangle", "Vgx.VgxRectangle");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxSquare extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._size = 0;
            this._cornersRadius = 0;
        }
        _getBounds() {
            return new Vgx.Rect(this.insertPointX, this.insertPointY, this._size, this._size);
        }
        _getPath() {
            return null;
        }
        get cornersRadius() { return this._cornersRadius; }
        set cornersRadius(v) {
            if (this._cornersRadius != v) {
                this._cornersRadius = v;
                this.geometryDirty = true;
            }
        }
        get size() { return this._size; }
        set size(v) {
            if (this._size != v) {
                this._size = v;
                this.geometryDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawSquare(this);
        }
    }
    Vgx.VgxSquare = VgxSquare;
    Vgx.EntityTypeManager.registerType("Square", "Vgx.VgxSquare");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxText extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._baseline = "alphabetic";
        }
        _getBounds() {
            this._textMeasure = Vgx.TextUtils.measureText(this.source, this.fontFamily, this.fontSize);
            const baselineOffset = this.getBaselineOffset(this._textMeasure);
            return new Vgx.Rect(this.insertPointX, this.insertPointY - baselineOffset, this._textMeasure ? this._textMeasure.width : 0, this._textMeasure ? this._textMeasure.height : 0);
        }
        getBaselineOffset(textMeasure) {
            switch (this._baseline) {
                case "top":
                    return 0;
                case "hanging":
                    return textMeasure.height * 0.1951;
                case "middle":
                    return textMeasure.height * 0.5;
                case "alphabetic":
                    return textMeasure.height * 0.8;
                case "ideographic":
                case "bottom":
                    return textMeasure.height;
                default:
                    throw new Error("invalid textBaseline");
            }
        }
        _getPath() {
            return null;
        }
        get source() { return this._source; }
        set source(v) {
            if (this._source != v) {
                this._source = v;
                this.geometryDirty = true;
            }
        }
        get fontFamily() { return this._fontFamily; }
        set fontFamily(v) {
            if (this._fontFamily != v) {
                this._fontFamily = v;
                this.geometryDirty = true;
            }
        }
        get fontSize() { return this._fontSize; }
        set fontSize(v) {
            if (this._fontSize != v) {
                this._fontSize = v;
                this.geometryDirty = true;
            }
        }
        get alignment() { return this._alignment; }
        set alignment(v) {
            if (this._alignment != v) {
                this._alignment = v;
                this.geometryDirty = true;
            }
        }
        get baseline() { return this._baseline; }
        set baseline(v) {
            if (this._baseline != v) {
                this._baseline = v;
                this.geometryDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawText(this);
        }
    }
    Vgx.VgxText = VgxText;
    Vgx.EntityTypeManager.registerType("Text", "Vgx.VgxText");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxTriangle extends Vgx.VgxFillableEntity {
        constructor() {
            super();
        }
        _getBounds() {
            return this._bounds;
        }
        updateBounds() {
            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxX = Number.MIN_VALUE;
            let maxY = Number.MIN_VALUE;
            const points = [this._point1, this._point2, this._point3];
            for (const p of points) {
                if (p) {
                    minX = Math.min(minX, p.x);
                    minY = Math.min(minY, p.y);
                    maxX = Math.max(maxX, p.x);
                    maxY = Math.max(maxY, p.y);
                }
            }
            this._bounds = new Vgx.Rect(minX, minY, maxX - minX, maxY - minY);
        }
        _getPath() {
            return null;
        }
        get point1() { return this._point1; }
        set point1(v) {
            if (this._point1 != v) {
                this._point1 = v;
                this.updateBounds();
                this.geometryDirty = true;
            }
        }
        get point2() { return this._point2; }
        set point2(v) {
            if (this._point2 != v) {
                this._point2 = v;
                this.updateBounds();
                this.geometryDirty = true;
            }
        }
        get point3() { return this._point3; }
        set point3(v) {
            if (this._point3 != v) {
                this._point3 = v;
                this.updateBounds();
                this.geometryDirty = true;
            }
        }
        draw(drawingContext) {
            drawingContext.drawTriangle(this);
        }
    }
    Vgx.VgxTriangle = VgxTriangle;
    Vgx.EntityTypeManager.registerType("Triangle", "Vgx.VgxTriangle");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VgxView extends Vgx.VgxFillableEntity {
        constructor() {
            super();
            this._children = new Vgx.VgxEntityCollection(this);
            this._children.onCollectionChanged.add(this._onChildrenChanged, this);
        }
        _onChildrenChanged(s, e) {
            if (!this._clip) {
                this.updateBounds();
            }
        }
        _onClipBoundsChanged() {
            if (this._clip) {
            }
        }
        _onClipStateChanged() {
            if (this._clip) {
                if (!this._clipBounds || Vgx.Rect.isEmpty(this._clipBounds)) {
                    this.updateBounds();
                    this._clipBounds = this._bounds;
                }
            }
            else {
            }
        }
        updateBounds() {
            this._bounds = Vgx.Utils.getEntitiesBounds(this._children, this.insertPointX, this.insertPointY);
        }
        _getBounds() {
            return this._bounds;
        }
        _getPath() {
            return null;
        }
        get children() { return this._children; }
        get clipBounds() { return this._clipBounds; }
        set clipBounds(v) {
            if (!Vgx.Rect.equals(this._clipBounds, v)) {
                this._clipBounds = v;
                this._onClipBoundsChanged();
            }
        }
        get clip() { return this._clip; }
        set clip(v) {
            if (this._clip !== v) {
                this._clip = v;
                this._onClipStateChanged();
            }
        }
        draw(drawingContext) {
            drawingContext.drawView(this);
        }
    }
    Vgx.VgxView = VgxView;
    Vgx.EntityTypeManager.registerType("View", "Vgx.VgxView");
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class VectorGraphicsView {
        constructor() {
            this._events = new Vgx.EventsManager(this);
            this._viewports = new Array();
            this._hasDrawing = false;
            this._viewportsLayout = Vgx.ViewportsLayout.ONE;
            this._viewportsSpace = 2;
            this._neverArranged = true;
            this._htmlElement = window.document.createElement("div");
            this._htmlElement.classList.add("VectorGraphicsView");
            this._htmlElement.style.width = "100%";
            this._htmlElement.style.height = "100%";
            this.onViewportsLayoutChanged = new Vgx.EventSet(this._events, "onViewportsLayoutChanged");
            this._addNewViewport();
            window.addEventListener("resize", () => this._arrangeLayout());
        }
        _arrangeLayout() {
            if (!this._htmlElement.parentElement)
                return;
            switch (this._viewportsLayout) {
                case Vgx.ViewportsLayout.ONE:
                    break;
                case Vgx.ViewportsLayout.TWO_VERTICAL:
                    {
                        var width = (this._htmlElement.offsetWidth - this._viewportsSpace) * 0.5;
                        var height = this._htmlElement.offsetHeight;
                        var viewportLeft = this._viewports[0];
                        viewportLeft.width = width;
                        viewportLeft.height = height;
                        var viewportRight = this._viewports[1];
                        viewportRight.width = width;
                        viewportRight.height = height;
                        viewportRight.htmlElement.style.left = (width + this._viewportsSpace) + "px";
                        viewportRight.htmlElement.style.top = "0px";
                    }
                    break;
                case Vgx.ViewportsLayout.TWO_HORIZONTAL:
                    {
                        var width = this._htmlElement.offsetWidth;
                        var height = (this._htmlElement.offsetHeight - this._viewportsSpace) * 0.5;
                        var viewportTop = this._viewports[0];
                        viewportTop.width = width;
                        viewportTop.height = height;
                        var viewportBottom = this._viewports[1];
                        viewportBottom.width = width;
                        viewportBottom.height = height;
                        viewportBottom.htmlElement.style.left = "0px";
                        viewportBottom.htmlElement.style.top = (height + this._viewportsSpace) + "px";
                    }
                    break;
            }
            this._neverArranged = false;
        }
        _addNewViewport() {
            var viewport = new Vgx.Viewport();
            if (this._drawing != null) {
                viewport.drawing = this._drawing;
            }
            this._addViewport(viewport);
        }
        _addViewport(viewport) {
            if (this._viewports.indexOf(viewport) != -1)
                return;
            viewport.htmlElement.classList.add("viewport");
            this._viewports.push(viewport);
            this._htmlElement.appendChild(viewport.htmlElement);
            this._setActiveViewport(viewport);
            this._arrangeLayout();
        }
        _removeLastViewport() {
            var viewport = this._viewports.pop();
            viewport.htmlElement.remove();
            if (this._currentViewport == viewport) {
                this._currentViewport = this._viewports[this._viewports.length - 1];
            }
        }
        _setActiveViewport(viewport) {
            this._currentViewport = viewport;
        }
        _ensureViewportsCount(count) {
            if (count > this._viewports.length) {
                while (this._viewports.length < count)
                    this._addNewViewport();
            }
            else if (count < this._viewports.length) {
                while (this._viewports.length > count)
                    this._removeLastViewport();
            }
        }
        _checkNeverArranged() {
            if (this._neverArranged) {
                this._arrangeLayout();
            }
        }
        _onDrawingChanged(oldValue, newValue) {
            if (oldValue != null) {
            }
            this._hasDrawing = false;
            if (newValue != null) {
                for (const viewport of this._viewports) {
                    viewport.drawing = newValue;
                }
            }
            this._checkNeverArranged();
        }
        _onViewportsLayoutChanged(oldValue, newValue) {
            this._neverArranged = true;
            switch (newValue) {
                case 1:
                    {
                        this._ensureViewportsCount(1);
                        this._viewports[0].htmlElement.style.position = "relative";
                        this._viewports[0].autosize = true;
                    }
                    break;
                case 2:
                case 3:
                    {
                        this._ensureViewportsCount(2);
                        this._viewports[0].htmlElement.style.position = "absolute";
                        this._viewports[0].autosize = false;
                        this._viewports[1].htmlElement.style.position = "absolute";
                        this._viewports[1].autosize = false;
                    }
                    break;
            }
            this._arrangeLayout();
            this._events.trigger("onViewportsLayoutChanged", { layout: newValue });
        }
        get htmlElement() { return this._htmlElement; }
        get drawing() { return this._drawing; }
        set drawing(v) {
            if (this._drawing != v) {
                var oldValue = this._drawing;
                this._drawing = v;
                this._onDrawingChanged(oldValue, this._drawing);
            }
        }
        get viewportsLayout() { return this._viewportsLayout; }
        set viewportsLayout(v) {
            if (this._viewportsLayout != v) {
                var oldValue = this._viewportsLayout;
                this._viewportsLayout = v;
                this._onViewportsLayoutChanged(oldValue, this._viewportsLayout);
            }
        }
        get viewportsSpace() { return this._viewportsSpace; }
        set viewportsSpace(v) {
            if (this._viewportsSpace != v) {
                this._viewportsSpace = v;
                this._arrangeLayout();
            }
        }
        get viewportsCount() { return this._viewports.length; }
        get currentViewport() { return this._currentViewport; }
        getViewport(index) {
            if (index < 0 || index >= this._viewports.length)
                return null;
            return this._viewports[index];
        }
    }
    Vgx.VectorGraphicsView = VectorGraphicsView;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class Viewport {
        constructor(canvas, drawing) {
            this.ZOOM_STEP = 0.85;
            this._events = new Vgx.EventsManager(this);
            this._viewTransform = new Vgx.ViewTransform();
            this._isDirty = true;
            this._needRedraw = true;
            this._nerverResized = true;
            this._autosize = true;
            this._width = 800;
            this._height = 600;
            this._hasDrawing = false;
            this._drawAxes = false;
            this._htmlElement = window.document.createElement("div");
            if (canvas instanceof HTMLCanvasElement) {
                this._canvas = canvas;
            }
            else {
                this._canvas = window.document.createElement("canvas");
            }
            this._htmlElement.appendChild(this._canvas);
            if (drawing == null) {
                drawing = new Vgx.Drawing();
            }
            this._drawingContext = new Vgx.DrawingContext(this._drawing, this._canvas, this._viewTransform);
            this.drawing = drawing;
            this._setupMouseEvents();
            window.addEventListener("resize", this._onResize.bind(this));
            this._viewTransform.setViewTarget(0, 0);
            requestAnimationFrame(this._onRender.bind(this));
        }
        _setupMouseEvents() {
            this._canvas.addEventListener("mousedown", this._onMouseDown.bind(this));
            this._canvas.addEventListener("mousemove", this._onMouseMove.bind(this));
            this._canvas.addEventListener("mouseup", this._onMouseUp.bind(this));
            this._canvas.addEventListener("wheel", this._onMouseWheel.bind(this));
        }
        _checkNeedRedraw() {
            this._needRedraw = this._isDirty;
            if (this._drawing && this._drawing.isDirty) {
                this._needRedraw = true;
                this._drawing.isDirty = false;
            }
            this._isDirty = false;
        }
        _invalidate() {
            this._isDirty = true;
        }
        _render() {
            this._checkNeverResized();
            if (this._needRedraw) {
                if (this._hasDrawing) {
                    this._drawingContext.drawDrawing(this._drawing);
                }
                if (this.drawAxes) {
                    this._drawingContext.drawAxes();
                }
            }
            this._needRedraw = false;
        }
        _handleViewChanged() {
            this._events.trigger("onViewChanged", { rect: this.getCurrentViewBounds() });
        }
        _checkNeverResized() {
            if (this._htmlElement.parentElement && this._nerverResized) {
                this._nerverResized = false;
                this._onResize(null);
            }
        }
        _onRender() {
            if (this._htmlElement.parentElement != null) {
                this._checkNeedRedraw();
                if (this._needRedraw) {
                    this._render();
                }
            }
            requestAnimationFrame(this._onRender.bind(this));
        }
        _onDrawingDirty() {
            this._invalidate();
        }
        _onMouseDown(e) {
            if (!this._hasDrawing)
                return;
            this._lastMouseX = e.x;
            this._lastMouseY = e.y;
            this._onDrag = true;
        }
        _onMouseMove(e) {
            if (!this._hasDrawing)
                return;
            if (this._onDrag) {
                var cw = this._viewTransform.localToGlobalPoint(e.x, e.y);
                var lw = this._viewTransform.localToGlobalPoint(this._lastMouseX, this._lastMouseY);
                var difX = cw.x - lw.x;
                var difY = cw.y - lw.y;
                this.move(-difX, -difY);
            }
            this._lastMouseX = e.x;
            this._lastMouseY = e.y;
        }
        _onMouseUp(e) {
            if (!this._hasDrawing)
                return;
            this._onDrag = false;
        }
        _onMouseWheel(e) {
            if (!this._hasDrawing)
                return;
            if (e.deltaY > 0) {
                this.zoom(this.ZOOM_STEP);
            }
            else {
                this.zoom(1 / this.ZOOM_STEP);
            }
        }
        _onResize(e) {
            if (this._autosize && this._htmlElement.parentElement) {
                this._htmlElement.style.width = this._htmlElement.parentElement.clientWidth + "px";
                this._htmlElement.style.height = this._htmlElement.parentElement.clientHeight + "px";
            }
            else {
                this._htmlElement.style.width = this._width + "px";
                this._htmlElement.style.height = this._height + "px";
            }
            this._canvas.width = this._htmlElement.clientWidth;
            this._canvas.height = this._htmlElement.clientHeight;
            this._isDirty = true;
            this._viewTransform.setViewPixelSize(this._canvas.width, this._canvas.height);
            if (!this._drawing)
                return;
            this._invalidate();
        }
        _onDrawingChanged(oldValue, newValue) {
            if (oldValue != null) {
                oldValue.unregisterDirtyEventHandler(this._onDrawingDirty.bind(this));
            }
            this._hasDrawing = false;
            if (newValue != null) {
                this._hasDrawing = true;
                this._drawingContext._attachToDrawing(newValue);
                newValue.registerDirtyEventHandler(this._onDrawingDirty.bind(this));
            }
            this._checkNeverResized();
        }
        get autosize() { return this._autosize; }
        set autosize(v) {
            v = !!v;
            if (this._autosize != v) {
                this._autosize = v;
                this._onResize(null);
            }
        }
        get canvas() { return this._canvas; }
        get currentZoom() { return this._viewTransform.viewZoom; }
        get currentTargetX() { return this._viewTransform.viewTargetX; }
        get currentTargetY() { return this._viewTransform.viewTargetY; }
        get drawAxes() { return this._drawAxes; }
        set drawAxes(v) {
            v = !!v;
            if (this._drawAxes != v) {
                this._drawAxes = v;
                this._invalidate();
            }
        }
        get drawing() { return this._drawing; }
        set drawing(v) {
            if (this._drawing != v) {
                const oldValue = this._drawing;
                this._drawing = v;
                this._onDrawingChanged(oldValue, this._drawing);
            }
        }
        get height() { return this._autosize ? this._htmlElement.offsetHeight : this._height; }
        set height(v) {
            if (this._autosize) {
                this._height = v;
            }
            else {
                if (this._height != v) {
                    this._height = v;
                    this._onResize(null);
                }
            }
        }
        get htmlElement() { return this._htmlElement; }
        get scaleStyles() { return this._drawingContext.scaleStyles; }
        set scaleStyles(v) {
            v = !!v;
            this._drawingContext.scaleStyles = v;
            this._invalidate();
        }
        get width() { return this._autosize ? this._htmlElement.offsetWidth : this._width; }
        set width(v) {
            if (this._autosize) {
                this._width = v;
            }
            else {
                if (this._width != v) {
                    this._width = v;
                    this._onResize(null);
                }
            }
        }
        getCursorPosition() {
            return this._viewTransform.localToGlobalPoint(this._lastMouseX, this._lastMouseY);
        }
        getCurrentViewBounds() {
            return this._viewTransform.getViewBounds();
        }
        redraw() {
            this._isDirty = true;
            this._onRender();
        }
        move(offsetX, offsetY) {
            this._viewTransform.moveViewTarget(offsetX, offsetY);
            this._handleViewChanged();
            this._invalidate();
        }
        moveTo(centerX, centerY) {
            this._viewTransform.setViewTarget(centerX, centerY);
            this._handleViewChanged();
            this._invalidate();
        }
        zoom(zoomIncrement) {
            this._viewTransform.setViewZoom(this._viewTransform.viewZoom * zoomIncrement);
            this._handleViewChanged();
            this._invalidate();
        }
        zoomTo(zoomIncrement, centerX, centerY) {
            this._viewTransform.setViewZoomTo(this._viewTransform.viewZoom * zoomIncrement, centerX, centerY);
            this._handleViewChanged();
            this._invalidate();
        }
        zoomAt(zoomFactor, centerX, centerY) {
            this._viewTransform.setViewZoomTo(zoomFactor, centerX, centerY);
            this._handleViewChanged();
            this._invalidate();
        }
        zoomAll() {
            var drawingBounds = this.drawing.getBounds();
            if (drawingBounds.width == 0 || drawingBounds.height == 0)
                return;
            var drawingAspectRatio = drawingBounds.height / drawingBounds.width;
            var viewPixelWidth = this._canvas.width;
            var viewPixelHeight = this._canvas.height;
            var viewPixelBounds = new Vgx.Rect(0, 0, viewPixelWidth, viewPixelHeight);
            var viewAspectRatio = viewPixelHeight / viewPixelWidth;
            var currentZoom = this._viewTransform.viewZoom;
            var viewGlobalBounds = this._viewTransform.localToGlobalRect(viewPixelBounds.x, viewPixelBounds.y, viewPixelBounds.width, viewPixelBounds.height);
            var zoomFactor = 1.0;
            if (drawingAspectRatio > viewAspectRatio) {
                zoomFactor = viewGlobalBounds.height / drawingBounds.height;
            }
            else {
                zoomFactor = viewGlobalBounds.width / drawingBounds.width;
            }
            var centerX = drawingBounds.x + (drawingBounds.width * 0.5);
            var centerY = drawingBounds.y + (drawingBounds.height * 0.5);
            zoomFactor *= 0.9;
            if (Vgx.MathUtils.isZero(zoomFactor))
                zoomFactor = 0.1;
            this.zoomAt(zoomFactor, centerX, centerY);
        }
    }
    Vgx.Viewport = Viewport;
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    let ViewportsLayout;
    (function (ViewportsLayout) {
        ViewportsLayout[ViewportsLayout["ONE"] = 1] = "ONE";
        ViewportsLayout[ViewportsLayout["TWO_VERTICAL"] = 2] = "TWO_VERTICAL";
        ViewportsLayout[ViewportsLayout["TWO_HORIZONTAL"] = 3] = "TWO_HORIZONTAL";
    })(ViewportsLayout = Vgx.ViewportsLayout || (Vgx.ViewportsLayout = {}));
})(Vgx || (Vgx = {}));
var Vgx;
(function (Vgx) {
    class HttpClient {
        constructor(baseUrl) {
            this._events = new Vgx.EventsManager(this);
            this._method = "GET";
            this._mimeType = "text/plain;charset=UTF-8";
            this._responseType = "text";
            this._timeout = 0;
            this._isBusy = false;
            this._useCredentials = false;
            this._baseUrl = this._formatBaseUrl(baseUrl);
            this._xhr = new XMLHttpRequest();
            this._xhr.addEventListener("progress", this._xhr_onProgress.bind(this));
            this._xhr.addEventListener("load", this._xhr_onLoad.bind(this), false);
            this._xhr.addEventListener("error", this._xhr_onError.bind(this), false);
            this._xhr.addEventListener("abort", this._xhr_onAbort.bind(this), false);
            this.onAbort = new Vgx.EventSet(this._events, "onAbort");
            this.onSuccess = new Vgx.EventSet(this._events, "onSuccess");
            this.onError = new Vgx.EventSet(this._events, "onError");
            this.onProgress = new Vgx.EventSet(this._events, "onProgress");
        }
        static _download(url, responseType, onSuccess, optOnError, optOnAbort) {
            var client = new HttpClient();
            client.method = "GET";
            client.responseType = responseType;
            client.onSuccess.add(onSuccess);
            if (typeof optOnError === "function")
                client.onError.add(optOnError);
            if (typeof optOnAbort === "function")
                client.onAbort.add(optOnAbort);
            client.sendRequest(url);
        }
        static downloadString(url, onSuccess, optOnError, optOnAbort) {
            HttpClient._download(url, "text", onSuccess, optOnError, optOnAbort);
        }
        static downloadJSON(url, onSuccess, optOnError, optOnAbort) {
            HttpClient._download(url, "json", onSuccess, optOnError, optOnAbort);
        }
        _xhr_onProgress(e) {
            if (e.lengthComputable) {
                var progress = {
                    loaded: e.loaded,
                    total: e.total,
                    percentage: (e.loaded / e.total) * 100
                };
                this._events.trigger("onProgress", progress);
            }
        }
        _xhr_onLoad(e) {
            var result = {
                result: this._xhr.response,
                resultType: this._xhr.responseType,
                rawResult: this._xhr.responseText
            };
            this._events.trigger("onSuccess", result);
        }
        _xhr_onError(e) {
            var error = {
                status: this._xhr.statusText,
                code: this._xhr.status
            };
            this._events.trigger("onError", error);
        }
        _xhr_onAbort(e) {
            this._events.trigger("onAbort", {});
        }
        _formatBaseUrl(url) {
            if (typeof url !== "string")
                return "";
            if (url.length == 0)
                return "";
            if (url.substr(url.length - 1) !== "/")
                url += "/";
            return url;
        }
        setRequestHeader(name, value) {
            this._xhr.setRequestHeader(name, value);
        }
        sendRequest(endPoint, optData) {
            if (this._isBusy)
                throw new Error("HttpClient is busy");
            var fullEndPoint = this._baseUrl + endPoint;
            this._isBusy = true;
            this._xhr.open(this._method, fullEndPoint, true);
            this._xhr.timeout = this._timeout;
            this._xhr.withCredentials = this._useCredentials;
            this._xhr.overrideMimeType(this._mimeType);
            this._xhr.responseType = this._responseType;
            this._xhr.send(optData);
        }
        abortRequest() {
            if (this._isBusy) {
                this._xhr.abort();
            }
        }
        get baseUrl() { return this._baseUrl; }
        set baseUrl(v) {
            if (typeof v === "string") {
                v = this._formatBaseUrl(v);
                if (this._baseUrl !== v) {
                    this._baseUrl = v;
                }
            }
        }
        get isBusy() { return this._isBusy; }
        get method() { return this._method; }
        set method(v) {
            if (typeof v === "string" && this._method !== v) {
                this._method = v;
            }
        }
        get mimeType() { return this._mimeType; }
        set mimeType(v) {
            if (typeof v === "string" && this._mimeType !== v) {
                this._mimeType = v;
            }
        }
        get responseType() { return this._responseType; }
        set responseType(v) {
            if (typeof v === "string" && this._responseType !== v) {
                this._mimeType = v;
            }
        }
        get timeout() { return this._timeout; }
        set timeout(v) {
            if (typeof v === "number" && this._timeout !== v) {
                this._timeout = v;
            }
        }
        get useCredentials() { return this._useCredentials; }
        set useCredentials(v) {
            if (typeof v === "boolean" && this._useCredentials !== v) {
                this._useCredentials = v;
            }
        }
    }
    Vgx.HttpClient = HttpClient;
})(Vgx || (Vgx = {}));
var SampleApps;
(function (SampleApps) {
    class DrawingRenderApp {
        constructor() {
            this._canvas = window.document.querySelector("#renderCanvas");
            this._viewTransform = new Vgx.ViewTransform();
            Vgx.HttpClient.downloadString("../../drawings/house.json", this._dowloadReady.bind(this));
        }
        static start() {
            new DrawingRenderApp();
        }
        _dowloadReady(s, e) {
            this._drawing = Vgx.Drawing.fromJSON(e.result);
            this._drawingContext = new Vgx.DrawingContext(this._drawing, this._canvas, this._viewTransform);
            this._draw();
        }
        _draw() {
            if (this._drawing.background) {
                this._drawingContext.clear(this._drawing.background);
            }
            else {
                this._drawingContext.clear();
            }
            var children = this._drawing.getChildren();
            for (const child of children) {
                if (child) {
                    if (child.visible) {
                        child.draw(this._drawingContext);
                    }
                }
            }
        }
    }
    SampleApps.DrawingRenderApp = DrawingRenderApp;
})(SampleApps || (SampleApps = {}));
var SampleApps;
(function (SampleApps) {
    class DrawingViewApp {
        constructor() {
            this._canvas = window.document.querySelector("#renderCanvas");
            this._viewTransform = new Vgx.ViewTransform();
            Vgx.HttpClient.downloadString("../../drawings/google-logo.json", this._dowloadReady.bind(this));
        }
        static start() {
            new DrawingViewApp();
        }
        _dowloadReady(s, e) {
            this._view = new Vgx.VgxView();
            this._view.insertPointX = 100;
            this._view.insertPointY = 100;
            this._view.stroke = "#666666";
            this._view.strokeWidth = 2;
            this._view.clipBounds = new Vgx.Rect(0, 0, 250, 50);
            this._view.clip = true;
            this._drawing = Vgx.Drawing.fromJSON(e.result);
            for (const child of this._drawing.getChildren()) {
                this._view.children.add(child);
            }
            this._drawing.clear();
            this._drawing.addChild(this._view);
            this._drawing.background = "#ffffff";
            const artboardShadow = new Vgx.Shadow();
            artboardShadow.color = "rgba(0,0,0,0.1)";
            artboardShadow.offsetX = 3;
            artboardShadow.offsetY = 3;
            artboardShadow.blur = 3;
            const artboard = new Vgx.Artboard();
            artboard.bounds = Vgx.Rect.from({ x: 50, y: 50, width: 250, height: 150 });
            artboard.background = "#cccccc";
            artboard.border = "#aaaaaa";
            artboard.borderWidth = 1.2;
            artboard.clipContent = true;
            artboard.shadow = artboardShadow;
            this._drawing.artboard = artboard;
            this._drawingContext = new Vgx.DrawingContext(this._drawing, this._canvas, this._viewTransform);
            this._drawingContext.drawDrawing(this._drawing);
            this._drawingContext.drawAxes();
        }
    }
    SampleApps.DrawingViewApp = DrawingViewApp;
})(SampleApps || (SampleApps = {}));
var SampleApps;
(function (SampleApps) {
    class TestBoundsApp {
        static start() {
            var vectorGraphicsView = new Vgx.VectorGraphicsView();
            vectorGraphicsView.viewportsLayout = Vgx.ViewportsLayout.ONE;
            vectorGraphicsView.currentViewport.scaleStyles = true;
            vectorGraphicsView.currentViewport.drawAxes = true;
            window.document.body.appendChild(vectorGraphicsView.htmlElement);
            var drawing = new Vgx.Drawing();
            var rectangle = new Vgx.VgxRectangle();
            rectangle.insertPointX = 100;
            rectangle.insertPointY = 100;
            rectangle.width = 100;
            rectangle.height = 100;
            rectangle.fill = "#aa56e1";
            rectangle.stroke = "orangered";
            rectangle.strokeWidth = 2;
            rectangle.transform.originX = 50;
            rectangle.transform.originY = 50;
            rectangle.transform.scaleX = 2;
            rectangle.transform.scaleY = 2;
            drawing.addChild(rectangle);
            var rectangle2 = new Vgx.VgxRectangle();
            rectangle2.insertPointX = 0;
            rectangle2.insertPointY = 0;
            rectangle2.width = 100;
            rectangle2.height = 100;
            rectangle2.fill = "blue";
            rectangle2.stroke = "yellow";
            rectangle2.strokeWidth = 2;
            drawing.addChild(rectangle2);
            vectorGraphicsView.drawing = drawing;
            vectorGraphicsView.currentViewport.zoomAll();
        }
    }
    SampleApps.TestBoundsApp = TestBoundsApp;
})(SampleApps || (SampleApps = {}));
var SampleApps;
(function (SampleApps) {
    class UIElement {
        constructor(htmlElement) {
            if (typeof htmlElement !== "undefined") {
                if (htmlElement instanceof HTMLElement) {
                    this._htmlElement = htmlElement;
                }
                else if (typeof htmlElement === "string") {
                    this._htmlElement = window.document.createElement(htmlElement);
                    if (this._htmlElement == null) {
                        throw new Error("invalid html tag");
                    }
                }
                else if (htmlElement instanceof UIElement) {
                    this._htmlElement = window.document.createElement(htmlElement.htmlElement.tagName);
                }
                else {
                    throw new Error("invalid argument");
                }
            }
            else {
                this._htmlElement = window.document.createElement("div");
            }
            this._htmlElement.classList.add("ui-element");
        }
        get htmlElement() { return this._htmlElement; }
    }
    SampleApps.UIElement = UIElement;
    class ViewportMenu {
        constructor(viewport) {
            this.ZOOM_FACTOR = 0.85;
            this._viewport = viewport;
            this._initializeUI();
        }
        _initializeUI() {
            this._htmlElement = window.document.createElement("div");
            this._htmlElement.classList.add("viewportMenu");
            var menuGroupShowAxes = window.document.createElement("div");
            menuGroupShowAxes.classList.add("menuGroup");
            var lblShowAxes = window.document.createElement("label");
            lblShowAxes.classList.add("menuElement");
            lblShowAxes.classList.add("label");
            lblShowAxes.setAttribute("for", "checkShowAxes");
            lblShowAxes.innerText = "Show axes ";
            var checkShowAxes = window.document.createElement("input");
            checkShowAxes.classList.add("menuElement");
            checkShowAxes.setAttribute("type", "checkbox");
            checkShowAxes.setAttribute("name", "checkShowAxes");
            checkShowAxes.checked = this._viewport.drawAxes;
            checkShowAxes.addEventListener("change", (e) => {
                this._viewport.drawAxes = e.target.checked;
            });
            menuGroupShowAxes.appendChild(lblShowAxes);
            lblShowAxes.appendChild(checkShowAxes);
            var separator1 = window.document.createElement("div");
            separator1.classList.add("menuElement");
            separator1.classList.add("separator");
            var menuGroupScaleStyles = window.document.createElement("div");
            menuGroupScaleStyles.classList.add("menuGroup");
            var lblScaleStyles = window.document.createElement("label");
            lblScaleStyles.classList.add("menuElement");
            lblScaleStyles.classList.add("label");
            lblScaleStyles.setAttribute("for", "checkScaleStyles");
            lblScaleStyles.innerText = "Scale styles ";
            var checkScaleStyles = window.document.createElement("input");
            checkScaleStyles.classList.add("menuElement");
            checkScaleStyles.setAttribute("type", "checkbox");
            checkScaleStyles.setAttribute("name", "checkScaleStyles");
            checkScaleStyles.checked = this._viewport.scaleStyles;
            checkScaleStyles.addEventListener("change", (e) => {
                this._viewport.scaleStyles = e.target.checked;
            });
            menuGroupScaleStyles.appendChild(lblScaleStyles);
            lblScaleStyles.appendChild(checkScaleStyles);
            var separator2 = window.document.createElement("div");
            separator2.classList.add("menuElement");
            separator2.classList.add("separator");
            var menuGroupButtons = window.document.createElement("div");
            menuGroupButtons.classList.add("menuGroup");
            menuGroupButtons.classList.add("menuGroupButtons");
            var btnZoomMinus = window.document.createElement("button");
            btnZoomMinus.classList.add("menuButton");
            btnZoomMinus.setAttribute("title", "Zoom Out");
            btnZoomMinus.style.setProperty("background-image", "url(resources/zoom_minus.png)");
            btnZoomMinus.addEventListener("click", (e) => this._viewport.zoom(this.ZOOM_FACTOR));
            var btnZoomPlus = window.document.createElement("button");
            btnZoomPlus.classList.add("menuButton");
            btnZoomPlus.setAttribute("title", "Zoom In");
            btnZoomPlus.style.setProperty("background-image", "url(resources/zoom_plus.png)");
            btnZoomPlus.addEventListener("click", (e) => this._viewport.zoom(1 / this.ZOOM_FACTOR));
            var btnZoomAll = window.document.createElement("button");
            btnZoomAll.classList.add("menuButton");
            btnZoomAll.setAttribute("title", "Zoom All");
            btnZoomAll.style.setProperty("background-image", "url(resources/zoom_all.png)");
            btnZoomAll.addEventListener("click", (e) => this._viewport.zoomAll());
            menuGroupButtons.appendChild(btnZoomMinus);
            menuGroupButtons.appendChild(btnZoomPlus);
            menuGroupButtons.appendChild(btnZoomAll);
            this._htmlElement.appendChild(menuGroupShowAxes);
            this._htmlElement.appendChild(separator1);
            this._htmlElement.appendChild(menuGroupScaleStyles);
            this._htmlElement.appendChild(separator2);
            this._htmlElement.appendChild(menuGroupButtons);
        }
        get htmlElement() { return this._htmlElement; }
        get viewport() { return this._viewport; }
    }
    SampleApps.ViewportMenu = ViewportMenu;
    class ViewerApp {
        constructor() {
            this._menuViewports = [];
            this._initializeUI();
        }
        static start() {
            new ViewerApp();
        }
        _initializeUI() {
            this._menuBar = window.document.querySelector("#menuBar");
            this._mainView = window.document.querySelector("#mainView");
            this._vectorGraphicsView = new Vgx.VectorGraphicsView();
            this._vectorGraphicsView.onViewportsLayoutChanged.add(this._onViewportsLayoutChanged);
            this._vectorGraphicsView.viewportsLayout = Vgx.ViewportsLayout.ONE;
            this._vectorGraphicsView.viewportsSpace = 4;
            this._vectorGraphicsView.currentViewport.scaleStyles = true;
            this._onViewportsLayoutChanged(this._vectorGraphicsView, null);
            this._mainView.appendChild(this._vectorGraphicsView.htmlElement);
            this._selectDrawing = window.document.querySelector("#selectDrawing");
            this._selectDrawing.addEventListener("change", (e) => {
                var args = this._selectDrawing.value.split("|");
                this._loadDrawing(args[0], args[1]).catch();
            });
            this._selectBackground = window.document.querySelector("#selectBackground");
            this._selectBackground.addEventListener("change", (e) => {
                this._vectorGraphicsView.drawing.background = this._selectBackground.value;
            });
            this._selectViewports = window.document.querySelector("#selectViewports");
            this._selectViewports.addEventListener("change", (e) => {
                this._vectorGraphicsView.viewportsLayout = this._selectViewports.selectedIndex + 1;
            });
            window.addEventListener("resize", this._onWindowResize.bind(this));
            this._fillSelectInputs();
            var optionParts = this._selectDrawing.options[0].value.split("|");
            var url = optionParts[0];
            var type = optionParts[1];
            this._loadDrawing(url, type).catch(() => this._onWindowResize());
        }
        _fillSelectInputs() {
            const createOption = (text, value) => {
                const result = document.createElement("option");
                result.value = value;
                result.textContent = text;
                return result;
            };
            this._selectDrawing.appendChild(createOption("vgx-model", "../../drawings/vgx-model.js|script"));
            this._selectDrawing.appendChild(createOption("modern-clock", "../../drawings/modern-clock.js|script"));
            this._selectDrawing.appendChild(createOption("clock", "../../drawings/clock.js|script"));
            this._selectDrawing.appendChild(createOption("house", "../../drawings/house.json|json"));
            this._selectDrawing.appendChild(createOption("hello-world", "../../drawings/hello-world.json|json"));
            this._selectDrawing.appendChild(createOption("google-logo", "../../drawings/google-logo.json|json"));
            this._selectBackground.appendChild(createOption("Dark", "#0a0d11"));
            this._selectBackground.appendChild(createOption("Light", "#f1f5ff"));
            this._selectViewports.appendChild(createOption("One", "1"));
            this._selectViewports.appendChild(createOption("Two vertical", "2"));
            this._selectViewports.appendChild(createOption("Two horizontal", "3"));
        }
        _onWindowResize() {
            this._mainView.style.setProperty("padding-top", this._menuBar.clientHeight + "px");
        }
        _onViewportsLayoutChanged(sender, e) {
            var updatedMenuViewports = [];
            for (var i = 0; i < this._vectorGraphicsView.viewportsCount; i++) {
                var viewport = this._vectorGraphicsView.getViewport(i);
                if (this._menuViewports.indexOf(viewport) == -1) {
                    this._addViewportMenu(viewport);
                }
                updatedMenuViewports.push(viewport);
            }
            this._menuViewports = updatedMenuViewports;
        }
        _addViewportMenu(viewport) {
            var viewportMenu = new ViewportMenu(viewport);
            viewport.htmlElement.appendChild(viewportMenu.htmlElement);
        }
        _resolveImporter(fullTypeName) {
            const f = new Function(`return new ${fullTypeName}()`);
            return f();
        }
        _loadDrawing(url, type) {
            return __awaiter(this, void 0, void 0, function* () {
                debugger;
                const importerType = Vgx.ImportersManager.getTypeOrDefault(type);
                const importer = this._resolveImporter(importerType.typeName);
                if (!importer) {
                    throw new Error("importer not loaded");
                }
                const drawing = yield importer.loadFile(url);
                if (drawing.background) {
                    var option = document.createElement("option");
                    option.value = drawing.background;
                    option.innerText = drawing.background;
                    this._selectBackground.options.add(option);
                    this._selectBackground.selectedIndex = this._selectBackground.options.length - 1;
                }
                else {
                    drawing.background = this._selectBackground.options[0].value;
                }
                this._vectorGraphicsView.drawing = drawing;
            });
        }
    }
    SampleApps.ViewerApp = ViewerApp;
})(SampleApps || (SampleApps = {}));
//# sourceMappingURL=vgx.js.map