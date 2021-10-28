

for (var i = 0; i < 12; i++) {

    var line = new Vgx.VgxLine();
    line.stroke = "white";
    line.strokeWidth = 12;
    line.insertPointX = 450;
    line.insertPointY = 0;
    line.endPoint = { x: 500, y: 0 };
    line.transform.originX = -450;
    line.transform.originY = 0;
    line.transform.rotation = i * 30;
    drawing.addChild(line);
}



var now = new Date(Date.now());

var lineSeconds = new Vgx.VgxLine();
lineSeconds.stroke = "blue";
lineSeconds.strokeWidth = 6;
lineSeconds.insertPointX = 0;
lineSeconds.insertPointY = 0;
lineSeconds.endPoint = { x: 360, y: 0 };
lineSeconds.transform.originX = 0;
lineSeconds.transform.originY = 0;
drawing.addChild(lineSeconds);

var lineMinutes = new Vgx.VgxLine();
lineMinutes.stroke = "green";
lineMinutes.strokeWidth = 12;
lineMinutes.insertPointX = 0;
lineMinutes.insertPointY = 0;
lineMinutes.endPoint = { x: 350, y: 0 };
lineMinutes.transform.originX = 0;
lineMinutes.transform.originY = 0;
drawing.addChild(lineMinutes);

var lineHours = new Vgx.VgxLine();
lineHours.stroke = "red";
lineHours.strokeWidth = 20;
lineHours.insertPointX = 0;
lineHours.insertPointY = 0;
lineHours.endPoint = { x: 250, y: 0 };
lineHours.transform.originX = 0;
lineHours.transform.originY = 0;
drawing.addChild(lineHours);



var txtDay = new Vgx.VgxText();
txtDay.insertPointX = 100;
txtDay.fill = "cyan";
txtDay.fontFamily = "Open Sans";
txtDay.fontSize = 40;
txtDay.baseline = "middle";

var txtMonth = new Vgx.VgxText();
txtMonth.fill = "magenta";
txtMonth.fontFamily = "Open Sans";
txtMonth.fontSize = 40;
txtMonth.baseline = "middle";

var txtYear = new Vgx.VgxText();
txtYear.fill = "orange";
txtYear.fontFamily = "Open Sans";
txtYear.fontSize = 40;
txtYear.baseline = "middle";

drawing.addChild(txtDay);
drawing.addChild(txtMonth);
drawing.addChild(txtYear);


function updateTransforms() {

    now = new Date(Date.now());

    lineSeconds.transform.rotation = (now.getSeconds() * 6) - 90;
    lineMinutes.transform.rotation = (now.getMinutes() * 6) - 90;
    lineHours.transform.rotation = ((((now.getHours() % 12) + (now.getMinutes() / 60)) * 5) * 6) - 90;

    txtYear.source = now.getFullYear().toString();
    txtMonth.source = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][now.getMonth()];
    txtDay.source = now.getDate().toString();

    txtMonth.insertPointX = txtDay.insertPointX + 20 + txtDay.getBounds().width;
    txtYear.insertPointX = txtMonth.insertPointX + 20 + txtMonth.getBounds().width;
}

setInterval(
    updateTransforms,
    1000
);

updateTransforms();