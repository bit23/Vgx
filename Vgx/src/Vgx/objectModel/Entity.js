
/// <reference path="../Shadow.js" />
/// <reference path="../EntityTransform.js" />
/// <reference path="Drawable.js" />

(function (lib) {

    var Entity = (function () {

        function Entity() {
            lib.Vgx.Drawable.call(this);

            var _self = this;
            var _insertPointX = 0;
            var _insertPointY = 0;
            var _stroke = lib.Vgx.Vars.defaultStrokeStyle;
            var _strokeWidth = lib.Vgx.Vars.defaultStrokeWidth;
            var _shadow = new lib.Vgx.Shadow();
            _shadow.onPropertyChanged.addHandler(function (p) { _self.appearanceDirty = true; }, {});
            var _transform = new lib.Vgx.EntityTransform(this);
            var _cachedBounds = new lib.Vgx.Rect();


            // @abstract
            Object.defineProperty(this, "_getPath", {
                configurable: true,
                value: null
            });

            // @virtual
            Object.defineProperty(this, "_getVertices", {
                configurable: true,
                value: function () {
                    return [{
                        x: _self._getValue("insertPointX", _insertPointX),
                        y: _self._getValue("insertPointY", _insertPointY)
                    }];
                }
            });

            // @virtual
            Object.defineProperty(this, "_getBounds", {
                configurable: true,
                value: function () {
                    return lib.Vgx.Rect.empty;
                }
            });



            // @virtual
            Object.defineProperty(this, "insertPointX", {
                configurable: true,
                get: function () { return _self._getValue("insertPointX", _insertPointX); },
                set: function (v) {
                    if (_insertPointX != v) {
                        _insertPointX = v;
                        _self.positionDirty = true;
                    }
                }
            });

            // @virtual
            Object.defineProperty(this, "insertPointY", {
                configurable: true,
                get: function () { return _self._getValue("insertPointY", _insertPointY); },
                set: function (v) {
                    if (_insertPointY != v) {
                        _insertPointY = v;
                        _self.positionDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "stroke", {
                get: function () { return _self._getValue("stroke", _stroke); },
                set: function (v) {
                    if (_stroke != v) {
                        _stroke = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "strokeWidth", {
                get: function () { return _self._getValue("strokeWidth", _strokeWidth); },
                set: function (v) {
                    if (_strokeWidth != v) {
                        _strokeWidth = v;
                        _self.appearanceDirty = true;
                    }
                }
            });

            Object.defineProperty(this, "shadow", {
                get: function () { return _shadow; }
            });


            Object.defineProperty(this, "getBounds", {
                value: function () {
                    if (_self.geometryDirty) {
                        var bounds = _self._getBounds();
                        if (!_transform.isIdentity) {
                            var mtx = _self.transform.getMatrix().clone();
                            mtx.offsetX = -(_self.insertPointX + _self.transform.originX);
                            mtx.offsetY = -(_self.insertPointY + _self.transform.originY);
                            _cachedBounds = mtx.transformRect(bounds.x, bounds.y, bounds.width, bounds.height);
                        }
                        else {
                            _cachedBounds = bounds;
                        }
                    }
                    return _cachedBounds;
                }
            });

            Object.defineProperty(this, "transform", {
                get: function () { return _transform; },
                set: function (v) {
                    if (v instanceof lib.Cgx.Transform) {
                        _transform.translationX = v.translationX;
                        _transform.translationY = v.translationY;
                        _transform.scaleX = v.scaleX;
                        _transform.scaleY = v.scaleY;
                        _transform.rotation = v.rotation;
                        _transform.originX = v.originX;
                        _transform.originY = v.originY;
                    }
                }
            });

        }

        Entity.prototype = Object.create(lib.Vgx.Drawable.prototype);
        Entity.prototype.constructor = Entity;

        return Entity;
    })();
    lib.Vgx.Entity = Entity;

})(library);