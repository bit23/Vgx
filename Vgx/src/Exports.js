

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