declare namespace Cgx {
    type AnimatorValue = number | number[] | {
        [name: string]: number;
    } | Point;
    class Animator {
        private _startValue;
        private _endValue;
        private _totalTime;
        private _ease;
        private _easeFunction;
        private _onValueCallback;
        private _onCompleted;
        private _lastTimeStamp;
        private _elapsedTime;
        private _frameIndex;
        private _isRunning;
        private _isCompleted;
        private _inputIsArray;
        private _inputIsObject;
        private _deltaValue;
        private _isDeltaDirty;
        constructor(startValue: AnimatorValue, endValue: AnimatorValue, totalTime: number, easeFunction: (time: number) => any, onValueCallback: (value: AnimatorValue) => void, onCompleted: () => void);
        private computeDeltaValue;
        get startValue(): AnimatorValue;
        set startValue(v: AnimatorValue);
        get endValue(): AnimatorValue;
        set endValue(v: AnimatorValue);
        get totalTime(): number;
        set totalTime(v: number);
        get ease(): string;
        set ease(v: string);
        get isCompleted(): boolean;
        get elapsedTime(): number;
        get frameIndex(): number;
        provideValue(): number | {
            [name: string]: any;
        };
        notifyFrame(timeStamp: number): void;
        start(): void;
        stop(): void;
        restart(): void;
        reset(): void;
    }
}
declare namespace Cgx {
    type BrushType = "linear" | "radial" | "pattern";
    abstract class Brush {
        abstract readonly brushType: BrushType;
        abstract clone(): Brush;
    }
    abstract class GradientBrush extends Brush {
        protected _colorStops: Array<{
            offset: number;
            color: string;
        }>;
        addColorStop(offset: number, color: string): void;
        getColorStops(): {
            offset: number;
            color: string;
        }[];
    }
    class LinearGradientBrush extends GradientBrush {
        readonly brushType: BrushType;
        x0: number;
        y0: number;
        x1: number;
        y1: number;
        clone(): LinearGradientBrush;
    }
    class RadialGradientBrush extends GradientBrush {
        readonly brushType: BrushType;
        x0: number;
        y0: number;
        r0: number;
        x1: number;
        y1: number;
        r1: number;
        clone(): RadialGradientBrush;
    }
    class PatternBrush extends Brush {
        readonly brushType: BrushType;
        image: HTMLImageElement;
        repetition: string;
        clone(): PatternBrush;
    }
}
declare namespace Cgx {
    type CanvasSurface = HTMLCanvasElement | OffscreenCanvas;
    type GraphicsTarget = CanvasSurface | GraphicsRenderer;
    class CoreGraphics {
        private _canvasBuffer;
        private _renderer;
        private _transformManager;
        private _fill;
        private _stroke;
        private _strokeWidth;
        private _shadow;
        private _textLineHeight;
        private _fontWeight;
        private _fontStyle;
        private _fontSize;
        private _fontFamily;
        private _textAlign;
        private _textBaseline;
        private readonly FULL_ANGLE;
        constructor(target: GraphicsTarget);
        private applyEntityTransform;
        private createCanvasColorOrBrush;
        get canvasBuffer(): CanvasSurface;
        get renderer(): GraphicsRenderer;
        get shadow(): Shadow;
        set shadow(v: Shadow);
        get fillBrush(): BrushDefinition;
        set fillBrush(v: BrushDefinition);
        get strokeBrush(): BrushDefinition;
        set strokeBrush(v: BrushDefinition);
        get strokeWidth(): number;
        set strokeWidth(v: number);
        get fontFamily(): string;
        set fontFamily(v: string);
        get textLineHeight(): string;
        set textLineHeight(v: string);
        get fontSize(): string;
        set fontSize(v: string);
        get fontStyle(): string;
        set fontStyle(v: string);
        get fontWeight(): string;
        set fontWeight(v: string);
        get textAlign(): CanvasTextAlign;
        set textAlign(v: CanvasTextAlign);
        get textBaseline(): CanvasTextBaseline;
        set textBaseline(v: CanvasTextBaseline);
        getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
        putImageData(imageData: ImageData, x: number, y: number): void;
        getDataURL(type?: string, quality?: any): string;
        pushTransform(transform: ITransform): void;
        popTransform(): void;
        measureText(text: string): TextMetrics;
        clear(fillBrush?: BrushDefinition): void;
        clearRect(x: number, y: number, width: number, height: number, fillBrush?: BrushDefinition): void;
        clipRect(x: number, y: number, width: number, height: number): void;
        drawArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, isAntiClockwise: boolean, transform?: Transform): void;
        drawLine(x1: number, y1: number, x2: number, y2: number, transform?: Transform): void;
        drawRoundedRectangle(x: number, y: number, width: number, height: number, cornersRadius: CornersRadiusDefinition, transform?: Transform): void;
        drawSquare(x: number, y: number, size: number, transform?: Transform): void;
        drawRectangle(x: number, y: number, width: number, height: number, transform?: Transform): void;
        drawCircle(cx: number, cy: number, radius: number, transform?: Transform): void;
        drawEllipse(cx: number, cy: number, radiusX: number, radiusY: number, transform?: Transform): void;
        drawPolyline(points: Point[], transform?: Transform): void;
        drawPolygon(points: Point[], transform?: Transform): void;
        drawTriangle(point1: Point, point2: Point, point3: Point, transform?: Transform): void;
        drawQuad(point1: Point, point2: Point, point3: Point, point4: Point, transform?: Transform): void;
        drawCubicCurve(points: Point[], controlPoints1: Point[], controlPoints2: Point[], isClosed: boolean, transform?: Transform): void;
        drawQuadraticCurve(points: Point[], controlPoints: Point[], isClosed: boolean, transform?: Transform): void;
        drawImage(image: CanvasImageSource, x: number, y: number, width: number, height: number, transform?: Transform): void;
        drawText(x: number, y: number, text: string, transform?: Transform): void;
        drawPath2D(x: number, y: number, path2D: Path2D, fillRule?: CanvasFillRule, transform?: Transform): void;
        drawPie(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, isAntiClockwise?: boolean, transform?: Transform): void;
        drawDonut(cx: number, cy: number, startRadius: number, endRadius: number, startAngle: number, endAngle: number, isAntiClockwise?: boolean, transform?: Transform): void;
        drawSymbol(x: number, y: number, width: number, height: number, symbolData: CanvasImageSource): void;
    }
}
declare namespace Cgx {
    class BufferedGraphics extends CoreGraphics {
        constructor(target: GraphicsTarget);
        commitTo(canvas: HTMLCanvasElement): void;
        commitTo(bitmapRenderer: ImageBitmapRenderingContext): void;
        convertToBlob(type?: string, quality?: any): Promise<Blob>;
        convertToObjectURL(type?: string, quality?: any): Promise<string>;
    }
}
declare namespace Cgx {
    interface GraphicsRendererSupport {
        [name: string]: boolean;
    }
    type RendererBrush = string | CanvasGradient | CanvasPattern;
    abstract class GraphicsRenderer {
        static readonly support: GraphicsRendererSupport;
        static readonly defaultValues: {
            readonly globalAlpha: number;
            readonly globalCompositeOperation: string;
            readonly fillStyle: string;
            readonly strokeStyle: string;
            readonly shadowBlur: number;
            readonly shadowColor: string;
            readonly shadowOffsetX: number;
            readonly shadowOffsetY: number;
            readonly lineCap: CanvasLineCap;
            readonly lineJoin: CanvasLineJoin;
            readonly lineWidth: number;
            readonly miterLimit: number;
            readonly lineDashOffset: number;
            readonly textLineHeight: string;
            readonly fontStyle: string;
            readonly fontWeight: string;
            readonly fontSize: string;
            readonly fontFamily: string;
            readonly textAlign: CanvasTextAlign;
            readonly textBaseline: CanvasTextBaseline;
            readonly direction: CanvasDirection;
            readonly imageSmoothingEnabled: boolean;
        };
        constructor(canvas: CanvasSurface);
        abstract readonly name: string;
        readonly canvas: CanvasSurface;
        abstract globalAlpha: number;
        abstract globalCompositeOperation: string;
        abstract fillStyle: RendererBrush;
        abstract strokeStyle: RendererBrush;
        abstract shadowBlur: number;
        abstract shadowColor: string;
        abstract shadowOffsetX: number;
        abstract shadowOffsetY: number;
        abstract createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
        abstract createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
        abstract createPattern(image: CanvasImageSource, repetition: string): CanvasPattern;
        abstract lineCap: CanvasLineCap;
        abstract lineJoin: CanvasLineJoin;
        abstract lineWidth: number;
        abstract miterLimit: number;
        abstract lineDashOffset: number;
        abstract getLineDash(): number[];
        abstract setLineDash(segments: Iterable<number>): void;
        abstract textLineHeight: string;
        abstract fontWeight: string;
        abstract fontStyle: string;
        abstract fontSize: string;
        abstract fontFamily: string;
        abstract textAlign: CanvasTextAlign;
        abstract textBaseline: CanvasTextBaseline;
        abstract direction: CanvasDirection;
        abstract saveState(): void;
        abstract restoreState(): void;
        abstract toDataURL(type?: string, quality?: any): string;
        abstract clearRect(x: number, y: number, width: number, height: number, fillStyle?: RendererBrush): void;
        abstract strokeRect(x: number, y: number, width: number, height: number): void;
        abstract fillRect(x: number, y: number, width: number, height: number): void;
        abstract stroke(): void;
        abstract fill(fillRule?: CanvasFillRule): void;
        abstract strokePath2D(path2D: Path2D): void;
        abstract fillPath2D(path2D: Path2D, fillRule?: CanvasFillRule): void;
        abstract clip(): void;
        abstract rect(x: number, y: number, width: number, height: number): void;
        abstract square(x: number, y: number, size: number): void;
        abstract ellipse(x: number, y: number, rx: number, ry: number, rotation?: number, startAngle?: number, endAngle?: number): void;
        abstract circle(x: number, y: number, r: number): void;
        abstract arc(x: number, y: number, r: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        abstract beginPath(): void;
        abstract closePath(): void;
        abstract arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        abstract moveTo(x: number, y: number): void;
        abstract lineTo(x: number, y: number): void;
        abstract bezierCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void;
        abstract quadraticCurveTo(cx: number, cy: number, x: number, y: number): void;
        abstract isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
        abstract isPointInPath2D(path2D: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
        abstract isPointInStroke(x: number, y: number): boolean;
        abstract isPointInPath2DStroke(path2D: Path2D, x: number, y: number): boolean;
        abstract addHitRegion(options?: any): void;
        abstract removeHitRegion(id: string): void;
        abstract clearHitRegions(): void;
        abstract drawImage(img: CanvasImageSource, dx: number, dy: number, dw?: number, dh?: number, sx?: number, sy?: number, sw?: number, sh?: number): void;
        abstract createImageData(width: number, height: number): ImageData;
        abstract cloneImageData(imageData: ImageData): ImageData;
        abstract getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
        abstract putImageData(imageData: ImageData, x: number, y: number): void;
        abstract imageSmoothingEnabled: boolean;
        abstract fillText(text: string, x: number, y: number, maxWidth?: number): void;
        abstract strokeText(text: string, x: number, y: number, maxWidth?: number): void;
        abstract measureText(text: string): TextMetrics;
        abstract rotate(angle: number): void;
        abstract translate(dx: number, dy: number): void;
        abstract scale(x: number, y: number): void;
        abstract transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
        abstract setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
        abstract resetTransform(): void;
        abstract drawFocusIfNeeded(element: Element): void;
    }
}
declare namespace Cgx {
    interface CanvasRendererSupport extends GraphicsRendererSupport {
        readonly ellipseDrawing: boolean;
        readonly addHitRegion: boolean;
        readonly removeHitRegion: boolean;
        readonly clearHitRegion: boolean;
    }
    class CanvasRenderer extends GraphicsRenderer {
        static readonly support: CanvasRendererSupport;
        private _context;
        private _fontSize;
        private _fontFamily;
        private _textLineHeight;
        private _fontWeight;
        private _fontStyle;
        constructor(canvas: HTMLCanvasElement);
        private setDefaultValues;
        private ellipsePath;
        private buildFontValue;
        readonly name = "CanvasRenderer";
        get globalAlpha(): number;
        set globalAlpha(value: number);
        get globalCompositeOperation(): string;
        set globalCompositeOperation(value: string);
        get fillStyle(): RendererBrush;
        set fillStyle(value: RendererBrush);
        get strokeStyle(): RendererBrush;
        set strokeStyle(value: RendererBrush);
        get shadowBlur(): number;
        set shadowBlur(value: number);
        get shadowColor(): string;
        set shadowColor(value: string);
        get shadowOffsetX(): number;
        set shadowOffsetX(value: number);
        get shadowOffsetY(): number;
        set shadowOffsetY(value: number);
        createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
        createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
        createPattern(image: CanvasImageSource, repetition: string): CanvasPattern;
        get lineCap(): CanvasLineCap;
        set lineCap(value: CanvasLineCap);
        get lineJoin(): CanvasLineJoin;
        set lineJoin(value: CanvasLineJoin);
        get lineWidth(): number;
        set lineWidth(value: number);
        get miterLimit(): number;
        set miterLimit(value: number);
        get lineDashOffset(): number;
        set lineDashOffset(value: number);
        getLineDash(): number[];
        setLineDash(segments: Iterable<number>): void;
        get textLineHeight(): string;
        set textLineHeight(value: string);
        get fontSize(): string;
        set fontSize(value: string);
        get fontStyle(): string;
        set fontStyle(value: string);
        get fontWeight(): string;
        set fontWeight(value: string);
        get fontFamily(): string;
        set fontFamily(value: string);
        get textAlign(): CanvasTextAlign;
        set textAlign(value: CanvasTextAlign);
        get textBaseline(): CanvasTextBaseline;
        set textBaseline(value: CanvasTextBaseline);
        get direction(): CanvasDirection;
        set direction(value: CanvasDirection);
        saveState(): void;
        restoreState(): void;
        toDataURL(type?: string, quality?: any): string;
        clearRect(x: number, y: number, width: number, height: number, fillStyle?: RendererBrush): void;
        strokeRect(x: number, y: number, width: number, height: number): void;
        fillRect(x: number, y: number, width: number, height: number): void;
        stroke(): void;
        fill(fillRule?: CanvasFillRule): void;
        strokePath2D(path2D: Path2D): void;
        fillPath2D(path2D: Path2D, fillRule?: CanvasFillRule): void;
        clip(): void;
        rect(x: number, y: number, width: number, height: number): void;
        square(x: number, y: number, size: number): void;
        ellipse(x: number, y: number, rx: number, ry: number, rotation?: number, startAngle?: number, endAngle?: number): void;
        circle(x: number, y: number, r: number): void;
        arc(x: number, y: number, r: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        beginPath(): void;
        closePath(): void;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        bezierCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void;
        quadraticCurveTo(cx: number, cy: number, x: number, y: number): void;
        isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
        isPointInPath2D(path2D: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
        isPointInStroke(x: number, y: number): boolean;
        isPointInPath2DStroke(path2D: Path2D, x: number, y: number): boolean;
        addHitRegion(options?: any): void;
        removeHitRegion(id: string): void;
        clearHitRegions(): void;
        drawImage(img: CanvasImageSource, x: number, y: number, width?: number, height?: number, sx?: number, sy?: number, sw?: number, sh?: number): void;
        createImageData(width: number, height: number): ImageData;
        cloneImageData(imageData: ImageData): ImageData;
        getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
        putImageData(imageData: ImageData, x: number, y: number): void;
        get imageSmoothingEnabled(): boolean;
        set imageSmoothingEnabled(v: boolean);
        fillText(text: string, x: number, y: number, maxWidth?: number): void;
        strokeText(text: string, x: number, y: number, maxWidth?: number): void;
        measureText(text: string): TextMetrics;
        rotate(angle: number): void;
        translate(dx: number, dy: number): void;
        scale(x: number, y: number): void;
        transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
        setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
        resetTransform(): void;
        drawFocusIfNeeded(element: Element): void;
    }
}
declare namespace Cgx {
    interface Point {
        x: number;
        y: number;
    }
    interface Size {
        width: number;
        height: number;
    }
    type BrushDefinition = number | string | number[] | GradientBrush | PatternBrush;
    type CornersRadiusObject = {
        topLeft: number;
        topRight: number;
        bottomLeft: number;
        bottomRight: number;
    };
    type CornersRadiusDefinition = number | number[] | CornersRadiusObject;
    interface Shadow {
        blur: number;
        offsetX: number;
        offsetY: number;
        color: string;
    }
}
declare namespace Cgx {
    type EaseFunc = (t: number) => number;
    class Ease {
        private static readonly easeFunctions;
        static getEaseFunctionNames(): ReadonlyArray<string>;
        static getEasingFunctionOrDefault(easing: string): any;
        static linear(t: number): number;
        static quadraticIn(t: number): number;
        static quadraticOut(t: number): number;
        static quadraticInOut(t: number): number;
        static cubicIn(t: number): number;
        static cubicOut(t: number): number;
        static cubicInOut(t: number): number;
        static quarticIn(t: number): number;
        static quarticOut(t: number): number;
        static quarticInOut(t: number): number;
        static quinticIn(t: number): number;
        static quinticOut(t: number): number;
        static quinticInOut(t: number): number;
        static sineIn(t: number): number;
        static sineOut(t: number): number;
        static sineInOut(t: number): number;
        static expoIn(t: number): number;
        static expoOut(t: number): number;
        static expoInOut(t: number): number;
        static bounceIn(t: number): number;
        static bounceOut(t: number): number;
        static bounceInOut(t: number): number;
        static backIn(t: number): number;
        static backOut(t: number): number;
        static backInOut(t: number): number;
        static elasticIn(t: number): number;
        static elasticOut(t: number): number;
        static elasticInOut(t: number): number;
        static circularIn(t: number): number;
        static circularOut(t: number): number;
        static circularInOut(t: number): number;
    }
}
declare namespace Cgx {
    interface EngineSupport {
        readonly imageBitmapRenderingContext: boolean;
        readonly offscreenCanvas: boolean;
        readonly offscreenCanvasTransferToImageBitmap: boolean;
        readonly bufferedGraphics: boolean;
    }
    interface EngineSettings {
        defaultRenderer: string;
        vars: {
            [name: string]: any;
        };
    }
    class Engine {
        static readonly support: EngineSupport;
        private static _renderers;
        private static _defaultRendererName;
        private static _defaultRendererType;
        private static _vars;
        private static createOffscreenCanvas;
        private static createRenderer;
        private static getRendererType;
        static createCanvas(width?: number, height?: number): HTMLCanvasElement;
        static get defaultRenderer(): string;
        static set defaultRenderer(v: string);
        static get vars(): {
            [name: string]: any;
        };
        static registerRenderer(name: string, rendererBuilder: new (canvas: HTMLCanvasElement) => GraphicsRenderer): void;
        static loadSettings(settings: EngineSettings): void;
        static createDefaultRenderer(canvasSurface: CanvasSurface): GraphicsRenderer;
        static createGraphicsFromCanvasSurface(canvasSurface: CanvasSurface, rendererTypeName?: string): CoreGraphics;
        static createGraphics(width: number, height: number, rendererTypeName?: string): CoreGraphics;
        static createOffscreenGraphics(width: number, height: number, rendererTypeName?: string): CoreGraphics;
        static createBufferedGraphics(width: number, height: number, rendererTypeName?: string): BufferedGraphics;
    }
}
declare namespace Cgx {
    class FpsCounter {
        private _fps;
        private _isRunning;
        private _lastTimestamp;
        private _accumulatedFrames;
        private _accumulatedTime;
        sampleInterval: number;
        get fps(): number;
        notifyFrame(timestamp: number): void;
        start(): void;
        stop(): void;
    }
}
declare namespace Cgx {
    interface Geometry {
    }
    interface ArcGeometry extends Geometry {
        centerPoint: Point;
        radius: number;
        startAngle: number;
        endAngle: number;
        isAntiClockwise: boolean;
    }
    interface LineGeometry extends Geometry {
        startPoint: Point;
        endPoint: Point;
    }
    interface RectangleGeometry extends Geometry {
        origin: Point;
        width: number;
        height: number;
        cornerRadius: CornersRadiusDefinition;
    }
    interface EllipseGeometry extends Geometry {
        centerPoint: Point;
        radiusX: number;
        radiusY: number;
    }
    interface PolygonalGeometry extends Geometry {
        points: Point[];
        isClosed: boolean;
    }
    interface QuadraticCurveGeometry extends PolygonalGeometry {
        controlPoints: Point[];
    }
    interface CubicCurveGeometry extends PolygonalGeometry {
        controlPoints1: Point[];
        controlPoints2: Point[];
    }
    interface ImageGeometry extends RectangleGeometry {
        image: CanvasImageSource;
    }
    interface TextGeometry extends Geometry {
        text: string;
        origin: Point;
    }
    interface PathGeometry extends Geometry {
        path: Path2D;
        origin: Point;
        fillRule?: CanvasFillRule;
    }
    interface DonutGeometry extends Geometry {
        centerPoint: Point;
        startRadius: number;
        endRadius: number;
        startAngle: number;
        endAngle: number;
        isAntiClockwise?: boolean;
    }
}
declare namespace Cgx {
    class Matrix {
        static readonly indentity: Matrix;
        private static createRotationRadians;
        private static multiplyRefMatrix;
        static invert(matrix: Matrix): Matrix;
        static multiplyMatrix(matrix1: Matrix, matrix2: Matrix): Matrix;
        static multiplyValue(matrix: Matrix, value: number): Matrix;
        constructor(m11?: number, m12?: number, m21?: number, m22?: number, offsetX?: number, offsetY?: number);
        private isZero;
        private multiplyPoint;
        private getDeterminant;
        m11: number;
        m12: number;
        m21: number;
        m22: number;
        offsetX: number;
        offsetY: number;
        clone(): Matrix;
        hasInverse(): boolean;
        isIdentity(): boolean;
        reset(): void;
        rotate(angle: number): void;
        rotateAt(angle: number, centerX: number, centerY: number): void;
        scale(scaleX: number, scaleY: number): void;
        scaleAt(scaleX: number, scaleY: number, centerX: number, centerY: number): void;
        skew(skewX: number, skewY: number): void;
        transformPoint(x: number, y: number): Point;
        transformRect(x: number, y: number, width: number, height: number): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        translate(offsetX: number, offsetY: number): void;
    }
}
declare namespace Cgx {
    interface LoopArgs {
        instance: RenderLoop;
        data: any;
        deltaTime: number;
    }
    type LoopCallback = (args: LoopArgs) => void;
    class RenderLoop {
        private _loopCallback;
        private _maxFps;
        private _isRunning;
        private _loopArgs;
        private _lastLoopTime;
        private _renderTimeAccumulator;
        private _renderTimeInterval;
        private _lastRenderDeltaTime;
        private _fpsCounter;
        private _animators;
        private _animatorsToRemove;
        constructor(loopCallback: LoopCallback);
        private onRenderFrame;
        private onAnimatorFrame;
        private computeTimeInterval;
        get currentFps(): number;
        get maxFps(): number;
        set maxFps(v: number);
        get data(): number;
        set data(v: number);
        get isRunning(): boolean;
        start(): void;
        stop(): void;
        animate(startValue: AnimatorValue, endValue: AnimatorValue, totalTime: number, easing: string, onValueCallback: (value: AnimatorValue) => void, onCompleted: () => void): void;
        createAnimator(startValue: AnimatorValue, endValue: AnimatorValue, totalTime: number, easing: string, onValueCallback: (value: AnimatorValue) => void, onCompleted: () => void): Animator;
        addAnimator(animator: Animator, autoRemoveOnCompleted: boolean): number;
        removeAnimator(animator: Animator): boolean;
    }
}
declare namespace Cgx {
    namespace Shapes {
        interface StrokeShape {
            strokeBrush: BrushDefinition;
            strokeWidth: number;
        }
        interface FillShape {
            fillBrush: BrushDefinition;
        }
        export abstract class Shape {
            shadow?: Shadow;
            transform?: Transform;
            protected abstract onRender(gfx: CoreGraphics): void;
            render(gfx: CoreGraphics): void;
        }
        export class Arc extends Shape implements StrokeShape {
            static fromGeometry(geometry: ArcGeometry, strokeBrush?: BrushDefinition, strokeWidth?: number): Arc;
            strokeBrush: BrushDefinition;
            strokeWidth: number;
            centerPoint: Point;
            radius: number;
            startAngle: number;
            endAngle: number;
            isAntiClockwise: boolean;
            protected onRender(gfx: CoreGraphics): void;
        }
        export class Line extends Shape implements StrokeShape {
            static fromGeometry(geometry: LineGeometry, strokeBrush?: BrushDefinition, strokeWidth?: number): Line;
            strokeBrush: BrushDefinition;
            strokeWidth: number;
            startPoint: Point;
            endPoint: Point;
            protected onRender(gfx: CoreGraphics): void;
        }
        export class Rectangle extends Shape implements StrokeShape, FillShape {
            static fromGeometry(geometry: RectangleGeometry, strokeBrush?: BrushDefinition, strokeWidth?: number, fillBrush?: BrushDefinition): Rectangle;
            fillBrush: BrushDefinition;
            strokeBrush: BrushDefinition;
            strokeWidth: number;
            origin: Point;
            width: number;
            height: number;
            cornerRadius: CornersRadiusDefinition;
            protected onRender(gfx: CoreGraphics): void;
        }
        export class Ellipse extends Shape implements StrokeShape, FillShape {
            static fromGeometry(geometry: EllipseGeometry, strokeBrush?: BrushDefinition, strokeWidth?: number, fillBrush?: BrushDefinition): Ellipse;
            fillBrush: BrushDefinition;
            strokeBrush: BrushDefinition;
            strokeWidth: number;
            centerPoint: Point;
            radiusX: number;
            radiusY: number;
            protected onRender(gfx: CoreGraphics): void;
        }
        export class Polygonal extends Shape implements StrokeShape, FillShape {
            static fromGeometry(geometry: PolygonalGeometry, strokeBrush?: BrushDefinition, strokeWidth?: number, fillBrush?: BrushDefinition): Polygonal;
            fillBrush: BrushDefinition;
            strokeBrush: BrushDefinition;
            strokeWidth: number;
            points: Point[];
            isClosed: boolean;
            protected onRender(gfx: CoreGraphics): void;
        }
        export class QuadraticCurve extends Shape implements StrokeShape, FillShape {
            static fromGeometry(geometry: QuadraticCurveGeometry, strokeBrush?: BrushDefinition, strokeWidth?: number, fillBrush?: BrushDefinition): QuadraticCurve;
            fillBrush: BrushDefinition;
            strokeBrush: BrushDefinition;
            strokeWidth: number;
            points: Point[];
            controlPoints: Point[];
            isClosed: boolean;
            protected onRender(gfx: CoreGraphics): void;
        }
        export class CubicCurve extends Shape implements StrokeShape, FillShape {
            static fromGeometry(geometry: CubicCurveGeometry, strokeBrush?: BrushDefinition, strokeWidth?: number, fillBrush?: BrushDefinition): CubicCurve;
            fillBrush: BrushDefinition;
            strokeBrush: BrushDefinition;
            strokeWidth: number;
            points: Point[];
            controlPoints1: Point[];
            controlPoints2: Point[];
            isClosed: boolean;
            protected onRender(gfx: CoreGraphics): void;
        }
        export class Image extends Shape implements StrokeShape {
            static fromGeometry(geometry: ImageGeometry, strokeBrush?: BrushDefinition, strokeWidth?: number): Image;
            fillBrush: BrushDefinition;
            strokeBrush: BrushDefinition;
            strokeWidth: number;
            image: CanvasImageSource;
            origin: Point;
            width: number;
            height: number;
            protected onRender(gfx: CoreGraphics): void;
        }
        export class Text extends Shape implements StrokeShape, FillShape {
            static fromGeometry(geometry: TextGeometry, strokeBrush?: BrushDefinition, strokeWidth?: number, fillBrush?: BrushDefinition): Text;
            fillBrush: BrushDefinition;
            strokeBrush: BrushDefinition;
            strokeWidth: number;
            text: string;
            origin: Point;
            protected onRender(gfx: CoreGraphics): void;
        }
        export class Path extends Shape implements StrokeShape, FillShape {
            static fromGeometry(geometry: PathGeometry, strokeBrush?: BrushDefinition, strokeWidth?: number, fillBrush?: BrushDefinition): Path;
            fillBrush: BrushDefinition;
            strokeBrush: BrushDefinition;
            strokeWidth: number;
            path: Path2D;
            origin: Point;
            fillRule?: CanvasFillRule;
            protected onRender(gfx: CoreGraphics): void;
        }
        export class Pie extends Shape implements StrokeShape, FillShape {
            static fromGeometry(geometry: ArcGeometry, strokeBrush?: BrushDefinition, strokeWidth?: number, fillBrush?: BrushDefinition): Pie;
            fillBrush: BrushDefinition;
            strokeBrush: BrushDefinition;
            strokeWidth: number;
            centerPoint: Point;
            radius: number;
            startAngle: number;
            endAngle: number;
            isAntiClockwise: boolean;
            protected onRender(gfx: CoreGraphics): void;
        }
        export class Donut extends Shape implements StrokeShape, FillShape {
            static fromGeometry(geometry: DonutGeometry, strokeBrush?: BrushDefinition, strokeWidth?: number, fillBrush?: BrushDefinition): Donut;
            fillBrush: BrushDefinition;
            strokeBrush: BrushDefinition;
            strokeWidth: number;
            centerPoint: Point;
            startRadius: number;
            endRadius: number;
            startAngle: number;
            endAngle: number;
            isAntiClockwise?: boolean;
            protected onRender(gfx: CoreGraphics): void;
        }
        export {};
    }
}
declare namespace Cgx {
    class Transform implements ITransform {
        private _matrix;
        private _isDirty;
        private _originX;
        private _originY;
        private _translationX;
        private _translationY;
        private _scaleX;
        private _scaleY;
        private _rotation;
        protected _propertyChanged: (propertyName: string) => void;
        clone(): Transform;
        get originX(): number;
        set originX(v: number);
        get originY(): number;
        set originY(v: number);
        get translationX(): number;
        set translationX(v: number);
        get translationY(): number;
        set translationY(v: number);
        get scaleX(): number;
        set scaleX(v: number);
        get scaleY(): number;
        set scaleY(v: number);
        get rotation(): number;
        set rotation(v: number);
        get isIdentity(): boolean;
        getMatrix(): Matrix;
        reset(): void;
        setDirty(): void;
        transformPoint(x: number, y: number): Point;
        transformRect(x: number, y: number, width: number, height: number): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    }
}
declare namespace Cgx {
    interface ITransform {
        getMatrix(): Matrix;
    }
    class TransformManager {
        private _transforms;
        private _renderer;
        constructor(renderer: GraphicsRenderer);
        push(transform: ITransform): void;
        pop(): number;
        get length(): number;
    }
}
declare namespace Cgx {
    function createPoint(x?: number, y?: number): {
        x: number;
        y: number;
    };
}
declare namespace Cgx {
    interface WebGLRendererSupport extends GraphicsRendererSupport {
    }
    class WebGLRenderer extends GraphicsRenderer {
        static readonly support: WebGLRendererSupport;
        private _context;
        constructor(canvas: HTMLCanvasElement);
        private setDefaultValues;
        readonly name = "WebGLRenderer";
        globalAlpha: number;
        globalCompositeOperation: string;
        fillStyle: RendererBrush;
        strokeStyle: RendererBrush;
        shadowBlur: number;
        shadowColor: string;
        shadowOffsetX: number;
        shadowOffsetY: number;
        createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
        createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
        createPattern(image: CanvasImageSource, repetition: string): CanvasPattern;
        lineCap: CanvasLineCap;
        lineJoin: CanvasLineJoin;
        lineWidth: number;
        miterLimit: number;
        lineDashOffset: number;
        getLineDash(): number[];
        setLineDash(segments: Iterable<number>): void;
        textLineHeight: string;
        fontStyle: string;
        fontWeight: string;
        fontSize: string;
        fontFamily: string;
        textAlign: CanvasTextAlign;
        textBaseline: CanvasTextBaseline;
        direction: CanvasDirection;
        saveState(): void;
        restoreState(): void;
        toDataURL(type?: string, quality?: any): string;
        clearRect(x: number, y: number, width: number, height: number, fillStyle?: RendererBrush): void;
        strokeRect(x: number, y: number, width: number, height: number): void;
        fillRect(x: number, y: number, width: number, height: number): void;
        stroke(): void;
        fill(fillRule?: CanvasFillRule): void;
        strokePath2D(path2D: Path2D): void;
        fillPath2D(path2D: Path2D, fillRule?: CanvasFillRule): void;
        clip(): void;
        rect(x: number, y: number, width: number, height: number): void;
        square(x: number, y: number, size: number): void;
        ellipse(x: number, y: number, rx: number, ry: number, rotation?: number, startAngle?: number, endAngle?: number): void;
        circle(x: number, y: number, r: number): void;
        arc(x: number, y: number, r: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        beginPath(): void;
        closePath(): void;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        bezierCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void;
        quadraticCurveTo(cx: number, cy: number, x: number, y: number): void;
        isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
        isPointInPath2D(path2D: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
        isPointInStroke(x: number, y: number): boolean;
        isPointInPath2DStroke(path2D: Path2D, x: number, y: number): boolean;
        addHitRegion(options?: any): void;
        removeHitRegion(id: string): void;
        clearHitRegions(): void;
        drawImage(img: CanvasImageSource, dx: number, dy: number, dw?: number, dh?: number, sx?: number, sy?: number, sw?: number, sh?: number): void;
        createImageData(width: number, height: number): ImageData;
        cloneImageData(imageData: ImageData): ImageData;
        getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
        putImageData(imageData: ImageData, x: number, y: number): void;
        imageSmoothingEnabled: boolean;
        fillText(text: string, x: number, y: number, maxWidth?: number): void;
        strokeText(text: string, x: number, y: number, maxWidth?: number): void;
        measureText(text: string): TextMetrics;
        rotate(angle: number): void;
        translate(dx: number, dy: number): void;
        scale(x: number, y: number): void;
        transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
        setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
        resetTransform(): void;
        drawFocusIfNeeded(element: Element): void;
    }
}
