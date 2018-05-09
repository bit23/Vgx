
/// <reference path="../Cgx/Transform.js" />

(function (lib) {

    var EntityTransform = (function () {

        function EntityTransform(entity) {
            lib.Cgx.Transform.call(this);

            var _self = this;
            var _entity = entity;


            Object.defineProperty(this, "entity", {
                get: function () { return _entity; }
            });


            Object.defineProperty(this, "_propertyChanged", {
                enumerable: false,
                configurable: false,
                value: function (propertyName) {
                    _entity.geometryDirty = true;
                }
            });
        }

        EntityTransform.prototype = Object.create(lib.Cgx.Transform.prototype);
        EntityTransform.prototype.constructor = EntityTransform;

        return EntityTransform;

    })();
    lib.Vgx.EntityTransform = EntityTransform;

})(library);