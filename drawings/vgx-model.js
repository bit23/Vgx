
var sampleImageResource = "data:image/jpeg;base64,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";

var pointDefinition = {
    id: "point1",
    figures: [
        {
            type: "path",
            data: "M 0.5,0.0 L 0.5,1.0 M 0.0,0.5 L 1.0,0.5"
        }
    ]
};

var dataSet = [
    {
        name: "VgxLine", baseType: "VgxEntity", members: ["startPoint", "endPoint"], properties: {
            startPoint: {
                "x": 20,
                "y": 190
            },
            endPoint: {
                "x": 220,
                "y": 60
            },
            stroke: "#3995fd",
            strokeWidth: 3
        }
    },
    {
        name: "VgxPolyline", baseType: "VgxEntity", members: ["points"], properties: {
            "points": [
                {
                    "x": 20,
                    "y": 190
                },
                {
                    "x": 180,
                    "y": 60
                },
                {
                    "x": 220,
                    "y": 140
                },
                {
                    "x": 120,
                    "y": 180
                }
            ],
            stroke: "#3995fd",
            strokeWidth: 3
        }
    },
    {
        name: "VgxArc", baseType: "VgxEntity", members: ["endAngle", "isAntiClockwise", "radius", "startAngle"], properties: {
            insertPointX: 100,
            insertPointY: 150,
            radius: 80,
            startAngle: -115,
            endAngle: 20,
            isAntiClockwise: false,
            stroke: "#3995fd",
            strokeWidth: 3
        }
    },
    {
        name: "VgxRectangle", baseType: "VgxEntity", members: ["width", "height"], properties: {
            insertPointX: 50,
            insertPointY: 75,
            width: 150,
            height: 95,
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff"
        }
    },
    {
        name: "VgxSquare", baseType: "VgxEntity", members: ["size"], properties: {
            insertPointX: 70,
            insertPointY: 75,
            size: 100,
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff"
        }
    },
    {
        name: "VgxCircle", baseType: "VgxEntity", members: ["radius"], properties: {
            insertPointX: 120,
            insertPointY: 125,
            radius: 55,
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff"
        }
    },
    {
        name: "VgxEllipse", baseType: "VgxEntity", members: ["xRadius", "yRadius"], properties: {
            insertPointX: 120,
            insertPointY: 125,
            xRadius: 75,
            yRadius: 50,
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff"
        }
    },
    {
        name: "VgxTriangle", baseType: "VgxEntity", members: ["point1", "point2", "point3"], properties: {
            point1: {
                "x": 30,
                "y": 155
            },
            point2: {
                "x": 180,
                "y": 70
            },
            point3: {
                "x": 210,
                "y": 170
            },
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff"
        }
    },
    {
        name: "VgxQuad", baseType: "VgxEntity", members: ["point1", "point2", "point3", "point4"], properties: {
            point1: {
                "x": 40,
                "y": 115
            },
            point2: {
                "x": 180,
                "y": 70
            },
            point3: {
                "x": 210,
                "y": 140
            },
            point4: {
                "x": 140,
                "y": 170
            },
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff"
        }
    },
    {
        name: "VgxPolygon", baseType: "VgxEntity", members: ["points"], properties: {
            "points": [
                {
                    "x": 20,
                    "y": 100
                },
                {
                    "x": 140,
                    "y": 130
                },
                {
                    "x": 180,
                    "y": 60
                },
                {
                    "x": 220,
                    "y": 140
                },
                {
                    "x": 120,
                    "y": 180
                }
            ],
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff"
        }
    },
    {
        name: "VgxQuadraticCurve", baseType: "VgxEntity", members: ["points", "controlPoints", "isClosed"], properties: {
            "controlPoints": [
                {
                    "x": 161,
                    "y": 63
                },
                {
                    "x": 190,
                    "y": 120
                },
                {
                    "x": 187,
                    "y": 171
                },
                {
                    "x": 112,
                    "y": 175
                },
                {
                    "x": 70,
                    "y": 195
                },
                {
                    "x": 50,
                    "y": 141
                },
                {
                    "x": 49,
                    "y": 55
                }
            ],
            "points": [
                {
                    "x": 131,
                    "y": 61
                },
                {
                    "x": 177,
                    "y": 95
                },
                {
                    "x": 189,
                    "y": 147
                },
                {
                    "x": 150,
                    "y": 173
                },
                {
                    "x": 92,
                    "y": 183
                },
                {
                    "x": 59,
                    "y": 168
                },
                {
                    "x": 49,
                    "y": 113
                }
            ],
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff"
        }
    },
    {
        name: "VgxCubicCurve", baseType: "VgxEntity", members: ["points", "controlPoints1", "controlPoints2", "isClosed"], properties: {
            "points": [
                {
                    "x": 36,
                    "y": 116
                },
                {
                    "x": 96,
                    "y": 109
                },
                {
                    "x": 150,
                    "y": 113
                },
                {
                    "x": 203,
                    "y": 115
                }
            ],
            "controlPoints1": [
                {
                    "x": 50,
                    "y": 72
                },
                {
                    "x": 67,
                    "y": 150
                },
                {
                    "x": 165,
                    "y": 67
                },
                {
                    "x": 151,
                    "y": 189
                }
            ],
            "controlPoints2": [
                {
                    "x": 119,
                    "y": 77
                },
                {
                    "x": 136,
                    "y": 155
                },
                {
                    "x": 233,
                    "y": 73
                },
                {
                    "x": 12,
                    "y": 187
                }
            ],
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff"
        }
    },
    {
        name: "VgxPie", baseType: "VgxEntity", 
		members: ["endAngle", "isAntiClockwise", "radius", "startAngle"], 
		properties: {
            insertPointX: 100,
            insertPointY: 150,
            radius: 80,
            startAngle: -100,
            endAngle: 0,
            isAntiClockwise: false,
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff"
        }
    },
    {
        name: "VgxDonut", baseType: "VgxEntity", members: ["endAngle", "endRadius", "isAntiClockwise", "startAngle", "startRadius"], properties: {
            insertPointX: 120,
            insertPointY: 130,
            startRadius: 30,
            endRadius: 60,
            startAngle: -115,
            endAngle: 205,
            isAntiClockwise: false,
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff"
        }
    },
    {
        name: "VgxPath", baseType: "VgxEntity", members: ["figures", "fillRule"], properties: {
            insertPointX: 0,
            insertPointY: 0,
            figures: [
                { type: "rect", insertPointX: 21, insertPointY: 105, width: 35, height: 35 },
                { type: "rect", insertPointX: 63, insertPointY: 105, width: 35, height: 35 },
                { type: "rect", insertPointX: 105, insertPointY: 105, width: 35, height: 35 },
                { type: "path", data: "M 220, 120.19L 147, 72.276L 147, 168.104L 220, 120.19 Z " }
            ],
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff"
        }
    },
    {
        name: "VgxText", baseType: "VgxEntity", members: ["fontFamily", "fontSize", "source", "alignment", "baseline"], properties: {
            insertPointX: 20,
            insertPointY: 115,
            fontFamily: "Arial",
            fontSize: 28,
            source: "Vector Graphics",
            alignment: "left",
            baseline: "middle",
            stroke: "transparent",
            strokeWidth: 0,
            fill: "#3995fd"
        }
    },
    {
        name: "VgxImage", baseType: "VgxEntity", members: ["height", "source", "width"], properties: {
            insertPointX: 20,
            insertPointY: 70,
            width: 194,
            height: 103,
            stroke: "#3995fd",
            strokeWidth: 3,
            fill: "#9dd9ff",
            source: createImage(sampleImageResource)
        }
    }/*,
    {
        name: "Point", baseType: "Symbol", members: [], properties: {
            insertPointX: 120,
            insertPointY: 140,
            stroke: "#3995fd",
            strokeWidth: 3
        }
    }*/
];


