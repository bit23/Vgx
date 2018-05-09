
(function (window, undefined) {

    var _canvas;
    var _viewTransform
    var _drawing;
    var _drawingContext;

    window.addEventListener("DOMContentLoaded", () => {

        _canvas = window.document.querySelector("#renderCanvas");
        //_canvas.width = (29.7 / 2.54) * 96;
        //_canvas.height = (21 / 2.54) * 96;

        _viewTransform = new Vgx.ViewTransform();

        Vgx.HttpClient.downloadString("../../drawings/house.json", (s, e) => {
            _drawing = Vgx.Drawing.fromJSON(e.result);
            _drawingContext = new Vgx.DrawingContext(_drawing, _canvas, _viewTransform);

            draw();
        });
    });


    function draw() {

        //_viewTransform.translate(400, 300);

        if (_drawing.background) {
            _drawingContext.clear(_drawing.background);
        } else {
            _drawingContext.clear();
        }

        var children = _drawing.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child) {
                if (child.visible) {
                    child.draw(_drawingContext);
                }
            }
        }
    }

})(this || window);