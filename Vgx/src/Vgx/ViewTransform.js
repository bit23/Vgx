
/// <reference path="../Cgx/Matrix.js" />

/// <reference path="Point2D.js" />
/// <reference path="Rect.js" />


(function (lib) {

    var ViewTransform = (function () {

        function ViewTransform() {

            var _self = this;
            var _matrix = new lib.Cgx.Matrix();
            var _isDirty = true;
            var _viewZoom = 1;
            var _viewTargetX = 0;
            var _viewTargetY = 0;
            var _viewPixelWidth = 1;
            var _viewPixelHeight = 1;
            var _viewPixelHalfWidth = _viewPixelWidth * 0.5;
            var _viewPixelHalfHeight = _viewPixelHeight * 0.5;



            function computeInternalMatrix() {

                _matrix.reset();

                _matrix.translate(_viewPixelHalfWidth, _viewPixelHalfHeight);
                _matrix.scale(_viewZoom, _viewZoom);
                _matrix.translate(-_viewTargetX, -_viewTargetY);

                _isDirty = false;

                setTarget(_viewTargetX, _viewTargetY);
            }

            function setTarget(x, y)
            {
                var globalViewRect = _self.localToGlobalRect(0, 0, _viewPixelWidth, _viewPixelHeight);
                var offsetX = -x + (globalViewRect.width * 0.5);
                var offsetY = -y + (globalViewRect.height * 0.5);
                offsetX *= _viewZoom;
                offsetY *= _viewZoom;
                setMatrixOffset(offsetX, offsetY);
                _viewTargetX = x;
                _viewTargetY = y;
            }


            function getMatrixInverted() {
                if (_matrix.hasInverse()) {
                    return lib.Cgx.Matrix.invert(_matrix);
                }
                else {
                    return _matrix;
                }
            }

            function setMatrixOffset(offsetX, offsetY) {
                _matrix.offsetX = offsetX;
                _matrix.offsetY = offsetY;
            }



            Object.defineProperty(this, "getMatrix", {
                value: function () {
                    if (_isDirty) {
                        computeInternalMatrix();
                    }
                    return _matrix;
                }
            });

            Object.defineProperty(this, "getViewBounds", {
                value: function () {
                    return _self.localToGlobalRect(0, 0, _viewPixelWidth, _viewPixelHeight);
                }
            });


            Object.defineProperty(this, "setViewPixelSize", {
                value: function (width, height) {
                    _viewPixelWidth = width;
                    _viewPixelHeight = height;
                    _viewPixelHalfWidth = _viewPixelWidth * 0.5;
                    _viewPixelHalfHeight = _viewPixelHeight * 0.5;
                    _isDirty = true;
                }
            });

            Object.defineProperty(this, "setViewTarget", {
                value: function (tx, ty) {
                    setTarget(tx, ty);
                    _isDirty = true;
                }
            });

            Object.defineProperty(this, "moveViewTarget", {
                enumerable: false,
                value: function (dx, dy) {
                    setTarget(_viewTargetX + dx, _viewTargetY + dy);
                    _isDirty = true;
                }
            });

            Object.defineProperty(this, "setViewZoom", {
                value: function (value) {
                    _viewZoom = value;
                    _isDirty = true;
                }
            });

            Object.defineProperty(this, "setViewZoomTo", {
                enumerable: false,
                value: function (zoomIncrement, tx, ty) {
                    setTarget(tx, ty);
                    _viewZoom *= zoomIncrement;
                    _isDirty = true;
                }
            });


            Object.defineProperty(this, "viewTargetX", {
                get: function () { return _viewTargetX; }
            });

            Object.defineProperty(this, "viewTargetY", {
                get: function () { return _viewTargetY; }
            });

            Object.defineProperty(this, "viewZoom", {
                get: function () { return _viewZoom; }
            });




            Object.defineProperty(this, "globalToLocalPoint", {
                value: function (x, y) {
                    return _self.getMatrix().transformPoint(x, y);
                }
            });

            Object.defineProperty(this, "globalToLocalRect", {
                value: function (x, y, width, height) {
                    //var endX = x + width;
                    //var endY = y + height;
                    //var matrix = _self.getMatrix();
                    //var start = matrix.transform(x, y);
                    //var end = matrix.transform(endX, endY);
                    //var lx, ly, lw, lh;
                    //lx = start.x;
                    //ly = start.y;
                    //lw = end.x - lx;
                    //lh = end.y - ly;
                    //return new lib.Vgx.Rect(lx, ly, lw, lh);
                    return _self.getMatrix().transformRect(x, y, width, height);
                }
            });

            Object.defineProperty(this, "localToGlobalPoint", {
                value: function (x, y) {
                    return getMatrixInverted().transformPoint(x, y);
                }
            });

            Object.defineProperty(this, "localToGlobalRect", {
                value: function (x, y, width, height) {
                    //var endX = x + width;
                    //var endY = y + height;
                    //var invertedMatrix = getMatrixInverted();
                    //var start = invertedMatrix.transform(x, y);
                    //var end = invertedMatrix.transform(endX, endY);
                    //var lx, ly, lw, lh;
                    //lx = start.x;
                    //ly = start.y;
                    //lw = end.x - lx;
                    //lh = end.y - ly;
                    //return new lib.Vgx.Rect(lx, ly, lw, lh);
                    return getMatrixInverted().transformRect(x, y, width, height);
                }
            });
        }

        return ViewTransform;
    })();
    lib.Vgx.ViewTransform = ViewTransform;

    //var ViewTransform = (function () {

    //    function ViewTransform() {

    //        var _self = this;
    //        var _matrix = lib.Cgx.Matrix.identity;
    //        var _zoomCenterX;
    //        var _zoomCenterY;
    //        var _viewZoom = 1;
    //        var _isBottomUp = false;
    //        var _viewTargetX = 0;
    //        var _viewTargetY = 0;
    //        var _viewPixelWidth = 0;
    //        var _viewPixelHeight = 0;


    //        function computeInternalMatrix() {
    //            var internalMatrix = new lib.Cgx.Matrix();
    //            // TODO
    //            if (_isBottomUp) {
    //                internalMatrix.scale(1, -1);
    //                internalMatrix.scaleAt(_viewZoom, _viewZoom, -_zoomCenterX, _zoomCenterY);
    //            }
    //            else {
    //                internalMatrix.scale(1, 1);
    //                internalMatrix.scaleAt(_viewZoom, _viewZoom, -_zoomCenterX, -_zoomCenterY);
    //            }
    //            //
    //            internalMatrix.translate(_viewPixelWidth * 0.5, _viewPixelHeight * 0.5);
    //            updateInternalMatrix(internalMatrix);
    //            _self._setViewTargetPoint(_viewTargetX, _viewTargetY);
    //        }

    //        function updateInternalMatrix(matrix) {
    //            _matrix = matrix;
    //        }

    //        function setMatrixOffset(offsetX, offsetY) {
    //            _matrix.offsetX = offsetX;
    //            _matrix.offsetY = offsetY;
    //        }

    //        function getMatrixInverted() {
    //            if (_matrix.hasInverse()) {
    //                return lib.Cgx.Matrix.invert(_matrix);
    //            }
    //            else {
    //                return _matrix;
    //            }
    //        }


    //        /*#region internals*/

    //        Object.defineProperty(this, "_setViewTargetPoint", {
    //            enumerable: false,
    //            value: function (x, y) {
    //                var globalViewRect = _self.localToGlobalRect(0, 0, _viewPixelWidth, _viewPixelHeight);
    //                var offsetX = -x + (globalViewRect.width * 0.5);
    //                var offsetY = y + (globalViewRect.height * 0.5);
    //                offsetX *= _viewZoom;
    //                offsetY *= _viewZoom;
    //                setMatrixOffset(offsetX, offsetY);
    //                _viewTargetX = x;
    //                _viewTargetY = y;
    //            }
    //        });

    //        Object.defineProperty(this, "_moveTargetPoint", {
    //            enumerable: false,
    //            value: function (dx, dy) {
    //                _self._setViewTargetPoint(_viewTargetX + dx, _viewTargetY + dy);
    //            }
    //        });

    //        Object.defineProperty(this, "_setViewZoom", {
    //            enumerable: false,
    //            value: function (zoom) {
    //                _viewZoom = zoom;
    //                _zoomCenterX = _viewTargetX;
    //                _zoomCenterY = _viewTargetY;
    //                computeInternalMatrix();
    //            }
    //        });

    //        Object.defineProperty(this, "_setViewZoomTo", {
    //            enumerable: false,
    //            value: function (zoom, targetX, targetY) {
    //                var dx = targetX - (_viewPixelWidth * 0.5);
    //                var dy = targetY - (_viewPixelHeight * 0.5);
    //                _self._moveTargetPoint(dx, dy);
    //                _self._setViewTargetPoint(targetX, targetY);
    //                _viewZoom = zoom;
    //                computeInternalMatrix();
    //            }
    //        });

    //        /*Object.defineProperty(this, "_setViewZoomFrom", {
    //            enumerable: false,
    //            value: function (zoom, x, y) {
    
    //                var screenCenterInScene = _self.localToGlobalPoint(
    //                    _viewPixelWidth * 0.5,
    //                    _viewPixelHeight * 0.5
    //                );
         
    //                var dx = (x - screenCenterInScene.x) / zoom;
    //                var dy = (y - screenCenterInScene.y) / zoom;
                     
    //                _self._setViewZoomTo(zoom, screenCenterInScene.x - dx, screenCenterInScene.y - dy);
    //                //_viewZoom = zoom;
    //                //_viewTargetX += dx;
    //                //_viewTargetY += dy;
    //                ////_self._moveTargetPoint(-dx, -dy);
         
    //                //computeInternalMatrix();
         
    //                //TODO:
    //                // calcolare la differenza tra il punto target ed il centro del frame
    //                // alla fine della trasformazione sottrarre la differenza agli offset
         
    //             }
    //        });*/

    //        Object.defineProperty(this, "_setViewPixelSize", {
    //            enumerable: false,
    //            value: function (width, height) {
    //                _viewPixelWidth = width;
    //                _viewPixelHeight = height;
    //                computeInternalMatrix();
    //            }
    //        });

    //        /*#endregion*/


    //        /*#region public*/


    //        Object.defineProperty(this, "setViewTarget", {
    //            value: function (x, y) {

    //            }
    //        });

    //        Object.defineProperty(this, "setViewZoom", {
    //            value: function (value) {
    //                _viewZoom = value;
    //                _zoomCenterX = _viewTargetX;
    //                _zoomCenterY = _viewTargetY;
    //                computeInternalMatrix();
    //            }
    //        });



    //        Object.defineProperty(this, "matrix", {
    //            get: function () { return _matrix; }
    //        });


    //        Object.defineProperty(this, "viewTargetX", {
    //            get: function () { return _viewTargetX; }
    //        });

    //        Object.defineProperty(this, "viewTargetY", {
    //            get: function () { return _viewTargetY; }
    //        });

    //        Object.defineProperty(this, "viewZoom", {
    //            get: function () { return _viewZoom; }
    //        });

    //        Object.defineProperty(this, "viewWidth", {
    //            get: function () { return _viewWidth; }
    //        });

    //        Object.defineProperty(this, "viewHeight", {
    //            get: function () { return _viewHeight; }
    //        });


    //        Object.defineProperty(this, "viewPixelWidth", {
    //            get: function () { return _viewPixelWidth; }
    //        });

    //        Object.defineProperty(this, "viewPixelHeight", {
    //            get: function () { return _viewPixelHeight; }
    //        });


    //        //Object.defineProperty(this, "isBottomUp", {
    //        //    get: function () { return _isBottomUp; },
    //        //    set: function (v) {
    //        //        v = !!v;
    //        //        if (_isBottomUp != v) {
    //        //            _isBottomUp = v;
    //        //            computeInternalMatrix();
    //        //        }
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "globalToLocalPoint", {
    //        //    value: function (x, y) {
    //        //        return _matrix.transform(x, y);
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "globalToLocalRect", {
    //        //    value: function (x, y, width, height) {
    //        //        var endX = x + width;
    //        //        var endY = y + height;
    //        //        var start = _matrix.transform(x, y);
    //        //        var end = _matrix.transform(endX, endY);
    //        //        var lx, ly, lw, lh;
    //        //        if (_isBottomUp) {
    //        //            lx = start.x;
    //        //            ly = end.y;
    //        //            lw = end.x - lx;
    //        //            lh = start.y - ly;
    //        //        }
    //        //        else {
    //        //            lx = start.x;
    //        //            ly = start.y;
    //        //            lw = end.x - lx;
    //        //            lh = end.y - ly;
    //        //        }
    //        //        return new lib.Vgx.Rect(lx, ly, lw, lh);
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "transformSizeToView", {
    //        //    value: function (width, height) {
    //        //        var st = _matrix.transform(width, height);
    //        //        return {
    //        //            width: Math.abs(st.x - _matrix.offsetX),
    //        //            height: Math.abs(st.y - _matrix.offsetY)
    //        //        };
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "transformPointsToView", {
    //        //    value: function (points) {
    //        //        var result = new Array(points.length);
    //        //        for (var i = 0; i < points.length; i++) {
    //        //            var p = points[i];
    //        //            result[i] = _matrix.transform(p.x, p.y);
    //        //        }
    //        //        return result;
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "localToGlobalPoint", {
    //        //    value: function (x, y) {
    //        //        return getMatrixInverted().transform(x, y);
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "localToGlobalRect", {
    //        //    value: function (x, y, width, height) {
    //        //        var endX = x + width;
    //        //        var endY = y + height;
    //        //        var invertedMatrix = getMatrixInverted();
    //        //        var start = invertedMatrix.transform(x, y);
    //        //        var end = invertedMatrix.transform(endX, endY);
    //        //        var lx, ly, lw, lh;
    //        //        if (_isBottomUp) {
    //        //            lx = start.x;
    //        //            ly = end.y;
    //        //            lw = end.x - lx;
    //        //            lh = start.y - ly;
    //        //        }
    //        //        else {
    //        //            lx = start.x;
    //        //            ly = start.y;
    //        //            lw = end.x - lx;
    //        //            lh = end.y - ly;
    //        //        }
    //        //        return new lib.Vgx.Rect(lx, ly, lw, lh);
    //        //    }
    //        //});


    //        //Object.defineProperty(this, "scale", {
    //        //    value: function (scaleX, scaleY) {
    //        //        _matrix.scale(scaleX, scaleY);
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "rotate", {
    //        //    value: function (angle) {
    //        //        _matrix.rotate(angle);
    //        //    }
    //        //});

    //        //Object.defineProperty(this, "translate", {
    //        //    value: function (dx, dy) {
    //        //        _matrix.translate(dx * _viewZoom, dy * _viewZoom);
    //        //    }
    //        //});

    //        /*#endregion*/
    //    }

    //    return ViewTransform;
    //})();
    //lib.Vgx.ViewTransform = ViewTransform;

})(library);