

//var VgxPathCommand;
//(function (VgxPathCommand) {
//    VgxPathCommand[VgxPathCommand["MOVE_TO"] = 1] = "MOVE_TO";
//    VgxPathCommand[VgxPathCommand["LINE_TO"] = 2] = "LINE_TO";
//    VgxPathCommand[VgxPathCommand["HORIZONTAL_LINE_TO"] = 3] = "HORIZONTAL_LINE_TO";
//    VgxPathCommand[VgxPathCommand["VERTICAL_LINE_TO"] = 4] = "VERTICAL_LINE_TO";
//    VgxPathCommand[VgxPathCommand["ARC_TO"] = 5] = "ARC_TO";
//    VgxPathCommand[VgxPathCommand["BEZIER_CURVE_TO"] = 6] = "BEZIER_CURVE_TO";
//    VgxPathCommand[VgxPathCommand["QUADRATIC_CURVE_TO"] = 7] = "QUADRATIC_CURVE_TO";
//    VgxPathCommand[VgxPathCommand["CLOSE_PATH"] = 8] = "CLOSE_PATH";
//    VgxPathCommand[VgxPathCommand["RECTANGLE"] = 9] = "RECTANGLE";
//    VgxPathCommand[VgxPathCommand["ELLIPSE"] = 10] = "ELLIPSE";
//    VgxPathCommand[VgxPathCommand["ARC"] = 11] = "ARC";
//    VgxPathCommand[VgxPathCommand["PATH"] = 12] = "PATH";
//})(VgxPathCommand || (VgxPathCommand = {}));
//Vgx.VgxPathCommand = VgxPathCommand;

(function (lib) {

    var Path = (function () {

        function Path() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;

            var _lastX = 0;
            var _lastY = 0;
            var _fillRule = "nonzero";
            var _listPath2D = [];
            var _currentFigure = null;


            function _init() {
                _self.beginNewFigure();
            }



            function createFigureObj(pathData) {
                if (typeof pathData === "string") {
                    return {
                        path: new Path2D(pathData),
                        isEmpty: false
                    };
                }
                else {
                    return {
                        path: new Path2D(),
                        isEmpty: true
                    };
                }
            }


            function collectPath2D() {
                if (_currentFigure != null && !_currentFigure.isEmpty)
                    _listPath2D.push(_currentFigure.path);
                _currentFigure = null;
            }

            function createNewFigure(pathData) {

                var result;
                if (typeof pathData === "string") {
                    result = createFigureObj(pathData);
                }

                if (_currentFigure != null) {
                    if (!_currentFigure.isEmpty)
                        collectPath2D();
                }

                if (!result) {
                    result = createFigureObj();
                }

                _currentFigure = result;
            }

            function ensureHasFigure() {
                if (!_currentFigure)
                    createNewFigure();
            }



            Object.defineProperty(this, "figures", {
                get: function () {
                    return _listPath2D.slice(0);
                }
            });


            this.clear = function () {
                _listPath2D.length = 0;
                _currentFigure = null;
                _self.geometryDirty = true;
            };


            this.beginNewFigure = function () {
                createNewFigure();
                _self.geometryDirty = true;
            };

            this.moveTo = function (x, y) {
                ensureHasFigure();
                _currentFigure.path.moveTo(x, y);
                _currentFigure.isEmpty = false;
                _lastX = x;
                _lastY = y;
            };

            this.lineTo = function (x, y) {
                ensureHasFigure();
                _currentFigure.path.lineTo(x, y);
                _currentFigure.isEmpty = false;
                _lastX = x;
                _lastY = y;
            };

            this.horizontalLineTo = function (x) {
                ensureHasFigure();
                _currentFigure.path.lineTo(x, _lastY);
                _currentFigure.isEmpty = false;
                _lastX = x;
            };

            this.verticalLineTo = function (y) {
                ensureHasFigure();
                _currentFigure.path.lineTo(_lastX, y);
                _currentFigure.isEmpty = false;
                _lastY = y;
            };

            this.arcTo = function (cpx, cpy, x, y, radius) {
                ensureHasFigure();
                _currentFigure.path.arcTo(cpx, cpy, x, y, radius);
                _currentFigure.isEmpty = false;
                _lastX = x;
                _lastY = y;
            };

            this.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
                ensureHasFigure();
                _currentFigure.path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                _currentFigure.isEmpty = false;
                _lastX = x;
                _lastY = y;
            };

            this.quadraticCurveTo = function (cpx, cpy, x, y) {
                ensureHasFigure();
                _currentFigure.path.quadraticCurveTo(cpx, cpy, x, y);
                _currentFigure.isEmpty = false;
                _lastX = x;
                _lastY = y;
            };

            this.closeFigure = function () {
                if (_currentFigure) {
                    _currentFigure.path.closePath();
                    _self.beginNewFigure();
                }
            };

            this.endFigure = function () {
                collectPath2D();
                _self.geometryDirty = true;
            };



            this.addFigure = function (pathData) {
                createNewFigure(pathData);
                collectPath2D();
                _self.geometryDirty = true;
                //createNewFigure();
                //var path = new Path2D(pathData);
                //_currentFigure.path.addPath(path);
                //collectPath2D();
                //_self.geometryDirty = true;
            };

            this.addRect = function (x, y, width, height) {
                createNewFigure();
                _currentFigure.path.rect(x, y, width, height);
                _currentFigure.isEmpty = false;
                collectPath2D();
                _self.geometryDirty = true;
            };

            this.addEllipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, optAnticlockwise) {
                optAnticlockwise = !!optAnticlockwise;
                createNewFigure();
                _currentFigure.path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, optAnticlockwise);
                _currentFigure.isEmpty = false;
                collectPath2D();
                _self.geometryDirty = true;
            };

            this.addArc = function (x, y, radius, startAngle, endAngle, optAnticlockwise) {
                optAnticlockwise = !!optAnticlockwise;
                createNewFigure();
                _currentFigure.path.arc(x, y, radius, startAngle, endAngle, optAnticlockwise);
                _currentFigure.isEmpty = false;
                collectPath2D();
                _self.geometryDirty = true;
            };


            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawPath(_self);
                    //drawingContext.drawVertex(_self.insertPoint.x, _self.insertPoint.y, _self.transform);
                }
            });


            //Object.defineProperty(this, "pathData", {
            //    get: function () { return _pathData; },
            //    set: function (v) {
            //        if (typeof v !== "string")
            //            return;
            //        if (_pathData != v) {
            //            _pathData = v;
            //            loadPathData();
            //            _self.geometryDirty = true;
            //        }
            //    }
            //});


            Object.defineProperty(this, "fillRule", {
                get: function () { return _fillRule; },
                set: function (v) {
                    if (typeof v !== "string" && v !== "nonzero" && v !== "evenodd")
                        return;
                    if (_fillRule != v) {
                        _fillRule = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    // TODO
                    var result = new lib.Vgx.Rect();
                    result.x = _self.insertPointX;
                    result.y = _self.insertPointY;
                    return result;
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        // TODO
            //        var result = lib.Vgx.Rect.empty;
            //        result.x = _self.insertPointX;
            //        result.y = _self.insertPointY;
            //        return result;
            //    }
            //});
        }

        Path.prototype = Object.create(lib.Vgx.Entity.prototype);
        Path.prototype.constructor = Path;

        return Path;

    })();
    lib.Vgx.Path = Path;

})(library);



