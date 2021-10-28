/// <reference path="../libs/Cgx/cgx.d.ts" />
declare namespace Vgx {
    interface PropertyChangedArgs extends EventArgs {
        readonly propertyName: string;
    }
    class ReactiveObject {
        private readonly _events;
        constructor();
        protected _raisePropertyChanged(propertyName: string): void;
        readonly onPropertyChanged: EventSet<ReactiveObject, PropertyChangedArgs>;
    }
}
declare namespace Vgx {
    class Artboard extends ReactiveObject {
        private _clipContent;
        private _background;
        private _border;
        private _borderWidth;
        private _shadow;
        private _bounds;
        constructor();
        get border(): BrushDefinition;
        set border(v: BrushDefinition);
        get borderWidth(): number;
        set borderWidth(v: number);
        get background(): BrushDefinition;
        set background(v: BrushDefinition);
        get shadow(): Shadow;
        set shadow(v: Shadow);
        get clipContent(): boolean;
        set clipContent(v: boolean);
        get bounds(): Rect;
        set bounds(v: Rect);
    }
}
declare namespace Vgx {
    class Collection<TElement extends any> implements Iterable<TElement> {
        private _items;
        constructor();
        [Symbol.iterator](): Iterator<TElement, any, undefined>;
        protected _getItems(): ReadonlyArray<TElement>;
        add(item: TElement): number;
        addRange(items: TElement[]): number;
        elementAt(index: number): TElement;
        indexOf(value: any, selector?: (x: TElement) => any): number;
        toArray(): TElement[];
        get count(): number;
        protected _onClearCompleted(items: TElement[]): void;
        protected _onInsertCompleted(index: number, items: TElement[]): void;
        protected _onRemoveCompleted(index: number, items: TElement[]): void;
        clear(): void;
        insert(index: number, item: TElement): number;
        insertRange(index: number, items: TElement[]): number;
        remove(value: any, selector?: (x: TElement) => any): boolean;
        removeAt(index: number): TElement;
        removeAny(predicate: (x: TElement) => boolean): any[];
    }
}
declare namespace Vgx {
    class DictionaryObject<TKey extends any, TValue extends any> implements Iterable<KeyValuePair<TKey, TValue>> {
        static fromObject(obj: DynamicObject): DictionaryObject<string | symbol, any>;
        private _keys;
        private _values;
        constructor();
        containsKey(key: TKey): boolean;
        remove(key: TKey): boolean;
        get(key: TKey): TValue;
        set(key: TKey, value: TValue): void;
        [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>, any, undefined>;
    }
}
declare namespace Vgx {
    class Drawing {
        static fromJSON(json: string): Drawing;
        static fromScript(script: string): Drawing;
        private _usedHandles;
        private _children;
        private _isDirty;
        private _background;
        private _redrawHandlers;
        private _artboard;
        constructor();
        private _onChildrenChanged;
        private _artboardPropertyChanged;
        get background(): BrushDefinition;
        set background(v: BrushDefinition);
        get isDirty(): boolean;
        set isDirty(v: boolean);
        get artboard(): Artboard;
        set artboard(v: Artboard);
        registerDirtyEventHandler(eventHandler: Action): void;
        unregisterDirtyEventHandler(eventHandler: Action): void;
        getFreeHandle(): string;
        addChild(vgxEntity: VgxEntity): void;
        removeChild(vgxEntity: VgxEntity): VgxEntity;
        getChildren(): VgxEntityCollection;
        clear(): void;
        getBounds(): Rect;
    }
}
declare namespace Vgx {
    class DrawingContext {
        private _drawing;
        private _canvas;
        private _viewTransform;
        private _graphics;
        private _shadow;
        private _scaleStyles;
        constructor(drawing: Drawing, canvas: Cgx.CanvasSurface, viewTransform: ViewTransform);
        _beginRender(): void;
        _endRender(): void;
        _getImageData(): void;
        _attachToDrawing(drawing: Drawing): void;
        get drawing(): Drawing;
        get fillBrush(): BrushDefinition;
        set fillBrush(v: BrushDefinition);
        get fontFamily(): string;
        set fontFamily(v: string);
        get fontSize(): string;
        set fontSize(v: string);
        get scaleStyles(): boolean;
        set scaleStyles(v: boolean);
        get shadow(): Shadow;
        set shadow(v: Shadow);
        get strokeBrush(): BrushDefinition;
        set strokeBrush(v: BrushDefinition);
        get strokeWidth(): number;
        set strokeWidth(v: number);
        get textBaseline(): CanvasTextBaseline;
        set textBaseline(v: CanvasTextBaseline);
        clear(fillBrush?: BrushDefinition): void;
        drawArtboard(artboard: Artboard, background: BrushDefinition): void;
        drawArc(arc: VgxArc): void;
        drawLine(line: VgxLine): void;
        drawRectangle(rectangle: VgxRectangle): void;
        drawSquare(square: VgxSquare): void;
        drawCircle(circle: VgxCircle): void;
        drawEllipse(ellipse: VgxEllipse): void;
        drawPolyline(polyline: VgxPolyline): void;
        drawPolygon(polygon: VgxPolygon): void;
        drawTriangle(triangle: VgxTriangle): void;
        drawQuad(quad: VgxQuad): void;
        drawCubicCurve(cubicCurve: VgxCubicCurve): void;
        drawQuadraticCurve(quadraticCurve: VgxQuadraticCurve): void;
        drawImage(image: VgxImage): void;
        drawText(text: VgxText, measure?: boolean): TextMetrics;
        drawPath(path: VgxPath): void;
        drawPie(pie: VgxPie): void;
        drawDonut(donut: VgxDonut): void;
        drawGroup(group: VgxGroup): void;
        drawView(view: VgxView): void;
        drawAxes(): void;
        drawDrawing(drawing: Drawing): void;
        private _drawEntityCollection;
        measureText(text: string): TextMetrics;
        pushTransform(transform: Transform): void;
        popTransform(): void;
    }
}
declare namespace Vgx {
    class DrawingLoader {
        private static resolveNamespace;
        private static getVgxType;
        private static loadCustomEntities;
        static loadChildEntity(typeName: string, data: DynamicObject): any;
        static loadFromObject: (jsonDrawing: any) => Drawing;
    }
}
declare namespace Vgx {
    class EntityTransform extends Cgx.Transform {
        private _entity;
        constructor(entity: VgxEntity);
        protected _propertyChanged: (propertyName: string) => void;
    }
}
declare namespace Vgx {
    interface EntityTypeDefinition {
        name: string;
        typeName: string;
        defaultValues: DynamicObject;
    }
    export class EntityTypeManager {
        private static _registeredTypes;
        static registerType(name: string, typeName: string, defaultValues?: DynamicObject): void;
        static getType(name: string, throwException?: boolean): EntityTypeDefinition;
    }
    export {};
}
declare namespace Vgx {
    interface EventArgs {
        [name: string]: any;
    }
    type EventHandler<TOwner, TArgs> = (sender: TOwner, eventArgs: TArgs) => void;
    interface EventOptions {
        once: boolean;
    }
    interface EventGroup<T, TArgs> {
        eventName: string;
        entries: Array<EventEntry<T, TArgs>>;
    }
    interface EventEntry<T, TArgs> {
        handler: EventHandler<T, TArgs>;
        options: EventOptions;
        bindTarget: any;
    }
    interface IEventSet<TOwner, TArgs> {
        add(handler: EventHandler<TOwner, TArgs>): void;
        once(handler: EventHandler<TOwner, TArgs>): void;
        remove(handler: EventHandler<TOwner, TArgs>): void;
        has(handler: EventHandler<TOwner, TArgs>): boolean;
        trigger(args?: TArgs): void;
        stop(): void;
        resume(): void;
    }
    class EventSet<TOwner, TArgs> implements IEventSet<TOwner, TArgs> {
        private _eventsManager;
        private _eventName;
        private _bindTarget;
        constructor(eventGroup: EventsManager, eventName: string, bindTarget?: any);
        add(handler: EventHandler<TOwner, TArgs>, bindTarget?: any): void;
        once(handler: EventHandler<TOwner, TArgs>): void;
        remove(handler: EventHandler<TOwner, TArgs>): void;
        has(handler: EventHandler<TOwner, TArgs>): boolean;
        trigger(args?: TArgs): void;
        stop(): void;
        resume(): void;
    }
    class EventsManager {
        private readonly _owner;
        private readonly _validEventOptions;
        private _events;
        private _disabledEventsNames;
        constructor(owner: any);
        private getHandlerEntryIndex;
        attach<TArgs>(eventName: string, eventHandler: EventHandler<any, TArgs>, eventOptions?: EventOptions, bindTarget?: any): void;
        detach<TArgs>(eventName: string, eventHandler: EventHandler<any, TArgs>): void;
        trigger<TArgs>(eventName: string, args?: TArgs): void;
        getHandlersCount(eventName: string): number;
        hasHandler<TArgs>(eventName: string, eventHandler: EventHandler<any, TArgs>): boolean;
        stop(eventName?: string): void;
        resume(eventName?: string): void;
        create<TArgs>(eventName: string): EventSet<any, TArgs>;
        createEventArgs(data?: {
            [name: string]: any;
        }): EventArgs;
    }
}
declare namespace Vgx {
}
declare namespace Vgx {
    class MathUtils {
        static areClose(value1: number, value2: number): boolean;
        static isOne(value: number): boolean;
        static isZero(value: number): boolean;
        static interpolatePointWithCubicCurves(points: Cgx.Point[], isClosed: boolean): {
            startPoint: {
                x: number;
                y: number;
            };
            endPoint: {
                x: number;
                y: number;
            };
            firstControlPoint: {
                x: number;
                y: number;
            };
            secondControlPoint: {
                x: number;
                y: number;
            };
        }[];
        static getPointsBounds(points: Cgx.Point[]): Rect;
    }
}
declare namespace Vgx {
    class PointDefinition {
        private _id;
        private _figures;
        private _vgxPath;
        constructor(id: string, figures: any[]);
        private _buildPath;
        anchorX: number;
        anchorY: number;
        get id(): string;
        getPath(): VgxPath;
    }
}
declare namespace Vgx {
    class PointDefinitions {
        private static _type1;
        private static _type2;
        static get type1(): PointDefinition;
        static get type2(): PointDefinition;
    }
}
declare namespace Vgx {
    enum CollectionChangedAction {
        Added = 0,
        Removed = 1,
        Cleared = 2
    }
    interface CollectionChangedArgs<TElement extends any> extends EventArgs {
        readonly action: CollectionChangedAction;
        readonly index: number;
        readonly items: TElement[];
    }
    class ReactiveCollection<TElement extends any> extends Collection<TElement> {
        private readonly _events;
        constructor();
        private _raiseCollectionChanged;
        readonly onCollectionChanged: EventSet<ReactiveCollection<TElement>, CollectionChangedArgs<TElement>>;
        protected _onClearCompleted(items: TElement[]): void;
        protected _onInsertCompleted(index: number, items: TElement[]): void;
        protected _onRemoveCompleted(index: number, items: TElement[]): void;
    }
}
declare namespace Vgx {
    class Rect {
        static readonly empty: Rect;
        static readonly invalid: Rect;
        static isEmpty(rect: Rect): boolean;
        static equals(rect1: Rect, rect2: Rect): boolean;
        static from(values: {
            x: number;
            y: number;
            width: number;
            height: number;
        }): Rect;
        constructor(x?: number, y?: number, width?: number, height?: number);
        x: number;
        y: number;
        width: number;
        height: number;
        union(rect: Rect): void;
    }
}
declare namespace Vgx {
    class Shadow extends ReactiveObject implements Cgx.Shadow {
        static isDefault(shadow: Shadow): boolean;
        private _blur;
        private _color;
        private _offsetX;
        private _offsetY;
        constructor();
        get blur(): number;
        set blur(v: number);
        get color(): string;
        set color(v: string);
        get offsetX(): number;
        set offsetX(v: number);
        get offsetY(): number;
        set offsetY(v: number);
    }
}
declare namespace Vgx {
    class TextUtils {
        private static _initialized;
        private static _canvasBuffer;
        private static _context;
        private static initialize;
        private static ensureInitialized;
        private static estimateFontHeight;
        private static measureTextWidth;
        static measureText(text: string, fontFamily: string, fontSize: number, fastHeightEstimation?: boolean): Rect;
        static getTextMetrics(text: string, fontFamily: string, fontSize: number): TextMetrics;
    }
}
declare namespace Vgx {
    type DynamicObject = {
        [name: string]: any;
    };
    type TypedObject<T extends any> = {
        [name: string]: T;
    };
    type Action = () => void;
    type KeyValuePair<TKey extends any, TValue extends any> = {
        key: TKey;
        value: TValue;
    };
    type Brush = Cgx.Brush;
    type BrushDefinition = Cgx.BrushDefinition;
    type BrushType = Cgx.BrushType;
    type Transform = Cgx.Transform;
    type Point = Cgx.Point;
    type Size = Cgx.Size;
}
declare namespace Vgx {
    class Utils {
        static createUUID(includeSeparators?: boolean): string;
        static createCanvasColorOrBrush(canvas: HTMLCanvasElement, value: any): string | CanvasGradient | CanvasPattern;
        static hslToRgb(h: number, s: number, l: number): number[];
        static getEntitiesBounds(entities: Collection<VgxEntity>, originX?: number, originY?: number): Rect;
    }
}
declare namespace Vgx {
    class Vars {
        private static _pointType;
        private static _pointSize;
        private static _fontFamily;
        private static _fontSize;
        private static _vertexSize;
        private static _vertexFill;
        private static _vertexStroke;
        private static _vertexStrokeWidth;
        static readonly defaultStrokeStyle: number | string;
        static readonly defaultStrokeWidth: number;
        static readonly defaultFillStyle: number | string;
        static get pointType(): PointDefinition;
        static set pointType(v: PointDefinition);
        static get pointSize(): number;
        static set pointSize(v: number);
        static get fontFamily(): string;
        static set fontFamily(v: string);
        static get fontSize(): number;
        static set fontSize(v: number);
        static get vertexSize(): number;
        static set vertexSize(v: number);
        static get vertexFillColor(): number | string;
        static set vertexFillColor(v: number | string);
        static get vertexStrokeColor(): number | string;
        static set vertexStrokeColor(v: number | string);
        static get vertexStrokeWidth(): number;
        static set vertexStrokeWidth(v: number);
    }
}
declare namespace Vgx {
    class ViewTransform implements Cgx.ITransform {
        private _matrix;
        private _matrixInverted;
        private _isDirty;
        private _viewZoom;
        private _viewTargetX;
        private _viewTargetY;
        private _viewPixelWidth;
        private _viewPixelHeight;
        private _viewPixelHalfWidth;
        private _viewPixelHalfHeight;
        private _computeInternalMatrix;
        private _getMatrixInverted;
        private _setMatrixOffset;
        private _setTarget;
        get viewTargetX(): number;
        get viewTargetY(): number;
        get viewZoom(): number;
        getMatrix(): Cgx.Matrix;
        getViewBounds(): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        globalToLocalPoint(x: number, y: number): Cgx.Point;
        globalToLocalRect(x: number, y: number, width: number, height: number): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        localToGlobalPoint(x: number, y: number): Cgx.Point;
        localToGlobalRect(x: number, y: number, width: number, height: number): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        moveViewTarget(dx: number, dy: number): void;
        setViewPixelSize(width: number, height: number): void;
        setViewTarget(tx: number, ty: number): void;
        setViewZoom(value: number): void;
        setViewZoomTo(value: number, tx: number, ty: number): void;
    }
}
declare namespace Vgx {
    abstract class VgxObject {
        private readonly _events;
        private _handle;
        private _drawing;
        private _bindings;
        constructor();
        private _addToDrawing;
        private _removeFromDrawing;
        protected _addedToDrawing(): void;
        protected _getValue(propertyName: string, defaultValue: any): any;
        abstract getBounds(): Rect;
        get drawing(): Drawing;
        get handle(): string;
        addToDrawing(drawing: Drawing): void;
        removeFromDrawing(): void;
        setBinding(propertyName: string, binding: any): void;
        readonly onHandleCreated: EventSet<VgxObject, EventArgs>;
        readonly onHandleDestroyed: EventSet<VgxObject, EventArgs>;
    }
}
declare namespace Vgx {
    abstract class VgxDrawable extends VgxObject {
        private _visible;
        private _appearanceDirty;
        private _geometryDirty;
        private _positionDirty;
        constructor();
        draw(drawingContext: DrawingContext): void;
        get appearanceDirty(): boolean;
        set appearanceDirty(v: boolean);
        get geometryDirty(): boolean;
        set geometryDirty(v: boolean);
        get positionDirty(): boolean;
        set positionDirty(v: boolean);
        get visible(): boolean;
        set visible(v: boolean);
    }
}
declare namespace Vgx {
    abstract class VgxEntity extends VgxDrawable {
        private _insertPointX;
        private _insertPointY;
        private _stroke;
        private _strokeWidth;
        private _shadow;
        private _transform;
        private _cachedBounds;
        constructor();
        protected _getVertices(): {
            x: any;
            y: any;
        }[];
        protected _getBounds(): Rect;
        loadData(data: DynamicObject): void;
        abstract _getPath(): Path2D;
        getBounds(): Rect;
        get insertPointX(): number;
        set insertPointX(v: number);
        get insertPointY(): number;
        set insertPointY(v: number);
        get stroke(): BrushDefinition;
        set stroke(v: BrushDefinition);
        get strokeWidth(): number;
        set strokeWidth(v: number);
        get shadow(): Shadow;
        get transform(): Transform;
        set transform(v: Transform);
    }
}
declare namespace Vgx {
    class VgxArc extends VgxEntity {
        private _radius;
        private _startAngle;
        private _endAngle;
        private _startAngleRad;
        private _endAngleRad;
        private _isAntiClockwise;
        constructor();
        protected _getBounds(): Rect;
        _getPath(): Path2D;
        get radius(): number;
        set radius(v: number);
        get startAngle(): number;
        set startAngle(v: number);
        get startAngleRad(): number;
        set startAngleRad(v: number);
        get endAngle(): number;
        set endAngle(v: number);
        get endAngleRad(): number;
        set endAngleRad(v: number);
        get isAntiClockwise(): boolean;
        set isAntiClockwise(v: boolean);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    abstract class VgxFillableEntity extends VgxEntity implements VgxFillable {
        private _fill;
        get fill(): BrushDefinition;
        set fill(v: BrushDefinition);
    }
}
declare namespace Vgx {
    class VgxCircle extends VgxFillableEntity {
        private _radius;
        constructor();
        protected _getBounds(): Rect;
        _getPath(): Path2D;
        get radius(): number;
        set radius(v: number);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxCubicCurve extends VgxFillableEntity {
        private _points;
        private _controlPoints1;
        private _controlPoints2;
        private _bounds;
        constructor();
        protected _getBounds(): Rect;
        private updateBounds;
        loadData(data: DynamicObject): void;
        _getPath(): Path2D;
        get points(): ReactiveCollection<Cgx.Point>;
        get controlPoints1(): ReactiveCollection<Cgx.Point>;
        get controlPoints2(): ReactiveCollection<Cgx.Point>;
        isClosed: boolean;
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxDonut extends VgxFillableEntity {
        private _startRadius;
        private _endRadius;
        private _startAngle;
        private _endAngle;
        private _startAngleRad;
        private _endAngleRad;
        private _isAntiClockwise;
        constructor();
        protected _getBounds(): Rect;
        _getPath(): Path2D;
        get startRadius(): number;
        set startRadius(v: number);
        get endRadius(): number;
        set endRadius(v: number);
        get startAngle(): number;
        set startAngle(v: number);
        get startAngleRad(): number;
        set startAngleRad(v: number);
        get endAngle(): number;
        set endAngle(v: number);
        get endAngleRad(): number;
        set endAngleRad(v: number);
        get isAntiClockwise(): boolean;
        set isAntiClockwise(v: boolean);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxEllipse extends VgxFillableEntity {
        private _xRadius;
        private _yRadius;
        constructor();
        protected _getBounds(): Rect;
        _getPath(): Path2D;
        get xRadius(): number;
        set xRadius(v: number);
        get yRadius(): number;
        set yRadius(v: number);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxEntityCollection extends ReactiveCollection<VgxEntity> {
        private _owner;
        constructor(owner?: any);
        ofType<T extends VgxEntity>(type: {
            new (): T;
        }): T[];
        get owner(): any;
    }
}
declare namespace Vgx {
    interface VgxFillable {
        fill: BrushDefinition;
    }
}
declare namespace Vgx {
    class VgxGroup extends VgxFillableEntity {
        private _children;
        private _bounds;
        constructor();
        protected _getBounds(): Rect;
        private updateBounds;
        loadData(data: DynamicObject): void;
        _getPath(): Path2D;
        get children(): VgxEntityCollection;
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxImage extends VgxEntity {
        private _width;
        private _height;
        private _cornersRadius;
        private _source;
        constructor();
        protected _getBounds(): Rect;
        _getPath(): Path2D;
        get cornersRadius(): number;
        set cornersRadius(v: number);
        get height(): number;
        set height(v: number);
        get width(): number;
        set width(v: number);
        get source(): CanvasImageSource;
        set source(v: CanvasImageSource);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxLine extends VgxEntity {
        private _endPoint;
        private _bounds;
        constructor();
        protected _getBounds(): Rect;
        private updateBounds;
        _getPath(): Path2D;
        get startPoint(): Cgx.Point;
        set startPoint(v: Cgx.Point);
        get endPoint(): Cgx.Point;
        set endPoint(v: Cgx.Point);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    interface PathFigure {
        readonly path: Path2D;
        isEmpty: boolean;
    }
    class VgxPath extends VgxFillableEntity {
        private _lastX;
        private _lastY;
        private _fillRule;
        private _currentFigure;
        private _children;
        private _bounds;
        constructor();
        private collectPath2D;
        private createFigureObj;
        private createNewFigure;
        private ensureHasFigure;
        protected _getBounds(): Rect;
        private updateBounds;
        loadData(data: DynamicObject): void;
        _getPath(): Path2D;
        get figures(): ReactiveCollection<Path2D>;
        get fillRule(): CanvasFillRule;
        set fillRule(v: CanvasFillRule);
        draw(drawingContext: DrawingContext): void;
        addArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        addFigure(pathData: string): void;
        addRect(x: number, y: number, width: number, height: number): void;
        addEllipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        arcTo(cpx: number, cpy: number, x: number, y: number, radius: number): void;
        beginNewFigure(): void;
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
        clear(): void;
        closeFigure(): void;
        endFigure(): void;
        horizontalLineTo(x: number): void;
        lineTo(x: number, y: number): void;
        moveTo(x: number, y: number): void;
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
        verticalLineTo(y: number): void;
    }
}
declare namespace Vgx {
    class VgxPie extends VgxFillableEntity {
        private _radius;
        private _startAngle;
        private _endAngle;
        private _startAngleRad;
        private _endAngleRad;
        private _isAntiClockwise;
        constructor();
        protected _getBounds(): Rect;
        _getPath(): Path2D;
        get radius(): number;
        set radius(v: number);
        get startAngle(): number;
        set startAngle(v: number);
        get startAngleRad(): number;
        set startAngleRad(v: number);
        get endAngle(): number;
        set endAngle(v: number);
        get endAngleRad(): number;
        set endAngleRad(v: number);
        get isAntiClockwise(): boolean;
        set isAntiClockwise(v: boolean);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxPolyline extends VgxFillableEntity {
        private _points;
        private _bounds;
        constructor();
        protected _getBounds(): Rect;
        private updateBounds;
        loadData(data: DynamicObject): void;
        _getPath(): Path2D;
        get points(): ReactiveCollection<Cgx.Point>;
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxPolygon extends VgxPolyline {
        constructor();
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxQuad extends VgxFillableEntity {
        private _point1;
        private _point2;
        private _point3;
        private _point4;
        private _bounds;
        constructor();
        protected _getBounds(): Rect;
        private updateBounds;
        _getPath(): Path2D;
        get point1(): Cgx.Point;
        set point1(v: Cgx.Point);
        get point2(): Cgx.Point;
        set point2(v: Cgx.Point);
        get point3(): Cgx.Point;
        set point3(v: Cgx.Point);
        get point4(): Cgx.Point;
        set point4(v: Cgx.Point);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxQuadraticCurve extends VgxFillableEntity {
        private _points;
        private _controlPoints;
        private _bounds;
        constructor();
        protected _getBounds(): Rect;
        private updateBounds;
        loadData(data: DynamicObject): void;
        _getPath(): Path2D;
        get points(): ReactiveCollection<Cgx.Point>;
        get controlPoints(): ReactiveCollection<Cgx.Point>;
        isClosed: boolean;
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxRectangle extends VgxFillableEntity {
        private _width;
        private _height;
        private _cornersRadius;
        constructor();
        protected _getBounds(): Rect;
        _getPath(): Path2D;
        get cornersRadius(): number;
        set cornersRadius(v: number);
        get height(): number;
        set height(v: number);
        get width(): number;
        set width(v: number);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxSquare extends VgxFillableEntity {
        private _size;
        private _cornersRadius;
        constructor();
        protected _getBounds(): Rect;
        _getPath(): Path2D;
        get cornersRadius(): number;
        set cornersRadius(v: number);
        get size(): number;
        set size(v: number);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxText extends VgxFillableEntity {
        private _source;
        private _fontFamily;
        private _fontSize;
        private _alignment;
        private _baseline;
        private _textMeasure;
        constructor();
        protected _getBounds(): Rect;
        private getBaselineOffset;
        _getPath(): Path2D;
        get source(): string;
        set source(v: string);
        get fontFamily(): string;
        set fontFamily(v: string);
        get fontSize(): number;
        set fontSize(v: number);
        get alignment(): CanvasTextAlign;
        set alignment(v: CanvasTextAlign);
        get baseline(): CanvasTextBaseline;
        set baseline(v: CanvasTextBaseline);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxTriangle extends VgxFillableEntity {
        private _point1;
        private _point2;
        private _point3;
        private _bounds;
        constructor();
        protected _getBounds(): Rect;
        private updateBounds;
        _getPath(): Path2D;
        get point1(): Cgx.Point;
        set point1(v: Cgx.Point);
        get point2(): Cgx.Point;
        set point2(v: Cgx.Point);
        get point3(): Cgx.Point;
        set point3(v: Cgx.Point);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    class VgxView extends VgxFillableEntity {
        private _children;
        private _bounds;
        private _clipBounds;
        private _clip;
        constructor();
        private _onChildrenChanged;
        private _onClipBoundsChanged;
        private _onClipStateChanged;
        private updateBounds;
        protected _getBounds(): Rect;
        _getPath(): Path2D;
        get children(): VgxEntityCollection;
        get clipBounds(): Rect;
        set clipBounds(v: Rect);
        get clip(): boolean;
        set clip(v: boolean);
        draw(drawingContext: DrawingContext): void;
    }
}
declare namespace Vgx {
    interface ViewportsLayoutChangedEventArgs extends EventArgs {
        layout: ViewportsLayout;
    }
    class VectorGraphicsView {
        private _events;
        private _htmlElement;
        private _viewports;
        private _currentViewport;
        private _drawing;
        private _hasDrawing;
        private _viewportsLayout;
        private _viewportsSpace;
        private _neverArranged;
        constructor();
        private _arrangeLayout;
        private _addNewViewport;
        private _addViewport;
        private _removeLastViewport;
        private _setActiveViewport;
        private _ensureViewportsCount;
        private _checkNeverArranged;
        private _onDrawingChanged;
        private _onViewportsLayoutChanged;
        get htmlElement(): HTMLElement;
        get drawing(): Drawing;
        set drawing(v: Drawing);
        get viewportsLayout(): ViewportsLayout;
        set viewportsLayout(v: ViewportsLayout);
        get viewportsSpace(): ViewportsLayout;
        set viewportsSpace(v: ViewportsLayout);
        get viewportsCount(): number;
        get currentViewport(): Viewport;
        getViewport(index: number): Viewport;
        onViewportsLayoutChanged: EventSet<VectorGraphicsView, ViewportsLayout>;
    }
}
declare namespace Vgx {
    interface ViewChangedEventArgs extends EventArgs {
        rect: Rect;
    }
    class Viewport {
        private readonly ZOOM_STEP;
        private _events;
        private _htmlElement;
        private _canvas;
        private _drawing;
        private _drawingContext;
        private _viewTransform;
        private _isDirty;
        private _needRedraw;
        private _onDrag;
        private _lastMouseX;
        private _lastMouseY;
        private _nerverResized;
        private _autosize;
        private _width;
        private _height;
        private _hasDrawing;
        private _drawAxes;
        constructor(canvas?: Cgx.CanvasSurface, drawing?: Drawing);
        private _setupMouseEvents;
        private _checkNeedRedraw;
        private _invalidate;
        private _render;
        private _handleViewChanged;
        private _checkNeverResized;
        private _onRender;
        private _onDrawingDirty;
        private _onMouseDown;
        private _onMouseMove;
        private _onMouseUp;
        private _onMouseWheel;
        private _onResize;
        private _onDrawingChanged;
        get autosize(): boolean;
        set autosize(v: boolean);
        get canvas(): Cgx.CanvasSurface;
        get currentZoom(): number;
        get currentTargetX(): number;
        get currentTargetY(): number;
        get drawAxes(): boolean;
        set drawAxes(v: boolean);
        get drawing(): Drawing;
        set drawing(v: Drawing);
        get height(): number;
        set height(v: number);
        get htmlElement(): HTMLElement;
        get scaleStyles(): boolean;
        set scaleStyles(v: boolean);
        get width(): number;
        set width(v: number);
        getCursorPosition(): Cgx.Point;
        getCurrentViewBounds(): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        redraw(): void;
        move(offsetX: number, offsetY: number): void;
        moveTo(centerX: number, centerY: number): void;
        zoom(zoomIncrement: number): void;
        zoomTo(zoomIncrement: number, centerX: number, centerY: number): void;
        zoomAt(zoomFactor: number, centerX: number, centerY: number): void;
        zoomAll(): void;
        onViewChanged: EventSet<Viewport, ViewChangedEventArgs>;
    }
}
declare namespace Vgx {
    enum ViewportsLayout {
        ONE = 1,
        TWO_VERTICAL = 2,
        TWO_HORIZONTAL = 3
    }
}
declare namespace Vgx {
    interface HttpClientProgressEventArgs {
        loaded: number;
        total: number;
        percentage: number;
    }
    interface HttpClientSuccessEventArgs {
        result: any;
        resultType: XMLHttpRequestResponseType;
        rawResult: string;
    }
    interface HttpClientErrorEventArgs {
        status: string;
        code: number;
    }
    class HttpClient {
        private static _download;
        static downloadString(url: string, onSuccess: EventHandler<HttpClient, HttpClientSuccessEventArgs>, optOnError?: EventHandler<HttpClient, HttpClientErrorEventArgs>, optOnAbort?: EventHandler<HttpClient, EventArgs>): void;
        static downloadJSON(url: string, onSuccess: EventHandler<HttpClient, HttpClientSuccessEventArgs>, optOnError?: EventHandler<HttpClient, HttpClientErrorEventArgs>, optOnAbort?: EventHandler<HttpClient, EventArgs>): void;
        private _events;
        private _baseUrl;
        private _xhr;
        private _method;
        private _mimeType;
        private _responseType;
        private _timeout;
        private _isBusy;
        private _useCredentials;
        constructor(baseUrl?: string);
        private _xhr_onProgress;
        private _xhr_onLoad;
        private _xhr_onError;
        private _xhr_onAbort;
        private _formatBaseUrl;
        setRequestHeader(name: string, value: string): void;
        sendRequest(endPoint: string, optData?: Document | BodyInit | null): void;
        abortRequest(): void;
        get baseUrl(): string;
        set baseUrl(v: string);
        get isBusy(): boolean;
        get method(): string;
        set method(v: string);
        get mimeType(): string;
        set mimeType(v: string);
        get responseType(): string;
        set responseType(v: string);
        get timeout(): number;
        set timeout(v: number);
        get useCredentials(): boolean;
        set useCredentials(v: boolean);
        onProgress: EventSet<HttpClient, HttpClientProgressEventArgs>;
        onSuccess: EventSet<HttpClient, HttpClientSuccessEventArgs>;
        onError: EventSet<HttpClient, HttpClientErrorEventArgs>;
        onAbort: EventSet<HttpClient, EventArgs>;
    }
}
declare namespace SampleApps {
    class DrawingRenderApp {
        static start(): void;
        private _canvas;
        private _viewTransform;
        private _drawing;
        private _drawingContext;
        constructor();
        private _dowloadReady;
        private _draw;
    }
}
declare namespace SampleApps {
    class DrawingViewApp {
        static start(): void;
        private _canvas;
        private _viewTransform;
        private _drawing;
        private _drawingContext;
        private _view;
        constructor();
        private _dowloadReady;
    }
}
declare namespace SampleApps {
    class TestBoundsApp {
        static start(): void;
    }
}
declare namespace SampleApps {
    class UIElement {
        private _htmlElement;
        constructor(htmlElement?: UIElement | HTMLElement | string);
        get htmlElement(): HTMLElement;
    }
    class ViewportMenu {
        private readonly ZOOM_FACTOR;
        private _viewport;
        private _htmlElement;
        constructor(viewport: Vgx.Viewport);
        private _initializeUI;
        get htmlElement(): HTMLElement;
        get viewport(): Vgx.Viewport;
    }
    class ViewerApp {
        static start(): void;
        private _menuBar;
        private _mainView;
        private _vectorGraphicsView;
        private _selectDrawing;
        private _selectBackground;
        private _selectViewports;
        private _menuViewports;
        constructor();
        private _initializeUI;
        private _fillSelectInputs;
        private _onWindowResize;
        private _onViewportsLayoutChanged;
        private _addViewportMenu;
        private _loadDrawing;
    }
}
