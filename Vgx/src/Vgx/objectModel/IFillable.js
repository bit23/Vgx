
(function (lib) {

    var IFillable = (function () {

        function IFillable() {

            var _self = this;
            var _fill = lib.Vgx.Vars.defaultFillStyle;

            Object.defineProperty(this, "fill", {
                get: function () { return _fill; },
                set: function (v) {
                    if (_fill != v) {
                        _fill = v;
                        _self.appearanceDirty = true;
                    }
                }
            });
        }

        return IFillable;

    })();
    lib.Vgx.IFillable = IFillable;

})(library);