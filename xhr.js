var util = require("util");

var HttpClient                          = Java.type("org.apache.commons.httpclient.HttpClient");
var AuthScope                           = Java.type("org.apache.commons.httpclient.auth.AuthScope");
var MultiThreadedHttpConnectionManager  = Java.type("org.apache.commons.httpclient.MultiThreadedHttpConnectionManager");
var ProxyHost                           = Java.type("org.apache.commons.httpclient.ProxyHost");
var GetMethod                           = Java.type("org.apache.commons.httpclient.methods.GetMethod");
var HeadMethod                          = Java.type("org.apache.commons.httpclient.methods.HeadMethod");
var PostMethod                          = Java.type("org.apache.commons.httpclient.methods.PostMethod");
var InputStreamRequestEntity            = Java.type("org.apache.commons.httpclient.methods.InputStreamRequestEntity");
var PutMethod                           = Java.type("org.apache.commons.httpclient.methods.PutMethod");
var DeleteMethod                        = Java.type("org.apache.commons.httpclient.methods.DeleteMethod");
var TraceMethod                         = Java.type("org.apache.commons.httpclient.methods.TraceMethod");
var OptionsMethod                       = Java.type("org.apache.commons.httpclient.methods.OptionsMethod");
var UsernamePasswordCredentials         = Java.type("org.apache.commons.httpclient.UsernamePasswordCredentials");
var Header                              = Java.type("org.apache.commons.httpclient.Header");

var JavaString                          = Java.type("java.lang.String");
var ArrayList                           = Java.type("java.util.ArrayList");
var System                              = Java.type("java.lang.System");
var StringBuffer                        = Java.type("java.lang.StringBuffer");
var ByteArrayInputStream                = Java.type("java.io.ByteArrayInputStream");

/**
 * register two methods 'startsWith' and 'endsWith' to string object
 * */
if(typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.slice(0, str.length) == str;
    }
}

if(typeof String.prototype.endsWith != "function") {
    String.prototype.endsWith = function(str) {
        return this.slice(-str.length) == str;
    }
}

