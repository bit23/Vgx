
namespace Vgx {

    export class MathUtils {

        public static areClose(value1: number, value2: number) {
            if (value1 == value2) {
                return true;
            }
            var n = ((Math.abs(value1) + Math.abs(value2)) + 10.0) * 2.2204460492503131E-16;
            var m = value1 - value2;
            return ((-n < m) && (n > m));
        }

        public static isOne(value: number) {
            return (Math.abs(value - 1.0) < 2.2204460492503131E-15);
        }

        public static isZero(value: number) {
            return (Math.abs(value) < 2.2204460492503131E-15);
        }

        public static interpolatePointWithCubicCurves(points: Cgx.Point[], isClosed: boolean) {
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

        public static getPointsBounds(points: Cgx.Point[]) {
            if (points.length == 0) {
                return Rect.empty;
            }
            if (points.length == 1) {
                return new Rect(points[0].x, points[0].y, 0, 0);
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
            return new Rect(minX, minY, maxX - minX, maxY - minY);
        }
    }
}