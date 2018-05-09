
(function (window, undefined) {

    window.addEventListener("DOMContentLoaded", () => {

        var vectorGraphicsView = new Vgx.VectorGraphicsView();
        vectorGraphicsView.viewportsLayout = Vgx.ViewportsLayout.ONE;
        vectorGraphicsView.currentViewport.scaleStyles = true;
        vectorGraphicsView.currentViewport.drawAxes = true;
        window.document.body.appendChild(vectorGraphicsView.htmlElement);

        var drawing = new Vgx.Drawing();

        var rectangle = new Vgx.Rectangle();
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

        var rectangle2 = new Vgx.Rectangle();
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
    });

})(this || window);