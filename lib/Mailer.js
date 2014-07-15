/** Node mailer library.
 * @type {Object}
 * @private
 * @fieldOf Mailer#
 */
var nodemailer = require("nodemailer");

/** Transport to send emails. It is here to reuse the connection pool for
 * different requests.
 *
 * @type {Object}
 * @private
 * @fieldOf Mailer#
 */
var transport = nodemailer.createTransport("SMTP", {
  host: process.env.MAIL_HOST,
  secureConnection: false,
  ignoreTLS: false,
  xMailer: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWD
  }
});

module.exports = function Mailer(templatePath, shadows) {

  /** Node File System API.
   * @type {Object}
   * @private
   * @fieldOf Mailer#
   */
  var fs = require("fs");

  /** Node Path API.
   * @type {Object}
   * @private
   * @fieldOf Mailer#
   */
  var path = require("path");

  /** Handlebars template engine
   * @type {Object}
   * @private
   * @fieldOf Mailer#
   */
  var Handlebars = require("handlebars");

  /** Reads and expands the email template in the specified format.
   * @param {String} format Template format, must be a file extension. Cannot
   *    be null or empty.
   * @param {Object} data Data to expand the email template. Cannot be null.
   * @private
   * @methodOf Mailer#
   */
  var readTemplate = function (format, data) {
    var source = fs.readFileSync(templatePath + "." + format.toLowerCase());
    var template = Handlebars.compile(source.toString());
    return template(data);
  };

  return {

    /** Sends an email using the configured template.
     *
     * @param {String|String[]} recipients Comma-separated or array of valid
     *    email addresses. Cannot be null.
     * @param {Object} data Data to expand the template. Cannot be null.
     * @param {Function} callback Callback invoked when the mail is successfully
     *    sent. It receives an error and the response status as parameters.
     */
    send: function (recipients, data, callback) {
      var mailOptions = {
        subject: "Bienvenidx al Partido Pirata de Argentina",
        from: process.env.MAIL_FROM,
        to: recipients,
        cc: process.env.DEBUG_MODE ? [] : (shadows || []),
        text: readTemplate("txt", data),
        html: readTemplate("html", data),
        attachments: [{
          cid: "logo+nombre.png",
          fileName: "logo+nombre.png",
          filePath: path.normalize(__dirname +
            "/../views/public/images/logo+nombre.png")
        }]
      };

      transport.sendMail(mailOptions, callback);
    }
  };
};
