var util = require("util");

var Properties              = Java.type("java.util.Properties");
var MimeMessage             = Java.type("javax.mail.internet.MimeMessage");
var MimeMultipart           = Java.type("javax.mail.internet.MimeMultipart");
var DataHandler             = Java.type("javax.activation.DataHandler");
var DataSource              = Java.type("javax.activation.DataSource");
var InternetAddress         = Java.type("javax.mail.internet.InternetAddress");
var MimeBodyPart            = Java.type("javax.mail.internet.MimeBodyPart");
var ByteArrayDataSource     = Java.type("javax.mail.util.ByteArrayDataSource");
var IOException             = Java.type("java.io.IOException");
var InputStream             = Java.type("java.io.InputStream");
var OutputStream            = Java.type("java.io.OutputStream");
var Thread                  = Java.type("java.lang.Thread");
var Session                 = Java.type("javax.mail.Session");
var Transport               = Java.type("javax.mail.Transport");
var Message                 = Java.type("javax.mail.Message");
var Authenticator           = Java.type("javax.mail.Authenticator");
var PasswordAuthentication  = Java.type("javax.mail.PasswordAuthentication");

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
            var messageBodyPart = new MimeBodyPart();

            try{
                /**
                 * <p>The body text of the mail been sent</p>
                 * <pre>
                 * sender.text = "WSO2 Mashup server 1.0 was Released on 28th January 2008";
                 * </pre>
                 */
                if(that.text != null) {
                    messageBodyPart.setText(that.text);

                } else {
                    messageBodyPart.setText("");
                }
                multipart.addBodyPart(messageBodyPart);

                /**
                 * <p>The subject of the mail been sent</p>
                 * <pre>
                 * sender.subject = "WSO2 Mashup server 1.0 Released";
                 * </pre>
                 */
                message.setSubject(that.subject);

                /***/
                addRecipients(Message.RecipientType.TO, that.to);

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
                if(that.bcc != null) {
                    addRecipients(Message.RecipientType.BCC, that.bcc);
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
                if(that.cc != null) {
                    addRecipients(Message.RecipientType.CC, that.cc);
                }

                /**
                 * <p>The from address to appear in the sender</p>
                 * <pre>
                 * sender.from = "keith@wso2.com";
                 * </pre>
                 */
                message.setFrom(new InternetAddress(that.from));
            } catch (e) {
                throw new Error(e);
            }
        } else {
            throw new Error("cannot send mail.adderesses are not defined.");
        }
    };

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
                var recipientAddresses = new InternetAddress[to.length];
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

sender.prototype.addAttachment = function() {};

/**
 * access via
 * var email = require('email');
 * var sender = new email.sender();*/
exports.Sender = sender;