function createImage(src) {
	var result = new Image();
	result.src = src;
	return result;
}

function createEntityInfoGroup(data) {

    var group = new Vgx.VgxGroup();

    var fontFamily = "Open Sans";
    var titlePadding = 10;

    var txtTitle = new Vgx.VgxText();
    txtTitle.insertPointX = titlePadding;
    txtTitle.insertPointY = 26;
    txtTitle.fontFamily = fontFamily;
    txtTitle.fontSize = 24;
    txtTitle.fill = "#464646";
    txtTitle.source = data.name;

    var rectTitle = new Vgx.VgxRectangle();
    rectTitle.cornersRadius = 6;
    rectTitle.insertPointX = 0;
    rectTitle.insertPointY = 0;
    rectTitle.setBinding("width", () => {
        return titlePadding + txtTitle.getBounds().width + titlePadding;
    });
    rectTitle.height = 34;
    rectTitle.fill = "#CECECE";
    group.children.add(rectTitle);

    group.children.add(txtTitle);

    if (data.baseType) {
        var txtInherit = new Vgx.VgxText();
        txtInherit.setBinding("insertPointX", () => {
            return titlePadding + txtTitle.getBounds().width + titlePadding + 8;
        });
        txtInherit.insertPointY = 26;
        txtInherit.fontFamily = fontFamily;
        txtInherit.fontSize = 18;
        txtInherit.fill = "#464646";
        txtInherit.source = ": " + data.baseType;
        group.children.add(txtInherit);
    }

    if (!data.abstract) {
        var rectDrawing = new Vgx.VgxRectangle();
        rectDrawing.cornersRadius = 6;
        rectDrawing.insertPointX = 0;
        rectDrawing.insertPointY = 40;
        rectDrawing.width = 235;
        rectDrawing.height = 170;
        rectDrawing.fill = "#F3F3F3";
        group.children.add(rectDrawing);

        var typeCtor = Vgx[data.name];
        var entity = new typeCtor();

		for (var n in data.properties) {
			if (!(Reflect.has(data.properties, n)))
				continue;
			if (Reflect.has(entity, n)) {
				const propDesc = Object.getOwnPropertyDescriptor(entity, n);
				if (propDesc && (!propDesc.writable || !propDesc.get)) {
					// TODO log error: readonly property
				}
				else {
					Reflect.set(entity, n, data.properties[n]);
				}
			}
			
		}

        switch (data.name) {
            case "VgxPolyline":
            case "VgxPolygon":
                if ("points" in data.properties) {
					for (const point of data.properties.points) {
						entity.points.add(point);
					}
                }
                break;
            case "VgxQuadraticCurve":
                if ("points" in data.properties) {
					for (const point of data.properties.points) {
						entity.points.add(point);
					}
                }
                if ("controlPoints" in data.properties) {
					for (const controlPoint of data.properties.controlPoints) {
						entity.controlPoints.add(controlPoint);
					}
                }
                break;
            case "VgxCubicCurve":
                if ("points" in data.properties) {
                    for (const point of data.properties.points) {
						entity.points.add(point);
					}
                }
                if ("controlPoints1" in data.properties) {
                    for (const controlPoint of data.properties.controlPoints1) {
						entity.controlPoints1.add(controlPoint);
					}
                }
                if ("controlPoints2" in data.properties) {
					for (const controlPoint of data.properties.controlPoints2) {
						entity.controlPoints2.add(controlPoint);
					}
                }
                break;
            case "VgxGroup":
                if ("children" in data.properties) {
					for (const child of data.properties.children) {
						var childElement = DrawingLoader.loadChildElement(child);
                        if (childElement != null)
                            entity.children.add(childElement);
					}
                }
                break;
            case "VgxPath":
                if ("figures" in data.properties) {
					for (const fig of data.properties.figures) {
                        switch (fig.type) {
                            case "arc":
                                entity.addArc(fig.insertPointX, fig.insertPointY, fig.radius, fig.startAngle || 0, fig.endAngle || Math.PI * 2, fig.optClockwise || null);
                                break;
                            case "rect":
                                entity.addRect(fig.insertPointX, fig.insertPointY, fig.width, fig.height);
                                break;
                            case "ellipse":
                                entity.addRect(fig.insertPointX, fig.insertPointY, fig.radiusX, fig.radiusY, fig.rotation || 0, fig.startAngle || 0, fig.endAngle || Math.PI * 2, fig.optClockwise || null);
                                break;
                            case "path":
                                entity.addFigure(fig.data);
                                break;
                        }
					}
                }
                break;
        }
        group.children.add(entity);
    }

    var rectProperties = new Vgx.VgxRectangle();
    rectProperties.cornersRadius = 6;
    rectProperties.insertPointX = data.abstract ? 0 : 241;
    rectProperties.insertPointY = 40;
    rectProperties.width = data.abstract ? 436 : 195;
    rectProperties.height = 170;
    rectProperties.fill = "#E3E3E3";
    group.children.add(rectProperties);

    var y = 62;
    if (data.baseType != null && data.baseType != "" && data.baseType != "Object") {
        var txtInheritedProp = new Vgx.VgxText();
        txtInheritedProp.insertPointX = data.abstract ? 10 : 251;
        txtInheritedProp.insertPointY = y;
        txtInheritedProp.fontFamily = fontFamily;
        txtInheritedProp.fontSize = 16;
        txtInheritedProp.fill = "#2f7ed7";
        txtInheritedProp.source = data.baseType + " properties +";
        group.children.add(txtInheritedProp);
        y = 85;
    }
    
    var stepY = 20;
    for (let i = 0; i < data.members.length; i++) {
        var txtProp = new Vgx.VgxText();
        txtProp.insertPointX =  data.abstract ? 10 : 251;
        txtProp.insertPointY = y + (stepY * i);
        txtProp.fontFamily = fontFamily;
        txtProp.fontSize = 16;
        txtProp.fill = "#464646";
        txtProp.source = data.members[i];
        group.children.add(txtProp);
    }


    return group;
}


