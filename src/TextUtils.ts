
namespace Vgx {

    export class TextUtils {

        private static _initialized = false;
        private static _canvasBuffer: HTMLCanvasElement;
        private static _context: CanvasRenderingContext2D;

        private static initialize() {
            this._canvasBuffer = Cgx.Engine.createCanvas(1, 1);
            this._context = this._canvasBuffer.getContext("2d");
            this._initialized = true;
        }

        private static ensureInitialized() {
            if (!this._initialized) {
                this.initialize();
            }
        }

        private static estimateFontHeight(fastHeightEstimation: boolean) {

            if (fastHeightEstimation) {
                return this.measureTextWidth("M");
            }
            else {
                throw new Error("not implemented");
            }
        }

        private static measureTextWidth(text: string) {
            return this._context.measureText(text).width;
        }


        public static measureText(text: string, fontFamily: string, fontSize: number, fastHeightEstimation: boolean = true) {
            this.ensureInitialized();
            this._context.font = fontSize + "px " + fontFamily;
            return new Rect(
                0, 0,
                this.measureTextWidth(text),
                this.estimateFontHeight(fastHeightEstimation)
            );
        }

        public static getTextMetrics(text: string, fontFamily: string, fontSize: number) {
            this.ensureInitialized();
            this._context.font = fontSize + "px " + fontFamily;
            return this._context.measureText(text);
        }
    }
}