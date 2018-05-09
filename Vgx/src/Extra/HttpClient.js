
(function (lib) {

    var HttpClient = (function () {

        function HttpClient(baseUrl) {

            var _self = this;
            var _events = new lib.Extra.Events(this);
            var _baseUrl;
            var _xhr;
            var _method = "GET";
            var _mimeType = "text/plain;charset=UTF-8";
            var _responseType = "text";
            var _timeout = 0;
            var _isBusy = false;
            var _useCredentials = false;


            function _init() {

                _baseUrl = formatBaseUrl(baseUrl);

                _xhr = new XMLHttpRequest();
                _xhr.addEventListener("progress", _xhr_onProgress);
                _xhr.addEventListener("load", _xhr_onLoad, false);
                _xhr.addEventListener("error", _xhr_onError, false);
                _xhr.addEventListener("abort", _xhr_onAbort, false);
                //_xhr.addEventListener("readystatechange", _xhr_onReadyStateChanged);
            }


            function _xhr_onProgress(e) {
                if (e.lengthComputable) {
                    var progress = {
                        loaded: e.loaded,
                        total: e.total,
                        percentage: (e.loaded / e.total) * 100
                    };
                    _events.raise("onProgress", progress);
                }
            }

            function _xhr_onLoad(e) {
                var result = {
                    result: _xhr.response,
                    resultType: _xhr.responseType,
                    rawResult: _xhr.responseText
                };
                _events.raise("onSuccess", result);
            }

            function _xhr_onError(e) {
                var error = {
                    status: _xhr.statusText,
                    code: _xhr.status
                };
                _events.raise("onError", error);
            }

            function _xhr_onAbort(e) {
                _events.raise("onAbort", {});
            }

            //function _xhr_onReadyStateChanged(e) {
            //    if (_xhr.readyState == XMLHttpRequest.DONE) {
            //        _isBusy = false;
            //        if (_xhr.status == 200) {
            //            // Request finished. Do processing here.
            //        }
            //        else {
            //            // Error
            //        }
            //    }
            //}

            function setRequestHeader(name, value) {
                _xhr.setRequestHeader(name, value);
            }

            function sendRequest(endPoint, optData) {

                if (_isBusy)
                    throw new Error("HttpClient is busy");

                var fullEndPoint = _baseUrl + endPoint;
                _isBusy = true;
                _xhr.open(_method, fullEndPoint, true);
                _xhr.timeout = _timeout;
                _xhr.withCredentials = _useCredentials;
                _xhr.overrideMimeType(_mimeType);
                _xhr.responseType = _responseType;
                _xhr.send(optData);
            }

            function abortRequest() {
                if (_isBusy) {
                    _xhr.abort();
                }
            }

            function formatBaseUrl(url) {
                if (typeof url !== "string")
                    return "";
                if (url.length == 0)
                    return "";
                if (url.substr(url.length - 1) !== "/")
                    url += "/";
                return url;
            }


            Object.defineProperty(this, "baseUrl", {
                get: function () { return _baseUrl; },
                set: function (v) {
                    if (typeof v === "string") {
                        v = formatBaseUrl(v);
                        if (_baseUrl !== v) {
                            _baseUrl = v;
                        }
                    }
                }
            });

            Object.defineProperty(this, "isBusy", {
                get: function () { return _isBusy; }
            });

            Object.defineProperty(this, "method", {
                get: function () { return _method; },
                set: function (v) {
                    if (typeof v === "string" && _method !== v) {
                        _method = v;
                    }
                }
            });

            Object.defineProperty(this, "mimeType", {
                get: function () { return _mimeType; },
                set: function (v) {
                    if (typeof v === "string" && _mimeType !== v) {
                        _mimeType = v;
                    }
                }
            });

            Object.defineProperty(this, "responseType", {
                get: function () { return _responseType; },
                set: function (v) {
                    if (typeof v === "string" && _responseType !== v) {
                        _responseType = v;
                    }
                }
            });

            Object.defineProperty(this, "timeout", {
                get: function () { return _timeout; },
                set: function (v) {
                    if (typeof v === "number" && _timeout !== v) {
                        _timeout = v;
                    }
                }
            });

            Object.defineProperty(this, "useCredentials", {
                get: function () { return _useCredentials; },
                set: function (v) {
                    v = !!v;
                    if (_useCredentials !== v) {
                        _useCredentials = v;
                    }
                }
            });


            Object.defineProperty(this, "setRequestHeader", { value: setRequestHeader });
            Object.defineProperty(this, "abortRequest", { value: abortRequest });
            Object.defineProperty(this, "sendRequest", { value: sendRequest });


            _events.create("onProgress");
            _events.create("onSuccess");
            _events.create("onError");
            _events.create("onAbort");

            _init();
        }


        function download(url, responseType, onSuccess, optOnError, optOnAbort) {
            var client = new HttpClient();
            client.method = "GET";
            client.responseType = responseType;
            client.onSuccess.addHandler(onSuccess);
            if (typeof optOnError === "function")
                client.onError.addHandler(optOnError);
            if (typeof optOnAbort === "function")
                client.onAbort.addHandler(optOnAbort);
            client.sendRequest(url);
        }

        Object.defineProperty(HttpClient, "downloadString", {
            value: function (url, onSuccess, optOnError, optOnAbort) {
                download(url, "text", onSuccess, optOnError, optOnAbort);
            }
        });

        Object.defineProperty(HttpClient, "downloadJSON", {
            value: function (url, onSuccess, optOnError, optOnAbort) {
                download(url, "json", onSuccess, optOnError, optOnAbort);
            }
        });


        return HttpClient;

    })();
    lib.Extra.HttpClient = HttpClient;

})(library);