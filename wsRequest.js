var util = require("util");

var KerberosConfig                      = Java.type("org.apache.rampart.policy.model.KerberosConfig");
var RampartConfig                       = Java.type("org.apache.rampart.policy.model.RampartConfig");
var CryptoConfig                        = Java.type("org.apache.rampart.policy.model.CryptoConfig");
var OMElement                           = Java.type("org.apache.axiom.om.OMElement");
var OMNamespace                         = Java.type("org.apache.axiom.om.OMNamespace");
var OMNode                              = Java.type("org.apache.axiom.om.OMNode");
var SOAP11Constants                     = Java.type("org.apache.axiom.soap.SOAP11Constants");
var SOAP12Constants                     = Java.type("org.apache.axiom.soap.SOAP12Constants");
var StAXOMBuilder                       = Java.type("org.apache.axiom.om.impl.builder.StAXOMBuilder");
var OMSourcedElementImpl                = Java.type("org.apache.axiom.om.impl.llom.OMSourcedElementImpl");
var OMAbstractFactory                   = Java.type("org.apache.axiom.om.OMAbstractFactory");
var AXIOMUtil                           = Java.type("org.apache.axiom.om.util.AXIOMUtil");
var AxisFault                           = Java.type("org.apache.axis2.AxisFault");
var AxisBindingMessage                  = Java.type("org.apache.axis2.description.AxisBindingMessage");
var Utils                               = Java.type("org.apache.axis2.util.Utils");
var XMLUtils                            = Java.type("org.apache.axis2.util.XMLUtils");
var AxisService                         = Java.type("org.apache.axis2.description.AxisService");
var WSDL2Constants                      = Java.type("org.apache.axis2.description.WSDL2Constants");
var AxisEndpoint                        = Java.type("org.apache.axis2.description.AxisEndpoint");
var EndpointReference                   = Java.type("org.apache.axis2.addressing.EndpointReference");
var HttpTransportProperties             = Java.type("org.apache.axis2.transport.http.HttpTransportProperties");
var Constants                           = Java.type("org.apache.axis2.Constants");
var WSDLConstants                       = Java.type("org.apache.axis2.wsdl.WSDLConstants");
var ServiceClient                       = Java.type("org.apache.axis2.client.ServiceClient");
var WSDL2Constants                      = Java.type("org.apache.axis2.description.WSDL2Constants");
var JavaUtils                           = Java.type("org.apache.axis2.util.JavaUtils");
var AddressingConstants                 = Java.type("org.apache.axis2.addressing.AddressingConstants");
var Options                             = Java.type("org.apache.axis2.client.Options");
var HTTPConstants                       = Java.type("org.apache.axis2.transport.http.HTTPConstants");
var Header                              = Java.type("org.apache.commons.httpclient.Header");
var HttpMethod                          = Java.type("org.apache.commons.httpclient.HttpMethod");
var CookiePolicy                        = Java.type("org.apache.commons.httpclient.cookie.CookiePolicy");
var GetMethod                           = Java.type("org.apache.commons.httpclient.methods.GetMethod");
var HttpStatus                          = Java.type("org.apache.commons.httpclient.HttpStatus");
var FilenameUtils                       = Java.type("org.apache.commons.io.FilenameUtils");

var Policy                              = Java.type("org.apache.neethi.Policy");
var RampartMessageData                  = Java.type("org.apache.rampart.RampartMessageData");
var Definition                          = Java.type("javax.wsdl.Definition");
var Port                                = Java.type("javax.wsdl.Port");
var Service                             = Java.type("javax.wsdl.Service");
var HTTPAddress                         = Java.type("javax.wsdl.extensions.http.HTTPAddress");
var SOAPAddress                         = Java.type("javax.wsdl.extensions.soap.SOAPAddress");
var SOAP12Address                       = Java.type("javax.wsdl.extensions.soap12.SOAP12Address");
var WSDLFactory                         = Java.type("javax.wsdl.factory.WSDLFactory");
var WSDLReader                          = Java.type("javax.wsdl.xml.WSDLReader");

var XMLInputFactory                     = Java.type("javax.xml.stream.XMLInputFactory");
var XMLStreamException                  = Java.type("javax.xml.stream.XMLStreamException");
var XMLStreamReader                     = Java.type("javax.xml.stream.XMLStreamReader");
var WSHandlerConstants                  = Java.type("org.apache.ws.security.handler.WSHandlerConstants");
var PolicyEngine                        = Java.type("org.apache.neethi.PolicyEngine")
var QName                               = Java.type("javax.xml.namespace.QName");
var WSPasswordCallback                  = Java.type("org.apache.ws.security.WSPasswordCallback");
var ConfigurationContextFactory         = Java.type("org.apache.axis2.context.ConfigurationContextFactory");
var MultiThreadedHttpConnectionManager  = Java.type("org.apache.commons.httpclient.MultiThreadedHttpConnectionManager");
var UsernamePasswordCredentials         = Java.type("org.apache.commons.httpclient.UsernamePasswordCredentials");
var AuthScope                           = Java.type("org.apache.commons.httpclient.auth.AuthScope");

var List                        = Java.type("java.util.List");
var Properties                  = Java.type("java.util.Properties");
var File                        = Java.type("java.io.File");
var InputStream                 = Java.type("java.io.InputStream");
var StringReader                = Java.type("java.io.StringReader");
var ArrayList                   = Java.type("java.util.ArrayList");
var JavaBoolean                 = Java.type("java.lang.Boolean");
var SOAP12Address               = Java.type("javax.wsdl.extensions.soap12.SOAP12Address");
var MalformedURLException       = Java.type("java.net.MalformedURLException");
var URL                         = Java.type("java.net.URL");

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