function XMLHttpRequest() {
    /**
     * XHR constants
     */
    var UNSENT = 0,
        OPENED = 1,
        HEADERS_RECEIVED = 2,
        LOADING = 3,
        DONE = 4;

    /**
     * XHR properties
     */
    var statusLine = null;

    //is it correct.
    this.status; //= getStatus();
    this.statusText; //= getStatusText();
    this.responseText; //= getResponseText();

    this.readyState = null;
    //this.responseXML = getResponseXML();
    this.onreadystatechange = null;
    this.getAllResponseHeaders = getAllResponseHeaders;
    this.getResponseHeader = getResponseHeader;
    this.abort = abort;
    this.send = send;
    this.open = opens;
    this.setRequestHeader = setRequestHeader;

    var methodName = null,
        url = null,
        async = null,
        username = null,
        password = null,
        requestHeaders = new ArrayList();

    var method = null,
        responseHeaders = null,
        responseType = null;

    /**
     * flags
     */
    var sent = false,
        error = false,

        httpClient;

    /**that variable is used to make the object available to the private methods.
     * This is a workaround for an error in the ECMAScript Language Specification which causes
     * this to be set incorrectly for inner functions.*/
    var that = this;

    httpClient = new HttpClient(new MultiThreadedHttpConnectionManager());
    var proxyConfig = getProxyConfig();
    if(proxyConfig != null) {
        httpClient.getHostConfiguration().setProxyHost(proxyConfig);
    }

/**
 * private method implementation
 * */
      function getStatus() {
        return statusLine.getStatusCode();
    };

     function setURL(arg) {
        if(util.isString(arg)) {
            var urls = String(arg);
            var formattedUrl = urls.toLowerCase();
            if(!(formattedUrl.startsWith("http://") || formattedUrl.startsWith("https://"))) {
                throw new Error("A urls must begins with either 'http://' or 'https://'");
            }
            var lastIndex = urls.indexOf("#");
            lastIndex = (lastIndex == -1) ? urls.length : lastIndex;
            url = urls.substring(0, lastIndex);
        } else {
            throw new Error("arg must be a string");
        }
    };

    function getStatusText() {
        return statusLine.getReasonPhrase();
    };

    function setRequestHeader() {
        var argLength = arguments.length;
        if (argLength != 2) {
            throw new Error("invalid number of arguments");
        }

        if((!util.isString(arguments[0])) || (!util.isString(arguments[1]))) {
            throw new Error("argument must be a String");
        }
        requestHeaders.add(new Header(String(arguments[0]), String(arguments[1])));
    };

    function opens() {
        var argLength = arguments.length;
        if(argLength < 2 || argLength > 5) {
            throw new Error("invalid arguments");
        } else if (argLength == 2) {
            setMethod(arguments[0]);
            setURL(arguments[1]);
        } else if (argLength == 3) {
            setMethod(arguments[0]);
            setURL(arguments[1]);
            setAsync(arguments[2]);
        } else if (argLength == 4) {
            setMethod(arguments[0]);
            setURL(arguments[1]);
            setUsername(arguments[2]);
            setPassword(arguments[3]);
        } else {
            setMethod(arguments[0]);
            setURL(arguments[1]);
            setAsync(arguments[2]);
            setUsername(arguments[3]);
            setPassword(arguments[4]);
        }
        updateReadyState(OPENED);
    };

    function abort () {
        if(async) {
            method.abort();
        }
    };

    function send(obj) {
        if(that.readyState != OPENED) {
            throw new Error("Invalid state, cannot invoke send() method. readyState");
        }
        if(sent) {
            method.abort();
            throw new Error("Invalid state, cannot invoke send() method while a request is active. " +
                "Request aborted.");
        }

        send_xhr(obj)
    };

    //do casting
    function send_xhr(obj) {
        var methodNameToUpper = methodName.toUpperCase();
        var localMethod;

        if("GET" == methodNameToUpper) {
            localMethod = new GetMethod(url);
        } else if("HEAD" == methodNameToUpper) {
            localMethod = new HeadMethod(url);
        } else if("POST" == methodNameToUpper) {
            var post = new PostMethod(url);
            var cont = getRequestContent(obj);  // not implemented
            var content;
            if(cont != null) {
                content = new JavaString(cont);
                post.setRequestEntity(new InputStreamRequestEntity(new ByteArrayInputStream(content.getBytes())));
            }
            localMethod = post;
        } else if("PUT" == methodNameToUpper) {
            var put = new PutMethod(url);
            var cont = getRequestContent(obj);
            var content;
            if(cont != null) {
                content = new JavaString(cont);
                put.setRequestEntity(new InputStreamRequestEntity(new ByteArrayInputStream(content.getBytes())));
            }
            localMethod = put;
        } else if("DELETE" == methodNameToUpper) {
            localMethod = new DeleteMethod(url);
        } else if("TRACE" == methodNameToUpper) {
            localMethod = new TraceMethod(url);
        } else if("OPTIONS" == methodNameToUpper) {
            localMethod = new OptionsMethod(url);
        } else {
            throw new Error("Unknown HTTP method : " + methodName);
        }

        for(var header = 0; header < requestHeaders.size(); header++) {
            localMethod.addRequestHeader(requestHeaders[header]);
        }
        if(username != null) {
            httpClient.getState().setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(username, password));
        }
        method = localMethod;
        if(async) {
            //not implemented; ---------------------

            updateReadyState(LOADING);
        } else {
            executeRequest();
        }

    } ;

    function updateReadyState(readyState) {
        that.readyState = readyState;
        if(async && that.onreadystatechange != null) {
            try {
                that.onreadystatechange();
            } catch (e) {
                throw new Error(e);
            }
        }
    };

    function executeRequest() {
        try {
            httpClient.executeMethod(method);
            statusLine = method.getStatusLine();
            responseHeaders = method.getResponseHeaders();
            updateReadyState(HEADERS_RECEIVED);

            //response is a byte array.
            var response = method.getResponseBody();
            if(response != null) {
                if(response.length > 0) {
                    that.responseText = new JavaString(response);
                }
            }

            var contentType = method.getResponseHeader("Content-Type");
            if(contentType != null) {
                responseType = contentType.getValue();
            }
            updateReadyState(DONE);
        } catch (e) {
            throw new Error(e);
        } finally {
            method.releaseConnection();
        }
    };

    function getResponseHeader(header) {
        if(that.readyState == UNSENT || that.readyState == OPENED) {
            return null;
        }

        if(error) {
            return null;
        }

        if(isInvalidHeader(header)) {
            return null;
        }

        if(responseHeaders == null) {
            return null;
        }

        for(var h in responseHeaders) {
            var headerToUpper = header.toUpperCase();
            if(h.getName().toUpperCase() == headerToUpper) {
                return h.getValue();
            }
        }
        return null;
    };

    function getAllResponseHeaders() {
        if(that.readyState == UNSENT || that.readyState == OPENED) {
            return null;
        }
        if(error) {
            return null;
        }

        var hBuf = new StringBuffer();
        var headers = "";
        if(responseHeaders == null) {
            return headers;
        }
        for(var h in responseHeaders) {
            var header = h.getName(); //check if this setted
            if(isInvalidHeader(header)) {
                continue;
            }
            hBuf.append(h.getName() + ": " + h.getValue() + "\r\n");
        }
        headers = hBuf.toString();
        return headers;
    }

    function isInvalidHeader(header) {
        var headerToUpper = header.toUpperCase();
        if((headerToUpper == "SET-COOKIE" || headerToUpper == "SET-COOKIE2") &&
            !(header == "Set-Cookie" || header == "Set-Cookie2")) {
            return true;
        }
        return false;
    };

    //TODO add other HTTP methods too
    function setMethod(arg) {
        if(util.isString(arg)) {
            var method_Name = (String(arg)).toUpperCase();
            if("GET" == method_Name || "HEAD" == method_Name || "POST" == method_Name ||
                "PUT" == method_Name || "DELETE" == method_Name || "TRACE" == method_Name ||
                "OPTIONS" == method_Name) {
                methodName = method_Name;
            } else {
                throw new Error("Method must be one of GET, HEAD, POST, PUT, DELETE, TRACE or OPTIONS")
            }
        } else {
            throw new Error("Set Method value must be a String");
        }
    };

    function setAsync(arg) {
        if(util.isBoolean(arg)) {
            async = arg;
        } else {
            throw new Error("async must be a Boolean");
        }
    };

    function setUsername(arg) {
        if(util.isString(arg)) {
            username = String(arg);
        } else {
            return new Error("username must be String");
        }
    };

    function setPassword(arg) {
        if(util.isString(arg)) {
            password = String(arg);
        } else {
            return new Error("password must be a String");
        }
    };

    function getResponseText() {
        if(that.readyState == LOADING || that.readyState == DONE) {
            return that.responseText;
        } else {
            return "";
        }
    };

    //not implemented correctly
    function getResponseXML() {
        if(!(that.readyState == LOADING || that.readyState == DONE)) {
            return null;
        }
        if(that.responseType != null && !(that.responseType == "text/xml") ||
            that.responseType == "application/xml" ||
            that.responseType.endsWith("+xml")) {
            return null;
        }
        if(that.responseXML != null) {
            return that.responseXML;
        }
        return {};
    };

    //this may be wrong
    function getRequestContent(obj) {
        if(obj == null) {
            return null;
        }

        if(obj === undefined) {
            return null;
        }

        return obj;
    };

    function getProxyConfig() {
        var proxyConfig = null;
        var proxyHost = System.getProperty("http.proxyHost");
        var proxyPortStr = System.getProperty("http.proxyPort");

        var proxyPort = -1;
        if(proxyHost != null) {
            proxyHost = proxyHost.trim();
        }

        if(proxyPortStr != null) {
            try {
                proxyPort = Integer.parseInt(proxyPortStr);

                if(!proxyHost == ""){
                    proxyConfig = new ProxyHost(proxyHost, proxyPort);
                }
            } catch (e) {
                //log.error(e.message, e);
                throw new Error(e);
            }
        }
        return proxyConfig;
    };
};

module.exports = XMLHttpRequest;