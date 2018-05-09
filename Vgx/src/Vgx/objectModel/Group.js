
(function (lib) {

    var Group = (function () {

        function Group() {
            lib.Vgx.Entity.call(this);
            lib.Vgx.IFillable.call(this);

            var _self = this;
            var _children;
            

            function _init() {
                _children = new lib.Extra.Collection();
                _children.onItemsAdded.addHandler(function (s, e) {
                    _self.geometryDirty = true;
                });
                _children.onItemsRemoved.addHandler(function (s, e) {
                    _self.geometryDirty = true;
                });
                _children.onCollectionCleared.addHandler(function (s, e) {
                    _self.geometryDirty = true;
                });
            }


            // virtual override
            Object.defineProperty(this, "_getBounds", {
                value: function () {
                    var result = new lib.Vgx.Rect();
                    _children.forEach(function (v, i, o) {
                        result.union(v.getBounds());
                    });
                    result.x += _self.insertPointX;
                    result.y += _self.insertPointY;
                    return result
                }
            });


            Object.defineProperty(this, "children", {
                get: function () { return _children; }
            });

            Object.defineProperty(this, "draw", {
                configurable: false,
                value: function (drawingContext) {
                    drawingContext.drawGroup(_self);
                }
            });

            //// override
            //Object.defineProperty(this, "getBounds", {
            //    value: function () {
            //        var result = new lib.Vgx.Rect();
            //        _children.forEach(function (v, i, o) {
            //            console.log(v.constructor.name);
            //            result.union(v.getBounds());
            //        });
            //        result = _self.transform.transformRect(result.x, result.y, result.width, result.height);
            //        result.x = _self.insertPointX;
            //        result.y = _self.insertPointY;
            //        return result;
            //    }
            //});


            _init();
        }

        Group.prototype = Object.create(lib.Vgx.Entity.prototype);
        Group.prototype.constructor = Group;

        return Group;

    })();
    lib.Vgx.Group = Group;

})(library);