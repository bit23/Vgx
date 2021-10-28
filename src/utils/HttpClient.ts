
namespace Vgx {
    
    export interface HttpClientProgressEventArgs {
        loaded: number;
        total : number;
        percentage: number;
    }

    export interface HttpClientSuccessEventArgs {
        result: any;
        resultType : XMLHttpRequestResponseType;
        rawResult: string;
    }

    export interface HttpClientErrorEventArgs {
        status: string;
        code : number;
    }

    export class HttpClient {

        private static _download(
            url: string, 
            responseType: XMLHttpRequestResponseType, 
            onSuccess: EventHandler<HttpClient, HttpClientSuccessEventArgs>, 
            optOnError: EventHandler<HttpClient, HttpClientErrorEventArgs>, 
            optOnAbort: EventHandler<HttpClient, EventArgs>) {
            var client = new HttpClient();
            client.method = "GET";
            client.responseType = responseType;
            client.onSuccess.add(onSuccess);
            if (typeof optOnError === "function")
                client.onError.add(optOnError);
            if (typeof optOnAbort === "function")
                client.onAbort.add(optOnAbort);
            client.sendRequest(url);
        }

        public static downloadString(
            url: string, 
            onSuccess: EventHandler<HttpClient, HttpClientSuccessEventArgs>, 
            optOnError?: EventHandler<HttpClient, HttpClientErrorEventArgs>, 
            optOnAbort?: EventHandler<HttpClient, EventArgs>
        ) {
            HttpClient._download(url, "text", onSuccess, optOnError, optOnAbort);
        }

        public static downloadJSON(
            url: string, 
            onSuccess: EventHandler<HttpClient, HttpClientSuccessEventArgs>, 
            optOnError?: EventHandler<HttpClient, HttpClientErrorEventArgs>, 
            optOnAbort?: EventHandler<HttpClient, EventArgs>
        ) {
            HttpClient._download(url, "json", onSuccess, optOnError, optOnAbort);
        }


        private _events = new EventsManager(this);
        private _baseUrl: string;
        private _xhr: XMLHttpRequest;
        private _method = "GET";
        private _mimeType = "text/plain;charset=UTF-8";
        private _responseType: XMLHttpRequestResponseType = "text";
        private _timeout = 0;
        private _isBusy = false;
        private _useCredentials = false;

        constructor(baseUrl?: string) {
            this._baseUrl = this._formatBaseUrl(baseUrl);
            this._xhr = new XMLHttpRequest();
            this._xhr.addEventListener("progress", this._xhr_onProgress.bind(this));
            this._xhr.addEventListener("load", this._xhr_onLoad.bind(this), false);
            this._xhr.addEventListener("error", this._xhr_onError.bind(this), false);
            this._xhr.addEventListener("abort", this._xhr_onAbort.bind(this), false);
            //this._xhr.addEventListener("readystatechange", this._xhr_onReadyStateChanged);

            this.onAbort = new EventSet<HttpClient, EventArgs>(this._events, "onAbort");
            this.onSuccess = new EventSet<HttpClient, HttpClientSuccessEventArgs>(this._events, "onSuccess");
            this.onError = new EventSet<HttpClient, HttpClientErrorEventArgs>(this._events, "onError");
            this.onProgress = new EventSet<HttpClient, HttpClientProgressEventArgs>(this._events, "onProgress");
        }

        private _xhr_onProgress(e: ProgressEvent<XMLHttpRequestEventTarget>) {
            if (e.lengthComputable) {
                var progress: HttpClientProgressEventArgs = {
                    loaded: e.loaded,
                    total: e.total,
                    percentage: (e.loaded / e.total) * 100
                };
                this._events.trigger("onProgress", progress);
            }
        }

        private _xhr_onLoad(e: ProgressEvent<XMLHttpRequestEventTarget>) {
            var result: HttpClientSuccessEventArgs = {
                result: this._xhr.response,
                resultType: this._xhr.responseType,
                rawResult: this._xhr.responseText
            };
            this._events.trigger("onSuccess", result);
        }

        private _xhr_onError(e: ProgressEvent<XMLHttpRequestEventTarget>) {
            var error: HttpClientErrorEventArgs = {
                status: this._xhr.statusText,
                code: this._xhr.status
            };
            this._events.trigger("onError", error);
        }

        private _xhr_onAbort(e: ProgressEvent<XMLHttpRequestEventTarget>) {
            this._events.trigger("onAbort", {});
        }

        // private _xhr_onReadyStateChanged(e: ProgressEvent<XMLHttpRequestEventTarget>) {
        //    if (this._xhr.readyState == XMLHttpRequest.DONE) {
        //     this._isBusy = false;
        //        if (this._xhr.status == 200) {
        //            // Request finished. Do processing here.
        //        }
        //        else {
        //            // Error
        //        }
        //    }
        // }

        private _formatBaseUrl(url: string) {
            if (typeof url !== "string")
                return "";
            if (url.length == 0)
                return "";
            if (url.substr(url.length - 1) !== "/")
                url += "/";
            return url;
        }



        public setRequestHeader(name: string, value: string) {
            this._xhr.setRequestHeader(name, value);
        }

        public sendRequest(endPoint: string, optData?: Document | BodyInit | null) {

            if (this._isBusy)
                throw new Error("HttpClient is busy");

            var fullEndPoint = this._baseUrl + endPoint;
            this._isBusy = true;
            this._xhr.open(this._method, fullEndPoint, true);
            this._xhr.timeout = this._timeout;
            this._xhr.withCredentials = this._useCredentials;
            this._xhr.overrideMimeType(this._mimeType);
            this._xhr.responseType = this._responseType;
            this._xhr.send(optData);
        }

        public abortRequest() {
            if (this._isBusy) {
                this._xhr.abort();
            }
        }


        public get baseUrl() { return this._baseUrl; }
        public set baseUrl(v: string) {
            if (typeof v === "string") {
                v = this._formatBaseUrl(v);
                if (this._baseUrl !== v) {
                    this._baseUrl = v;
                }
            }
        }

        public get isBusy() { return this._isBusy; }

        public get method() { return this._method; }
        public set method(v: string) {
            if (typeof v === "string" && this._method !== v) {
                this._method = v;
            }
        }

        public get mimeType() { return this._mimeType; }
        public set mimeType(v: string) {
            if (typeof v === "string" && this._mimeType !== v) {
                this._mimeType = v;
            }
        }

        public get responseType() { return this._responseType; }
        public set responseType(v: string) {
            if (typeof v === "string" && this._responseType !== v) {
                this._mimeType = v;
            }
        }

        public get timeout() { return this._timeout; }
        public set timeout(v: number) {
            if (typeof v === "number" && this._timeout !== v) {
                this._timeout = v;
            }
        }

        public get useCredentials() { return this._useCredentials; }
        public set useCredentials(v: boolean) {
            if (typeof v === "boolean" && this._useCredentials !== v) {
                this._useCredentials = v;
            }
        }


        public onProgress: EventSet<HttpClient, HttpClientProgressEventArgs>; 
        public onSuccess: EventSet<HttpClient, HttpClientSuccessEventArgs>; 
        public onError: EventSet<HttpClient, HttpClientErrorEventArgs>; 
        public onAbort: EventSet<HttpClient, EventArgs>; 
    }
}