function WSRequest() {

    //var serialVersionUID = (-4540679471306518117L);
    var IN_OUT = "in-out";
    var IN_ONLY = "in-only";
    var CLIENT_REPOSITORY_LOCATION = "Axis2Config.ClientRepositoryLocation";
    var CLIENT_AXIS2_XML_LOCATION = "Axis2Config.clientAxis2XmlLocation";

    var RAMPART = "rampart";
    var ADDRESSING = "addressing";

    this.responseText = null;
    this.responseXML = null;
    this.responseE4X = this.responseXML;
    this.readyState = 0;
    this.status;
    //this.getResponseHeader = getResponseHeader;
    this.onreadystatechange = null
    this.error = null;

    var async = true;
    var sender = null;
    var wsdlMode = false;
    var targetNamespace;
    var mep = IN_OUT;
    var soapHeaders = null;
    var rampartConfigs = null;
    var policy = null;
    var transportHeaders = null;
    var httpHeaders = null;

    var that = this;

    this.open = function(arguments) {
        if (that.readyState > 0 && that.readyState < 4) {
            throw new Error("Invalid readyState for WSRequest Hostobject : " + that.readyState);
        } else if (that.readyState == 4) {
            // reset private variables if readyState equals 4
            // readyState equals 4 means this object has been used earlier for an invocation.
            reset();
        }
        //this method using another jaggery host object.
        try {
            var configurationContext = ConfigurationContextFactory.
            createBasicConfigurationContext("META-INF/axis2_client.xml");
            sender = new ServiceClient(configurationContext, null);
            //sender = new ServiceClient(WSRequestServiceComponent.getConfigurationContext(), null);
        } catch (e) {
            print("---------------");
            throw new Error(e);
        }
        // Setting the cookie policy here
        setCommonProperties(setOptionsOpen(arguments));
    }

    /**
     * This function enables you to give a WSDL and get WSRequest configured. You dont have to
     * configure it your self using an options object.
     */
    this.openWSDL = function() {
        if (that.readyState > 0 && that.readyState < 4) {
            throw new Error("Invalid readyState for WSRequest Hostobject : " + that.readyState);
        } else if (that.readyState == 4) {
            // reset private variables if readyState equals 4
            // readyState equals 4 means this object has been used earlier for an invocation.
            reset();
        }
        wsdlMode = true;
        setCommonProperties(setOptionsOpenWSDL(arguments))
    }

    this.send = function() {
        var payload;
        var operationName = ServiceClient.ANON_OUT_IN_OP;
        if (wsdlMode && arguments.length != 2) {
            throw new Error("When the openWSDL method of WSRequest is used the send " +
                "function should be called with 2 parameters. The operation to invoke and " +
                "the payload");
        }
        if (arguments.length == 1) {
            payload = arguments[0];
        } else if (arguments.length == 2) {
            if (arguments[0] instanceof QName) {
                var qName = arguments[0];
                var uri = qName.getNamespaceURI();
                var localName = qName.getLocalPart();
                operationName = new QName(uri, localName);

            } else if (util.isString(arguments[0])) {
                if (targetNamespace == null) {
                    throw new Error("The targetNamespace of the service is null, please specify a " +
                        "QName for the operation name");
                }
                var localName = String(arguments[0]);
                operationName = new QName (targetNamespace, localName);
            } else {
                throw new Error("Invalid parameter type for the WSRequest.send() method");
            }
            payload = arguments[1];
        } else {
            throw new Error("Invalid no. of parameters for the WSRequest.send() method");
        }

        var payloadElement = null;
        if (that.readyState != 1) {
            throw new Error("Invalid readyState for the WSRequest Hostobject : " + that.readyState)
        }
        if (util.isString(payload)) {
            try {
                var parser = XMLInputFactory.newInstance()
                    .createXMLStreamReader(new StringReader(String(payload)));
                var builder = new StAXOMBuilder(parser);
                payloadElement = builder.getDocumentElement();
            } catch (e) {
                var message = "Invalid input for the payload in WSRequest Hostobject : " + payload;
                throw new Error(message);
            }
        } else if (false) {
            //-------------------- not done.
        }

        try {
            if (async) { // asynchronous call to send()
                var callback = new WSRequestCallback();
                setRampartConfigs(operationName);
                if (wsdlMode) {
                    // setSSLProperties(wsRequest);
                    var mepToUpper = mep.toUpperCase();
                    if (IN_ONLY == mepToUpper) {
                        sender.fireAndForget(operationName, payloadElement);
                        that.readyState = 4;
                    } else {
                        sender.sendReceiveNonBlocking(operationName, payloadElement, callback);
                        that.readyState = 2;
                    }
                } else {
                    //setSSLProperties(wsRequest);
                    if (IN_ONLY == mepToUpper) {
                        sender.fireAndForget(payloadElement);
                        that.readyState = 4;
                    } else {
                        sender.sendReceiveNonBlocking(payloadElement, callback);
                        that.readyState = 2;
                    }
                }
            } else {  // synchronous call to send()
                that.readyState = 2;
                // TODO do we need to call onreadystatechange here too
                setRampartConfigs(operationName);
                if(wsdlMode) {
                    // setSSLProperties(wsRequest);
                    if (IN_ONLY == mepToUpper) {
                        sender.fireAndForget(operationName, payloadElement);
                    } else {
                        updateResponse(sender.sendReceive(operationName, payloadElement));
                    }
                    that.readyState = 4;
                } else {
                    //setSSLProperties(wsRequest);
                    if (IN_ONLY == mepToUpper) {
                        sender.fireAndForget(payloadElement);
                    } else {
                        updateResponse(
                            sender.sendReceive(operationName, payloadElement));
                        //------------ not casted.
                        transportHeaders = sender.getLastOperationContext().getMessageContext("In").getProperty(MessageContext.TRANSPORT_HEADERS);

                    }
                    that.readyState = 4;
                }
            }

            if (that.onreadystatechange != null) {
                that.onreadystatechange();
            }
        } catch (e if e instanceof AxisFault) {
            //set get function change here these are mozilla functions.
            that.error = new WebServiceError();
            var detail = e.getDetail();
            if (detail != null) {
                that.error.detail = (detail.toString());
            }
            var faultCode = e.getFaultCode();
            if (faultCode != null) {
                that.error.code = (faultCode.toString());
            }
            that.error.reason = (e.getReason());
            var message = "Error occured while invoking the service";
            throw new Error(message);
        } catch (e) {
            that.error = new WebServiceError();
            that.error.detail(e.getMessage());
            var message = "Error occured while invoking the service";
            throw new Error(message);
        } finally {
            sender.cleanupTransport();
        }
    }

    /*
    function getResponseHeader() {
        if (arguments.length != 1) {
            throw new Error("invalid number of arguments");
        }
        return String(transportHeaders.get(String (arguments[0])));
    }  */

    function getBaseURI(currentURI) {
        try {
            var file = new File(currentURI);
            if (file.exists()) {
                return file.getCanonicalFile().getParentFile().toURI().toString();
            }
            var uriFragment = currentURI.substring(0, currentURI.lastIndexOf("/"));
            return uriFragment + (uriFragment.endsWith("/") ? "" : "/");
        } catch (e) {
            return null;
        }
    }

    function setJSONAsXML(response) {
        if (response.getDataSource() != null) {
            try {
                var jsonString = response.toStringWithConsume();
                that.responseText = jsonString;
                while (jsonString.indexOf("<?") == 0) {
                    jsonString = jsonString.substring(jsonString.indexOf("?>") + 2);
                }

                that.responseXML = {};
            } catch (e) {
                var message = "Error while converting JSON into XML";
                throw new Error(message);
            }
        }
    }

    function reset() {
        async = true;
        sender = null;
        that.readyState = 0;
    }
    //done but xml part is not done
    function setCommonProperties(optionsObj) {
        that.readyState = 1;

        if (that.onreadystatechange != null) {
            that.onreadystatechange();
        }

        var options = sender.getOptions();
        if (options == null) {
            options = new Options();
        }
        var timeout = 60000;

        if (optionsObj != null) {
            var mepObject = optionsObj.get("mep", optionsObj);
            if (mepObject != null && mepObject !== undefined) {
                var mepVlaue = mepObject.toString();
                var mepValueToUpper = mepVlaue.toUpperCase();
                if (IN_OUT == mepValueToUpper || IN_ONLY == mepValueToUpper) {
                    mep = mepVlaue;
                } else {
                    throw new Error("Invalid value for mep. Supported values are in-out and in-only");
                }
            }

            var timeoutObject = optionsObj.get("timeout", optionsObj);
            if (timeoutObject != null && timeoutObject !== undefined) {
                timeout = Number(timeoutObject.toString());
                //may be cause malfunction.Number() function;
            }

            var soapHeaderObject = optionsObj.get("SOAPHeaders", optionsObj);
            if (soapHeaderObject != null && soapHeaderObject !== undefined) {
                soapHeaders = soapHeaderObject;
            }

            var httpHeadersObject = optionsObj.get("HTTPHeaders", optionsObj);
            if (httpHeadersObject != null && httpHeadersObject !== undefined) {
                httpHeaders = httpHeadersObject;
            }

            var rampartConfigObject = optionsObj.get("rampart", optionsObj);
            if (rampartConfigObject != null && rampartConfigObject !== undefined &&
                util.isObject(rampartConfigObject)) {
                rampartConfigs = rampartConfigObject;
            }

            var policyObject = optionsObj.get("policy", optionsObj);
            //check if xml;
            if (policyObject != null && policyObject !== undefined /*&&
                policyObject is xml*/) {
                policy = policyObject;
            }
        }

        options.setProperty(HTTPConstants.SO_TIMEOUT, timeout);
        options.setProperty(HTTPConstants.CONNECTION_TIMEOUT, timeout);

        if (httpHeaders != null) {
            var httpHeadersArray = new ArrayList();
            var msg = "Invalid declaration for HTTPHeaders property";

            var id = httpHeaders.getIds();
            for (var i = 0; i < id.length; i++) {
                if (util.isObject(httpHeaders.get(id[i], httpHeaders))) {
                    var headerObject = httpHeaders.get(Number(id[i]), httpHeaders);

                    if (util.isString(headerObject.get("name", headerObject)) &&
                        util.isString(headerObject.get("value", headerObject))) {
                        httpHeadersArray.add(new Header(String (headerObject.get("name", headerObject)),
                            String (headerObject.get("value", headerObject))));
                    } else {
                        throw new Error(msg);
                    }
                } else {
                    throw new Error(msg);
                }
            }
            options.setProperty(HTTPConstants.HTTP_HEADERS, httpHeadersArray);
        }

        if (soapHeaders != null) {
            //Sets SOAPHeaders speficed in options object an array of name-value json objects
            var soapHeaderObject;
            var id = soapHeaders.getIds();
            for (var k = 0; k < id.length; k++) {
                soapHeaderObject = soapHeaders.get(Number(id), soapHeaders);
                if (util.isString(soapHeaderObject)) {
                    var header = String(soapHeaderObject);
                    try {
                        var soapHeaderOM = AXIOMUtil.stringToOM(header);
                        sender.addHeader(soapHeaderOM);
                    } catch (e) {
                        var message = "Error creating XML from the soap header : " + header;
                        throw new Error(message);
                    }
                } else if (false) {  // corrected here.
                    try {
                        sender.addHeader(AXIOMUtil.stringToOM(soapHeaderObject.toString()));
                    } catch (e) {
                        throw new Error(e);
                    }
                } else if (util.isObject(soapHeaderObject)) {
                    var uri;
                    var localName;

                    var o = soapHeaderObject.unwrap();//casting not done.

                    if (soapHeaderObject.get("qName",
                        soapHeaderObject) instanceof QName) {

                        var qName = soapHeaderObject.get("qName", soapHeaderObject); // casting not done.
                        uri = String(qName.getNamespaceURI());
                        localName = String (qName.getLocalPart());
                    } else {
                        throw new Error("No qName property found for the soap headers");
                    }
                    if (util.isString(soapHeaderObject.get("value", soapHeaderObject))) {
                        try {
                            sender.addStringHeader(new QName(uri, localName),
                                String (soapHeaderObject.get("value", soapHeaderObject)));
                        } catch (e) {
                            throw new Error(e);
                        }
                    } else if (/*soapHeaderObject.get("value", soapHeaderObject) instanceof */false ) {//xmlobjec not defined
                        var omNamespace = OMAbstractFactory.getOMFactory().createOMNamespace(uri, null);
                        var headerBlock = OMAbstractFactory.getSOAP12Factory().
                            createSOAPHeaderBlock(localName, omNamespace);
                        try {
                            headerBlock.addChild(AXIOMUtil.stringToOM(soapHeaderObject.get("value", soapHeaderObject).toString()));
                        } catch (e) {
                            throw new Error(e);
                        }
                        sender.addHeader(headerBlock);
                    } else {
                        throw new Error("Invalid property found for the soap headers")
                    }
                }
            }
        }
    }

    function setOptionsOpen(args) {
        var optionsObj = null;
        var options = sender.getOptions();
        var httpMethod = "post";
        // set true by default to use SOAP 1.2
        var useSOAP = "true";
        var useWSA = null;
        var action = null;
        var username = null;
        var password = null;
        var url;
        var httpLocation = null;
        var httpLocationIgnoreUncited = null;
        var httpQueryParameterSeparator = "&";
        var httpInputSerialization = null;
        var httpContentEncoding = null;

        switch (args.length) {
            case 0:
                throw new Error("INVALID_SYNTAX_EXCEPTION");
            case 1:
                throw new Error("INVALID_SYNTAX_EXCEPTION");
            case 2:
                break;
            case 3:
                if (util.isBoolean(args[2])) {
                    async = Boolean(args[2]);
                } else if (util.isString(args[2])) {
                    username = String(args[2]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                break;
            case 4:
                if (util.isString(args[2])) {
                    username = String(args[2]);
                    if (util.isString(args[3])) {
                        password = String(args[3]);
                    } else {
                        throw new Error("INVALID_SYNTAX_EXCEPTION");
                    }
                } else if (util.isBoolean(args[2])) {
                    async = Boolean(args[2]);
                    if (util.isString(args[3])) {
                        username = String(args[3]);
                    } else {
                        throw new Error("INVALID_SYNTAX_EXCEPTION");
                    }
                } else {
                     throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                break;
            case 5:
                if (util.isBoolean(args[2])) {
                    async = Boolean(args[2]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                if (util.isString(args[3])) {
                    username = String(args[3]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                if (util.isString(args[4])) {
                    password = String(args[4]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                break;
            default:
                throw new Error("INVALID_SYNTAX_EXCEPTION");
        }

        if (util.isString(args[1])) {
            url = String(args[1]);
        } else {
            throw new Error("INVALID_SYNTAX_EXCEPTION");
        }

        if (util.isString(args[0])) {
            httpMethod = String(args[0]);
            useSOAP = "false";
        } else if (false) {

        }

        options.setProperty(HTTPConstants.CHUNKED, Boolean.FALSE);
        options.setProperty(HTTPConstants.COOKIE_POLICY, CookiePolicy.IGNORE_COOKIES);
        var targetEPR = new EndpointReference(url);
        options.setTo(targetEPR);

        if (username != null) {
            // handle basic authentication
            // set username if not null
            var authenticator = new HttpTransportProperties.Authenticator();
            authenticator.setUsername(username);
            if (password != null) { // set password if present
                authenticator.setPassword(password);
            }
            authenticator.setPreemptiveAuthentication(true);
            options.setProperty(HTTPConstants.AUTHENTICATE, authenticator);
        }

        //handle useSOAP options.
        if (useSOAP == "1.1") {
            options.setSoapVersionURI(SOAP11Constants.SOAP_ENVELOPE_NAMESPACE_URI);
        } else if ((useSOAP == ("1.2")) || (useSoapToUpper == ("TRUE"))) {
            options.setSoapVersionURI(SOAP12Constants.SOAP_ENVELOPE_NAMESPACE_URI);
        } else if (useSoapToUpper ==  ("FALSE")) {
            options.setProperty(Constants.Configuration.ENABLE_REST, Constants.VALUE_TRUE);
        } else {
            throw new Error("INVALID_SYNTAX_EXCEPTION");
        }

        if (httpMethod != null) {
            var httpMethodToUpper = httpMethod.toUpperCase();
            var httpMethodGetToUpper = (Constants.Configuration.HTTP_METHOD_GET).toUpperCase();
            var httpMethodPostToUpper =(Constants.Configuration.HTTP_METHOD_POST).toUpperCase();
            var httpMethodDeleteToUpper =(Constants.Configuration.HTTP_METHOD_DELETE).toUpperCase();
            var httpMethodPutToUpper = (Constants.Configuration.HTTP_METHOD_PUT).toUpperCase();
            var useSoapToUpper = useSOAP.toUpperCase();

            if (httpMethodToUpper == httpMethodGetToUpper) {
                // If useSOAP is not false then the HTTPMethod must be POST
                if (useSoapToUpper != "FALSE") {
                    throw new Error("INVALID_SYNTAX_EXCEPTION. Cannot have the value of useSOAP true, when the HTTPMethod is 'GET'")
                }
                options.setProperty(Constants.Configuration.HTTP_METHOD,
                    Constants.Configuration.HTTP_METHOD_GET);
                options.setProperty(Constants.Configuration.ENABLE_REST, Constants.VALUE_TRUE);
            } else if (httpMethodToUpper == httpMethodPostToUpper) {
                options.setProperty(Constants.Configuration.HTTP_METHOD,
                    Constants.Configuration.HTTP_METHOD_POST);
            } else if (httpMethodToUpper ==  httpMethodDeleteToUpper) {
                // If useSOAP is not false then the HTTPMethod must be POST
                if (useSoapToUpper != "FALSE") {
                    throw new Error("INVALID_SYNTAX_EXCEPTION. Cannot have the value of useSOAP true, when the HTTPMethod is 'DELETE'");
                }
                options.setProperty(Constants.Configuration.HTTP_METHOD,
                    Constants.Configuration.HTTP_METHOD_DELETE);
                options.setProperty(Constants.Configuration.ENABLE_REST, Constants.VALUE_TRUE);
            } else if (httpMethodToUpper == httpMethodPutToUpper) {
                // If useSOAP is not false then the HTTPMethod must be POST
                if (useSoapToUpper != "FALSE") {
                    throw new Error("INVALID_SYNTAX_EXCEPTION. Cannot have the value of useSOAP true, when the HTTPMethod is 'PUT'");
                }
                options.setProperty(Constants.Configuration.HTTP_METHOD,
                    Constants.Configuration.HTTP_METHOD_PUT);
                options.setProperty(Constants.Configuration.ENABLE_REST, Constants.VALUE_TRUE);
            } else {
                throw new Error("INVALID_SYNTAX_EXCEPTION. Unsupported HTTP method.");
            }
        }

        if (httpLocation != null) {
            options.setProperty(WSDL2Constants.ATTR_WHTTP_LOCATION, httpLocation);
        }

        if (httpLocationIgnoreUncited != null) {
            options.setProperty(WSDL2Constants.ATTR_WHTTP_IGNORE_UNCITED,
                JavaUtils.isTrueExplicitly(httpLocationIgnoreUncited));
        }

        if (httpQueryParameterSeparator != null) {
            options.setProperty(WSDL2Constants.ATTR_WHTTP_QUERY_PARAMETER_SEPARATOR,
                httpQueryParameterSeparator);
        }

        if (httpInputSerialization != null) {
            options.setProperty(WSDL2Constants.ATTR_WHTTP_INPUT_SERIALIZATION,
                httpInputSerialization);
            options.setProperty(Constants.Configuration.MESSAGE_TYPE, httpInputSerialization);
        }

        if (httpContentEncoding != null) {
            if (("gzip" == httpContentEncoding) || ("compress" == httpContentEncoding)) {
                options.setProperty("HTTPConstants.MC_GZIP_REQUEST", "true");
            }
        }
         //not no this equation is correct or not.
        var useWSAToUpper = useWSA.toUpperCase();
        if ((useWSA != null) && useWSA == "1.0" || (useWSAToUpper == "TRUE") ||
            useWSAToUpper == "SUBMISSION") {
            if (useWSAToUpper == "SUBMISSION") {
                // set addressing to WSA submission version.
                // WSA submission
                // version
                options.setProperty(AddressingConstants.WS_ADDRESSING_VERSION,
                    AddressingConstants.Submission.WSA_NAMESPACE);
            } else {
                options.setProperty(AddressingConstants.WS_ADDRESSING_VERSION,
                    AddressingConstants.Final.WSA_NAMESPACE);
            }
            if (action != null) {
                try {
                    sender.engageModule(Constants.MODULE_ADDRESSING);
                } catch (e) {
                    throw new Error(e);
                }
                options.setAction(action);
            } else {
                throw new Error("INVALID_SYNTAX_EXCEPTION. Action is NULL when useWSA is true.");
            }
            if (optionsObj != null) {
                var fromObject = optionsObj.get("from", optionsObj);
                if (fromObject != null && (fromObject !== undefined) ) {
                    options.setFrom(new EndpointReference(fromObject.toString()));
                }
                var replyToObject = optionsObj.get("replyTo", optionsObj);
                if (replyToObject != null && (replyToObject !== undefined)) {
                    options.setReplyTo(new EndpointReference(replyToObject.toString()));
                }
                var faultToObject = optionsObj.get("faultTo", optionsObj);
                if (faultToObject != null && (faultToObject !== undefined)) {
                    options.setFaultTo(new EndpointReference(faultToObject.toString()));
                }
            }
        } else {
            sender.disengageModule(Constants.MODULE_ADDRESSING);
            if (action != null) {
                options.setProperty(Constants.Configuration.DISABLE_SOAP_ACTION, "false");
                options.setAction(action);
            }
        }
        return optionsObj;
    }

    //method from hostObjectUtil
    function getURL(urlString, username, password) {
        var method = new GetMethod(urlString);
        var url = new URL(urlString);
        var connectionManager = new MultiThreadedHttpConnectionManager();
        var httpClient = new HttpClient(connectionManager);
        // We should not use method.setURI and set the complete URI here.
        // If we do so commons-httpclient will not use our custom socket factory.
        // Hence we set the path and query separatly
        method.setPath(url.getPath());
        method.setQueryString(url.getQuery());
        method.setRequestHeader("Host", url.getHost());
        method.getParams().setCookiePolicy(CookiePolicy.IGNORE_COOKIES);

        // If a username and a password is provided we support basic auth
        if ((username != null) && (password != null)) {
            var creds = new UsernamePasswordCredentials(username, password);
            var port = url.getPort();
            httpClient.getState()
                .setCredentials(new AuthScope(url.getHost(), port), creds);
        }
        return httpClient.executeMethod(method);
    }

    function setOptionsOpenWSDL(args) {
        var object;
        var wsdlURL;
        var serviceQName = null;
        var endPointName = null;
        switch (args.length) {
            case 0:
                throw new Error("INVALID_SYNTAX_EXCEPTION");
            case 1:
                throw new Error("INVALID_SYNTAX_EXCEPTION");
            case 2:
                if (util.isString(args[0])) {
                    wsdlURL = String (args[0]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                if (util.isBoolean (args[1])) {
                    async = Boolean (args[1]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                break;
            case 3:
                if (util.isString(args[0])) {
                    wsdlURL = String (args[0]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                if (util.isBoolean (args[1])) {
                    async = Boolean (args[1]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                if (util.isObject(args[2])) {
                    object = args[2];
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                break;
            case 5:
                if (util.isString(args[0])) {
                    wsdlURL = String (args[0]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                if (util.isBoolean (args[1])) {
                    async = Boolean (args[1]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                if (util.isObject(args[2])) {
                    object = args[2];
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                if (args[3] instanceof QName) {
                    var qName = args[3];
                    var uri = qName.getNamespaceURI();
                    var localName = qName.getLocalPart();
                    serviceQName = new QName(uri, localName);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                if (util.isString(args[4])) {
                    endPointName = String (args[4]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }

                wsdlMode = true;
                break;
            default :
                throw new Error("INVALID_SYNTAX_EXCEPTION");
        }

        var method = new GetMethod(wsdlURL);
        try {
            var statusCode = getURL(wsdlURL, null, null);
            if (statusCode != HttpStatus.SC_OK) {
                throw new Error("An error occured while getting the resource at " + wsdlURL + ". Reason :" +
                    method.getStatusLine());
            }
            var doc = XMLUtils.newDocument(method.getResponseBodyAsStream());
            var reader = WSDLFactory.newInstance().newWSDLReader();
            reader.setFeature("javax.wsdl.importDocuments", true);
            var definition = reader.readWSDL(getBaseURI(wsdlURL), doc);
            targetNamespace = definition.getTargetNamespace();
            var service;
            var returnPort;
            if (serviceQName == null) {
                var services = definition.getServices();
                service = null;
                var serviceValue = services.values();
                for (var i = 0; i < serviceValue.length; i++) {
                    service = serviceValue[i];
                    if (service.getPorts().size() > 0) {
                        //i.e we have found a service with ports
                        break;
                    }
                }
                if (service == null) {
                    throw new Error("The WSDL given does not contain any services " + "that has ports");
                }
                var ports = service.getPorts();
                var port;
                returnPort = null;
                var portsIterator = ports.values().iterator();
                while (portsIterator.hasNext()) {
                    if (returnPort == null) {
                        port = portsIterator.next();
                        var extensibilityElements = port.getExtensibilityElements();
                        for (var k = 0; k < extensibilityElements.length; k++) {
                            if(extensibilityElements[k] instanceof  SOAPAddress) {
                                // SOAP 1.1 address found - keep this and loop until http address is found
                                returnPort = port;
                                var location =  extensibilityElements[k].getLocationURI().trim();
                                if (location != null && Location.startsWith("http:")) {
                                    // i.e we have found an http port so return from here
                                    break;
                                }
                            }
                        }
                    } else {
                        break;
                    }
                }

                if(returnPort == null) {
                    var object = ports.values();
                    for(var i = 0; i < object.length; i++) {
                        port = object[i];
                        var extensibilityElements = port.getExtensibilityElements();
                        for (var k = 0; k < extensibilityElements.size(); i++) {
                            if (extensibilityElements[k] instanceof SOAP12Address) {
                                // SOAP 1.2 address found - keep this and loop until http address is found.
                                returnPort = port;
                                var location = extensibilityElements[k].getLocationURI().trim();
                                if((location != null) && location.startsWith("http:")) {
                                    // i.e we have found an http port so return from here
                                    break;
                                }
                            }
                        }
                    }

                    if (returnPort == null) {
                        var object = ports.values();
                        for (var i = 0; i < object.length; i++) {
                            port = object[i];
                            var extensibilityElements = port.getExtensibilityElements();
                            for (var k = 0; k < extensibilityElements.size(); k++) {
                                if (extensibilityElements[k] instanceof HTTPAddress) {
                                    // HTTP address found - keep this and loop until http address is found
                                    returnPort = port;
                                    //casting is not done.
                                    var location = extensibilityElements[k].getLocationURI().trim();
                                    if ((location != null) && location.startsWith("http:")) {
                                        // i.e we have found an http port so return from here
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (returnPort == null) {
                    throw new Error("The WSDL given does not contain any ports " +
                        "that use the http transport");
                } else {
                    serviceQName = service.getQName();
                    endpointName = returnPort.getName();
                }
            }
            sender = new ServiceClient(null, definition, serviceQName, endpointName);
        } catch (e if e instanceof MalformedURLException) { // not no if correct.test;
            var message = "Malformed URL : " + wsdlURL;
            throw new Error(message);
        } catch (e) {
            var message = "Error occurred while reading the WSDL content from the URL : " + wsdlURL;
            throw new Error(e);
        } finally {
            // Release the connection.
            method.releaseConnection();
        }
        return object;
    }

    function getObjectProperty(object, property) {
        if(util.isString(object[property])) {
            return String (object[property]);
        } else {
            return null;
        }
    }

    function getCryptoConfig(crypto) {
        var merlinProp = new Properties();
        var file = new File(FilenameUtils.normalizeNoEndSeparator(getObjectProperty(crypto, "file")))
        merlinProp.put("org.apache.ws.security.crypto.merlin.file", file.getAbsolutePath());
        merlinProp.put("org.apache.ws.security.crypto.merlin.keystore.type", getObjectProperty(crypto, "type"));
        merlinProp.put("org.apache.ws.security.crypto.merlin.keystore.password", getObjectProperty(crypto, "password"));
        var cryptoConfig = new CryptoConfig();
        cryptoConfig.setProvider("org.apache.ws.security.components.crypto.Merlin");
        cryptoConfig.setProp(merlinProp);
        var property = crypto.get(CryptoConfig.CACHE_ENABLED, crypto);
        if ((util.isBoolean(property) && property) ||
            (util.isString(property) && JavaBoolean.parse(String(property)))) {
            cryptoConfig.setCacheEnabled(true);
            cryptoConfig.setCryptoKey("org.apache.ws.security.crypto.merlin.file");
        } else if (property != null && property !== undefined) {
            throw new Error("Invalid vonreadystatechangealue for property '" + CryptoConfig.CACHE_ENABLED +
                "' in rampart configuration");
        }

        property = crypto.get(CryptoConfig.CACHE_REFRESH_INTVL, crypto);
        if (util.isNumber(property)) {
            cryptoConfig.setCacheRefreshInterval(String(property));       //--dont know write
        } else if (util.isString(property)) {
            cryptoConfig.setCacheRefreshInterval(String (property));
        } else if (property != null && property !== undefined) {
            throw new Error("Invalid value for property '" + CryptoConfig.CACHE_REFRESH_INTVL +
                "' in rampart configuration");
        }
        return cryptoConfig;
    }

    function getKerberosConfigs(config) {
        var kerberosConfig = new KerberosConfig();
        var properties = new Properties();
        var objects = Object.keys(config);
        for (var i = 0; i < objects.length; i++) {
            if (util.isString(objects[i])) {
                var property = String(objects[i]);
                var value = config.get(property, config);
                if (util.isString(value)) {
                    properties.setProperty(property, String(value));
                } else {
                    throw new Error("Invalid config value for the property : " + property +
                        " in Kerberos Config");
                }
            } else {
                throw new Error("Invalid property in Kerberos Config");
            }
        }
        kerberosConfig.setProp(properties);
        return kerberosConfig;
    }

    function setRampartConfigs(operationName) {
        var rampartConfig = null;
        var useUT = false;
        var rampartPolicy = null;
        if(policy != null) {
            var policyElement;
            var node = AXIOMUtil.stringToOM(policy.toString());
            if (node instanceof OMElement) {
                policyElement = node;
            } else {
                throw new Error("INVALID_INPUT_EXCEPTION. Invalid input was : " + policy);
            }

            rampartPolicy = PolicyEngine.getPolicy(policyElement);
            var list = rampartPolicy.getAlternatives().next();

            for (var i = 0; i < list.size(); i++) {
                if(list[i] instanceof RampartConfig) {
                    rampartConfig = list[i];
                    filterRampartConfig(rampartConfig);
                    break;
                }
            }
        }

        if (rampartConfigs != null) {
            if (rampartConfig == null) {
                rampartConfig = new RampartConfig();
                var property = getObjectProperty(rampartConfigs, RampartConfig.USER_CERT_ALIAS_LN);
                if(property != null) {
                    rampartConfig.setUserCertAlias(property);
                }
                property = getObjectProperty(rampartConfigs, RampartConfig.STS_ALIAS_LN);
                if(property != null) {
                    rampartConfig.setStsAlias(property);
                }
                property = getObjectProperty(rampartConfigs, RampartConfig.ENCRYPTION_USER_LN);
                if(property != null) {
                    rampartConfig.setEncryptionUser(property);
                }

                var obj = rampartConfigs.get(RampartConfig.TS_TTL_LN, rampartConfigs);
                if (util.isNumber(obj)) {
                    rampartConfig.setTimestampTTL(String(obj));
                } else if (util.isString(obj)) {
                    rampartConfig.setTimestampTTL(String(obj));
                } else if (obj != null && (obj !== undefined)) {
                    throw new Error("Invalid value for property '" + RampartConfig.TS_MAX_SKEW_LN +
                        "' in rampart configuration");
                }

                obj = rampartConfigs.get(RampartConfig.TS_MAX_SKEW_LN, rampartConfigs);
                if (util.isNumber(obj)) {
                    rampartConfig.setTimestampMaxSkew(String(obj));
                } else if (util.isString(obj)) {
                    rampartConfig.setTimestampMaxSkew(String (obj));
                } else if (obj != null && obj !== undefined) {
                    throw new Error("Invalid value for property '" + RampartConfig.TS_MAX_SKEW_LN +
                        "' in rampart configuration")
                }

                obj = rampartConfigs.get(RampartConfig.TS_PRECISION_IN_MS_LN, rampartConfigs);
                if (util.isNumber(obj)) {
                    rampartConfig.setTimestampPrecisionInMilliseconds(String(obj));
                } else if (util.isString(obj)) {
                    rampartConfig.setTimestampPrecisionInMilliseconds(String(obj));
                } else if (obj != null && obj !== undefined) {
                    throw new Error("Invalid value for property '" + RampartConfig.TS_PRECISION_IN_MS_LN +
                        "' in rampart configuration");
                }

                var cryptoObject = rampartConfigs.get(RampartConfig.SIG_CRYPTO_LN, rampartConfigs);
                if (util.isObject(cryptoObject)) {
                    rampartConfig.setSigCryptoConfig(getCryptoConfig(cryptoObject));
                }

                cryptoObject = rampartConfigs.get(RampartConfig.ENCR_CRYPTO_LN, rampartConfigs);
                if (util.isObject(cryptoObject)) {
                    rampartConfig.setEncrCryptoConfig(getCryptoConfig(cryptoObject));
                }

                cryptoObject = rampartConfigs.get(RampartConfig.DEC_CRYPTO_LN, rampartConfigs);
                if (util.isObject(cryptoObject)) {
                    rampartConfig.setEncrCryptoConfig(getCryptoConfig(cryptoObject));
                }

                cryptoObject = rampartConfigs.get(RampartConfig.STS_CRYPTO_LN, rampartConfigs);
                if (util.isObject(cryptoObject)) {
                    rampartConfig.setSigCryptoConfig(getCryptoConfig(cryptoObject));
                }

                var kerberosConfig = rampartConfigs.get(RampartConfig.KERBEROS_CONFIG, rampartConfigs);
                if (util.isObject(kerberosConfig)) {
                    rampartConfig.setKerberosConfig(getKerberosConfigs(kerberosConfig));
                }
            }

            var passwordCallbackHandler = PasswordCallbackHandler;
            sender.getAxisService().addParameter(WSHandlerConstants.PW_CALLBACK_REF,
                passwordCallbackHandler);
            var property = getObjectProperty(rampartConfigs, RampartConfig.USER_LN);
            if (property != null) {
                rampartConfig.setUser(property);
                useUT = true;
            }
            property = getObjectProperty(rampartConfigs, "userPassword");
            if (property != null) {
                //passwordCallbackHandler.setUserPassword(property);
                userPassword = property;
            }
            property = getObjectProperty(rampartConfigs, "keyPassword");
            if (property != null) {
                //passwordCallbackHandler.setKeyPassword(property);
                keyPassword = property;
            }

            if(rampartPolicy == null) {
                if(wsdlMode) {
                    var axisService = sender.getAxisService();
                    if(axisService.getChild(operationName) == null) {
                        throw new Error("No operation with the name " + operationName.getLocalPart() +
                            " found in the service been called");
                    }

                    var axisEndpoint = axisService.getEndpoint(axisService.getEndpointName());
                    var axisBindingMessage = axisEndpoint.getBinding().getChild(operationName)
                        .getChild(WSDLConstants.MESSAGE_LABEL_IN_VALUE);
                    rampartPolicy = axisBindingMessage.getEffectivePolicy();
                } else if (useUT) {
                    var xmlPath = "scenarios/scenario1-policy.xml";
                    try {

                        /////---------------- need change here.
                        var policyXMLStream = "";   //need to use get resource as stream.
                        var builder = new StAXOMBuilder(policyXMLStream);
                        rampartPolicy = PolicyEngine.getPolicy(builder.getDocumentElement());
                    } catch (e) {
                        var message = "Error loading/parsing default UT policy from the server";
                        throw new Error(message);
                    }
                }
            }
            if (rampartPolicy != null) {
                if(rampartConfig != null) {
                    rampartPolicy.addAssertion(rampartConfig);
                } else {
                    throw new Error("A policy has been specified either in your mashup or in the WSDL. " +
                        "But the Rampart Configuration cannot be found.");
                }
                sender.getOptions().setProperty(RampartMessageData.KEY_RAMPART_POLICY, rampartPolicy);
                sender.engageModule(RAMPART);
                sender.engageModule(ADDRESSING);
            }
        }
    }

    function filterRampartConfig(config) {
        var crypto = config.getSigCryptoConfig();
        if(crypto != null) {
            filterCryptoConfig(crypto);
        }
        crypto = config.getEncrCryptoConfig();
        if (crypto != null) {
            filterCryptoConfig(crypto);
        }
        crypto = config.getDecCryptoConfig();
        if (crypto != null) {
            filterCryptoConfig(crypto);
        }
        crypto = config.getStsCryptoConfig();
        if (crypto != null) {
            filterCryptoConfig(crypto);
        }

        var kerberosConfig = config.getKerberosConfig();
        if(kerberosConfig != null) {
            var properties = KerberosConfig.getProp();
            var stringPropertyNames = properties.stringPropertyNames();
            for(var i = 0; i < stringPropertyNames; i++) {
                properties.setProperty(stringPropertyNames[i],properties.getProperty(stringPropertyNames[i]));
            }
        }
    }

    function filterCryptoConfig(config) {
        var properties = config.getProp();
        properties.setProperty("org.apache.ws.security.crypto.merlin.file",
            properties.getProperty("org.apache.ws.security.crypto.merlin.file"));
    }

    //not completed
    function updateResponse(response) {
        if (response instanceof OMSourcedElementImpl) {
            var sourcedElement = response;  //--- not casted
            setJSONAsXML(sourcedElement);
        } else if (response != null) {
            that.responseText = response.toStringWithConsume();
            that.responseXML = {};
        }
    }

    var userPassword = null;
    var keyPassword = null;

    var PasswordCallbackHandler = new javax.security.auth.callback.CallbackHandler () {

        handle:function(callbacks) {
            var callbacksLength = callbacks.length;
            for (var i = 0; i < callbacksLength; i++) {
                if (callbacks[i] instanceof WSPasswordCallback) {
                    var passwordCallback = callbacks[i];

                    switch (passwordCallback.getUsage()) {
                        case WSPasswordCallback.SIGNATURE:
                        case WSPasswordCallback.DECRYPT:
                            passwordCallback.setPassword(keyPassword);
                            break;
                        case WSPasswordCallback.USERNAME_TOKEN:
                            passwordCallback.setPassword(userPassword);
                            break;
                    }
                } else {
                    throw new javax.security.auth.callback.UnsupportedCallbackException(callbacks[i], "Unrecognized Callback");
                }
            }
        }
    }

    function processError (exception) {
        if (exception instanceof AxisFault) {
            var detail = exception.getDetail();
            if (detail != null) {
                that.error.detail = detail.toString();
            }
            var faultCode = exception.getFaultCode();
            if (faultCode != null) {
                that.error.code = faultCode.toString();
            }
            that.error.reson = exception.getReson();
        } else {
            var cause = exception.getCause();
            if (cause != null) {
                that.error.detail = cause.toString();
            }
            that.error.code = "No SOAP Body";
            that.error.reson = exception.getMessage();

        }
        that.readyState = 4;
        if (that.onreadystatechange != null) {
            that.onreadystatechange();
        }
    }

    var WSRequestCallback = new org.apache.axis2.client.async.AxisCallback() {

        onComplete:function() {

        },

        onError:function (ex) {
            that.error = new WebServiceError();
            processError(ex);
        },

        onFault:function (messageContext) {
            var fault = Utils.getInboundFaultFromMessageContext(messageContext);
            processError(fault);
        },

        onMessage:function (messageContext) {
            try {
                updateResponse(messageContext.getEnvelope().getBody().getFirstElement());
                that.readyState = 4;
                if (that.onreadystatechange != null) {
                    that.onreadystatechange();
                }
            } catch (e) {
                throw new Error(e);
            }
        }
    }

    function WebServiceError () {
        this.code;
        this.detail;
        this.reson;

        var that = this;

        var argLength = arguments.length;
        switch (argLength) {
            case 0:
                throw new Error("INVALID_SYNTAX_EXCEPTION");
            case 1:
                if (arguments[0] instanceof WebServiceError) {
                    return args[0];
                }
                if (util.isString(arguments[0])) {
                    that.reson = String(arguments[0]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                break;
            case 2:
                if (util.isString(arguments[0])) {
                    that.reson = String(arguments[0]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                if (util.isString(arguments[1])) {
                    that.detail = String(arguments[1]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                break;
            case 3:
                if (util.isString(arguments[0])) {
                    that.reson = String(arguments[0]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                if (util.isString(arguments[1])) {
                    that.detail = String(arguments[1]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                if (util.isString(arguments[2])) {
                    that.code = String(arguments[2]);
                } else {
                    throw new Error("INVALID_SYNTAX_EXCEPTION");
                }
                break;
            default:
                throw new Error("INVALID_SYNTAX_EXCEPTION");
        }
    }

}

/*
// org.jaggeryjs.hostobjects.ws.internal class
function WSRequestServiceComponent() {

}

WSRequestServiceComponent.configurationContextService = null;

WSRequestServiceComponent.getConfigurationContext = function() {
    if(WSRequestServiceComponent.configurationContextService != null) {
        return WSRequestServiceComponent.configurationContextService.getClientConfigContext();
    } else {
        var msg = "ConfigurationContextService cannot be found";
        return null;
    }
}
*/
  print("buddhi");
module.exports = WSRequest;