var groupHorizontalOffset = 450;
var groupVerticalOffset = 260;

var baseTypesGroup = new Vgx.VgxGroup();
baseTypesGroup.insertPointX = 0;

var abstractEntityGroup = createEntityInfoGroup({ name: "VgxObject", baseType: "", abstract: true, members: ["drawing", "handle"] });
baseTypesGroup.children.add(abstractEntityGroup);

abstractEntityGroup = createEntityInfoGroup({ name: "VgxDrawable", baseType: "VgxObject", abstract: true, members: [/*"appearanceDirty", "geometryDirty", "positionDirty",*/ "visible"] });
abstractEntityGroup.insertPointX = groupHorizontalOffset;
baseTypesGroup.children.add(abstractEntityGroup);

abstractEntityGroup = createEntityInfoGroup({ name: "VgxEntity", baseType: "VgxDrawable", abstract: true, members: ["insertPointX", "insertPointY", "shadow", "stroke", "strokeWidth", "transform"] });
abstractEntityGroup.insertPointX = groupHorizontalOffset * 2;
baseTypesGroup.children.add(abstractEntityGroup);

drawing.addChild(baseTypesGroup);

let maxWidth = 0;
let maxHeight = 0;

var maxColumns = 5;
for (var i = 0; i < dataSet.length; i++) {
    var entityGroup = createEntityInfoGroup(dataSet[i]);
    var column = i % maxColumns;
    var row = (i - column) / maxColumns; 
    entityGroup.insertPointX = groupHorizontalOffset * column;
    entityGroup.insertPointY = groupVerticalOffset * (row + 1);
    drawing.addChild(entityGroup);

	maxWidth = Math.max(maxWidth, entityGroup.insertPointX + groupHorizontalOffset);
	maxHeight = Math.max(maxHeight, entityGroup.insertPointY + groupVerticalOffset);
}

//drawing.artboardRect = new Vgx.Rect(0, 0, maxWidth, maxHeight);

drawing.background = "#FFFFFF";

const artboardShadow = new Vgx.Shadow();
artboardShadow.color = "rgba(0,0,0,0.1)";
artboardShadow.offsetX = 3;
artboardShadow.offsetY = 3;
artboardShadow.blur = 3;

const artboard = new Vgx.Artboard();
artboard.bounds = Vgx.Rect.from({ x: -20, y: -20, width: 2275, height: 1290});
artboard.background = "#cccccc";
artboard.border = "#aaaaaa";
artboard.borderWidth = 1.2;
artboard.clipContent = true;
artboard.shadow = artboardShadow;
drawing.artboard = artboard;