//var VgxPathFigure = (function () {

//    function VgxPathFigure(path, pathData) {
//        lib.Vgx.IFillable.call(this);

//        var _self = this;
//        var _path = path;
//        var _pathData = pathData;
//        var _path2D;
//        var _fillRule = "nonzero";
//        var _isEmpty = true;


//        function _init() {
//            if (_pathData == null) {
//                _path2D = new Path2D();
//            }
//            else {
//                _path2D = new Path2D(_pathData);
//            }
//        }

//        Object.defineProperty(this, "path", {
//            get: function () { return _path2D; }
//        });

//        Object.defineProperty(this, "isEmpty", {
//            get: function () { return _isEmpty; }
//        });

//        Object.defineProperty(this, "fillRule", {
//            get: function () { return _fillRule; },
//            set: function (v) {
//                if (typeof v !== "string" && v !== "nonzero" && v !== "evenodd")
//                    return;
//                if (_fillRule != v) {
//                    _fillRule = v;
//                    _self.appearanceDirty = true;
//                }
//            }
//        });


//        Object.defineProperty(this, "getPath2D", {
//            value: function () { return _path2D; }
//        });


//        this.moveTo = function (x, y) {
//            //addCommand(VgxPathCommand.MOVE_TO, { x: x, y: y });
//            _path2D.moveTo(x, y);
//            _lastX = x;
//            _lastY = y;
//        };

//        this.lineTo = function (x, y) {
//            //addCommand(VgxPathCommand.LINE_TO, { x: x, y: y });
//            _path2D.lineTo(x, y);
//            _lastX = x;
//            _lastY = y;
//        };

//        this.horizontalLineTo = function (x) {
//            //addCommand(VgxPathCommand.HORIZONTAL_LINE_TO, { x: x });
//            _path2D.lineTo(x, _lastY);
//            _lastX = x;
//        };

//        this.verticalLineTo = function (y) {
//            //addCommand(VgxPathCommand.VERTICAL_LINE_TO, { y: y });
//            _path2D.lineTo(_lastX, y);
//            _lastY = y;
//        };

//        this.arcTo = function (cpx, cpy, x, y, radius) {
//            //addCommand(VgxPathCommand.ARC_TO, { cpx: cpx, cpy: cpy, x: x, y: y, radius: radius });
//            _path2D.arcTo(cpx, cpy, x, y, radius);
//            _lastX = x;
//            _lastY = y;
//        };

//        this.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
//            //addCommand(VgxPathCommand.BEZIER_CURVE_TO, { cp1x: cp1x, cp1y: cp1y, cp2x: cp2x, cp2y: cp2y, x: x, y: y });
//            _path2D.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
//            _lastX = x;
//            _lastY = y;
//        };

//        this.quadraticCurveTo = function (cpx, cpy, x, y) {
//            //addCommand(VgxPathCommand.QUADRATIC_CURVE_TO, { cpx: cpx, cpy: cpy, x: x, y: y });
//            _path2D.quadraticCurveTo(cpx, cpy, x, y);
//            _lastX = x;
//            _lastY = y;
//        };


//        _init();
//    }

//    return VgxPathFigure;

//})();
//Vgx.VgxPathFigure = VgxPathFigure;