

for (var i = 0; i < 60; i++) {

    var line = new Vgx.Line();
    line.stroke = (i % 5) == 0 ? "#666" : "#222";
    line.strokeWidth = 1;
    line.insertPointX = 90;
    line.insertPointY = 0;
    line.endPoint = { x: 335, y: 0 };
    line.transform.originX = -90;
    line.transform.originY = 0;
    line.transform.rotation = i * 6;
    drawing.addChild(line);
}


var circleCenter = new Vgx.Circle();
circleCenter.fill = "gray";
circleCenter.stroke = null;
circleCenter.strokeWidth = 0;
circleCenter.insertPointX = 0;
circleCenter.insertPointY = 0;
circleCenter.radius = 100;
drawing.addChild(circleCenter);

var donutHours = new Vgx.Donut();
donutHours.fill = "red";
donutHours.stroke = null;
donutHours.strokeWidth = 0;
donutHours.insertPointX = 0;
donutHours.insertPointY = 0;
donutHours.startAngle = -90;
donutHours.endAngle = -90;
donutHours.startRadius = 105;
donutHours.endRadius = 205;
drawing.addChild(donutHours);

var donutMinutes = new Vgx.Donut();
donutMinutes.fill = "green";
donutMinutes.stroke = null;
donutMinutes.strokeWidth = 0;
donutMinutes.insertPointX = 0;
donutMinutes.insertPointY = 0;
donutMinutes.startAngle = -90;
donutMinutes.endAngle = -90;
donutMinutes.startRadius = 210;
donutMinutes.endRadius = 285;
drawing.addChild(donutMinutes);

var donutSeconds = new Vgx.Donut();
donutSeconds.fill = "blue";
donutSeconds.stroke = null;
donutSeconds.strokeWidth = 0;
donutSeconds.insertPointX = 0;
donutSeconds.insertPointY = 0;
donutSeconds.startAngle = -90;
donutSeconds.endAngle = -90;
donutSeconds.startRadius = 290;
donutSeconds.endRadius = 320;
drawing.addChild(donutSeconds);

var donutBorder = new Vgx.Donut();
donutBorder.fill = "gray";
donutBorder.stroke = null;
donutBorder.strokeWidth = 0;
donutBorder.insertPointX = 0;
donutBorder.insertPointY = 0;
donutBorder.startAngle = 0;
donutBorder.endAngle = 360;
donutBorder.startRadius = 325;
donutBorder.endRadius = 340;
drawing.addChild(donutBorder);






var txtDay = new Vgx.Text();
txtDay.insertPointX = 0;
txtDay.insertPointY = -30;
txtDay.fill = "#ccc";
txtDay.fontFamily = "Open Sans";
txtDay.fontSize = 30;
txtDay.textBaseline = "middle";
drawing.addChild(txtDay);

var txtMonth = new Vgx.Text();
txtMonth.insertPointX = 0;
txtMonth.insertPointY = 0;
txtMonth.fill = "#ccc";
txtMonth.fontFamily = "Open Sans";
txtMonth.fontSize = 30;
txtMonth.textBaseline = "middle";
drawing.addChild(txtMonth);

var txtYear = new Vgx.Text();
txtYear.insertPointX = 0;
txtYear.insertPointY = 30;
txtYear.fill = "#ccc";
txtYear.fontFamily = "Open Sans";
txtYear.fontSize = 30;
txtYear.textBaseline = "middle";
drawing.addChild(txtYear);


function update() {

    var now = new Date(Date.now());

    //donutSeconds.endAngle = (now.getSeconds() * 6) - 90;
    donutSeconds.endAngle = ((now.getSeconds() + (now.getMilliseconds() / 1000)) * 6) - 90;
    //donutMinutes.endAngle = (now.getMinutes() * 6) - 90;
    donutMinutes.endAngle = ((now.getMinutes() + (now.getSeconds() / 60)) * 6) - 90;
    donutHours.endAngle = ((((now.getHours() % 12) + (now.getMinutes() / 60)) * 5) * 6) - 90;

    txtYear.text = now.getFullYear().toString();
    txtMonth.text = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][now.getMonth()];
    txtDay.text = now.getDate().toString();

    txtDay.insertPointX = -txtDay.getBounds().width * 0.5;
    txtMonth.insertPointX = -txtMonth.getBounds().width * 0.5;
    txtYear.insertPointX = -txtYear.getBounds().width * 0.5;
}

setInterval(
    update,
    10
);

update();