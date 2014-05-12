var util = require("util");

var OMElement               = Java.type("org.apache.axiom.om.OMElement");
var DataHandler             = Java.type("javax.activation.DataHandler");
var InternetAddress         = Java.type("javax.mail.internet.InternetAddress");
var MimeBodyPart            = Java.type("javax.mail.internet.MimeBodyPart");
var ByteArrayDataSource     = Java.type("javax.mail.util.ByteArrayDataSource");
var Session                 = Java.type("javax.mail.Session");
var Transport               = Java.type("javax.mail.Transport");
var Message                 = Java.type("javax.mail.Message");
var Authenticator           = Java.type("javax.mail.Authenticator");
var MimeMessage             = Java.type("javax.mail.internet.MimeMessage");
var MimeMultipart           = Java.type("javax.mail.internet.MimeMultipart");
var PasswordAuthentication  = Java.type("javax.mail.PasswordAuthentication");
var DataSource              = Java.type("javax.activation.DataSource");

var InputStream             = Java.type("java.io.InputStream");
var OutputStream            = Java.type("java.io.OutputStream");
var Thread                  = Java.type("java.lang.Thread");
var Properties              = Java.type("java.util.Properties");
var Files                    = Java.type("java.io.File");

function sender() {
    var host,username, password, tls;
    var port = null;

    var props,
        message,
        multipart;

    /**that variable is used to make the object available to the private methods.
     * This is a workaround for an error in the ECMAScript Language Specification which causes
     * this to be set incorrectly for inner functions.*/
    var that = this;

    /**
     * can be array or a single value*/
    this.to = null;
    this.cc = null;
    this.bcc = null;
    this.from = null;
    this.subject = null;
    this.text = null;
    this.html = null;
    this.addAttachment = addAttachment;

    var property = new Properties();
    props = property;

    multipart = new MimeMultipart();

    var argLength = arguments.length;
    if(argLength == 5) {
        host = String(arguments[0]);
        port = String(arguments[1]);
        username = String(arguments[2]);
        password = String(arguments[3]);
        tls = String(arguments[4]);

        if("tls" == tls) {
            property.put("mail.smtp.starttls.enable", "true");
        } else {
            throw new Error("Fifth property has to be : tls");
        }
    } else if(argLength == 4) {
        host = String(arguments[0]);
        port = String(arguments[1]);
        username = String(arguments[2]);
        password = String(arguments[3]);

        property.put("mail.smtp.starttls.enable", "false");
    } else {
        throw new Error("Incorrect number of arguments. Please specify host, username, " +
            "password or host, port, username, password");
    };

    if(host == null) {
        throw new Error("Invalid host name. Please recheck the given details ");
    };

    property.put("mail.smtp.host", host);

    if(port == null) {
        property.put("mail.smtp.port", port);
    };

    if(username != null) {
        property.put("mail.smtp.auth", "true");
    };

    /**this in not a mistake. use without () as in object initialization*/
    var SMTPAuthenticator = new Authenticator {
        getPasswordAuthentication:function() {
            return new PasswordAuthentication(username, password);
        }
    };

    var session = Session.getInstance(props, SMTPAuthenticator);
    message = new MimeMessage(session);

    /**
     * check params before send mail.*/
    function checkParam() {
        if(that.from != null && that.to != null) {
            setFrom();
            setTo();
            setText();
            SetSubject();
            setBcc();
            setCC();
            setHtml();
        } else {
            throw new Error("cannot send mail.adderesses are not defined.");
        }
    };

    //not completed  check file permissions
    function addAttachment(filePath) {
        if(filePath) {
           if(util.isArray(filePath)) {
               for(var i = 0; i < filePath.length; i++) {
                   var file = new Files(filePath);
               }
           } else if(util.isString(filePath)) {
               var file = new Files(filePath);
           }

            var messageBodyPart = new MimeBodyPart();
            var source  = new DataSource () {
                getInputStream : function() {
                    try {
                        return new FileInputStream(file);
                    } catch(e) {
                        throw new Error(e);
                    }
                },
                getOutputStream : function() {
                    try {
                        return new FileOutputStream(file);
                    } catch(e) {
                        throw new Error(e);
                    }
                },
                getContentType : function() {
                    return null;
                },
                getName : function() {
                    try {
                        return file.getName();
                    } catch(e) {
                        throw new Error(e);
                    }
                    return null;
                }
            };

            try {
                messageBodyPart.setDataHandler(new DataHandler(source));
                messageBodyPart.setFileName(file.getName());
                multipart.addBodyPart(messageBodyPart);
            } catch(e) {
                throw new Error(e);
            }
        }
    };

    /**
     * <p>The body text of the mail been sent</p>
     * <pre>
     * sender.text = "WSO2 Jaggery.js.";
     * </pre>
     */
    function setText() {
        var messageBodyPart = new MimeBodyPart();

        try{
            if(that.text != null || that.text) {
                messageBodyPart.setText(that.text);
            }
            multipart.addBodyPart(messageBodyPart);
        }catch(e) {
            throw new Error(e);
        }
    }

    /**
     * <p>The subject of the mail been sent</p>
     * <pre>
     * sender.subject = "WSO2 Mashup server 1.0 Released";
     * </pre>
     */
    function SetSubject() {
        try {
            message.setSubject(that.subject);
        } catch(e) {
            throw new Error(e);
        }
    }

    function setTo() {
        addRecipients(Message.RecipientType.TO, that.to);
    }

    /**
     * <p>The bcc address that the mail is sent to</p>
     * <pre>
     * sender.bcc = "keith@wso2.com";
     *
     * OR
     *
     * var bcc = new Array();
     * bcc[0] = "jonathan@wso2.com";
     * bcc[1] =  "keith@wso2.com";
     * sender.bcc = bcc;
     * </pre>
     */
    function setBcc() {
        if(that.bcc != null || that.bcc ) {
            addRecipients(Message.RecipientType.BCC, that.bcc);
        }
    }

    /**
     * <p>The cc address that the mail is sent to</p>
     * <pre>
     * sender.cc = "keith@wso2.com";
     *
     * OR
     *
     * var cc = new Array();
     * cc[0] = "jonathan@wso2.com";
     * cc[1] =  "keith@wso2.com";
     * sender.cc = cc;
     * </pre>
     */
    function setCC() {
        if(that.cc != null || that.cc) {
            addRecipients(Message.RecipientType.CC, that.cc);
        }
    }

    /**
     * <p>The from address to appear in the sender</p>
     * <pre>
     * sender.from = "keith@wso2.com";
     * </pre>
     */
    function setFrom() {
        message.setFrom(new InternetAddress(that.from));
    }

    /**
     * set html element
     * */
        //need to check in here.not tested.
     function setHtml() {
        if(that.html || that.html != null) {
            if(false) {
                var node = null;
                try {
                    node = AXIOMUtil.stringToOM(that.html.toString());
                } catch (e) {
                    throw new Error(e);
                }
                if(node instanceof OMElement) {
                    var htmlElement = node;
                    that.html = htmlElement.toString();
                } else {
                    throw new Error("Invalid input argument. The html function accepts " +
                        "either a String or an XML element.");
                }
            } else {
                throw new Error("Invalid input argument. The html function accepts " +
                    "either a String or an XML element.");
            }

            var messageBodyPart = new MimeBodyPart();
            var dataHandler = null;
            try {
                dataHandler = new DataHandler(
                    new ByteArrayDataSource(that.html, "text/html"));
                messageBodyPart.setDataHandler(dataHandler);
                multipart.addBodyPart(messageBodyPart);
            } catch(e) {
                throw new Error(e);
            }
        }
    }

    /**
     * <p>Send the mail out</p>
     * <pre>
     * sender.send()
     * </pre>
     */
    sender.prototype.send = function(from) {
        checkParam();

        var classLoader = Thread.currentThread().getContextClassLoader();
        Thread.currentThread().setContextClassLoader(javax.mail.Session.class.getClassLoader());
        try {
            message.setContent(multipart);
            Transport.send(message);
        } catch (e) {
            throw new Error(e);
        } finally {
            Thread.currentThread().setContextClassLoader(classLoader);
        }

    };

    function addRecipients(recipientType, recipientObject) {
        try {
            if (util.isArray(recipientObject) ) {

                var to = recipientObject;
                var recipientAddresses = new Array(to.length);

                for(var i = 0; i < to.length; i++) {
                    recipientAddresses[i] = new InternetAddress(to[i]);
                }

                message.addRecipients(recipientType, recipientAddresses);
                /*} else if (util.isArray(recipientObject)) {
                 var arr = recipientObject;
                 var objects = arr.getIds;
                 for(var i = 0; i < objects.length; i++) {
                 var object = objects[i];
                 var o;
                 if(util.isString(object)) {
                 var property = object;
                 o =
                 } else {
                 var property = object;
                 }
                 message.addRecipient(recipientType, new InternetAddress(String(recipientObject)));
                 }    */
            } else if(util.isString(recipientObject)) {
                message.addRecipient(recipientType, new InternetAddress(String (recipientObject)));
            } else {
                throw new Error("The argument to this function should be an array of email addresses or a " +
                    "single email address");
            }
        } catch (e) {
            throw new Error(e);
        }
    };


}

/**
 * access via
 * var email = require('email');
 * var sender = new email()*/
//or else
//module.exports = sender;
/**
 * access via
 * var email = require('email');
 * var sender = new email.sender();*/
exports.Sender = sender;


