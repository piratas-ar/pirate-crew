/** Represents a party member.
 *
 * @param {Object} [gpgOptions] GPG options to encrypt the member data.
 * @param {String} gpgOptions.sender Name of the sender to encrypt the data
 *    with a private key. Must be in the default GPG keyring. Cannot be null or
 *    empty.
 * @param {String} gpgOptions.receipt Name of the recipient to encrypt the data
 *    with a public key. Must be in the default GPG keyring. Cannot be null or
 *    empty.
 * @constructor
 */
module.exports = function Member(id, password, gpgOptions) {

  /** Directory to store members.
   *
   * @type {String}
   * @constant
   * @private
   * @fieldOf Member#
   */
  var MEMBERS_DIR = process.env.NODE_MEMBERS_DIR || "members";

  /** Node File System API.
   *
   * @type {Object}
   * @private
   * @fieldOf Member#
   */
  var fs = require("fs");

  /** Node Path API.
   *
   * @type {Object}
   * @private
   * @fieldOf Member#
   */
  var path = require("path");

  /** Node Crypto API.
   *
   * @type {Object}
   * @private
   * @fieldOf Member#
   */
  var crypto = require("crypto");

  /** Executes a command in the current shell.
   *
   * @type {Function}
   * @private
   * @fieldOf Member#
   */
  var exec = require("child_process").exec;

  /** Returns the member data file for the specified id/password combination.
   * @param {String} id Member id. Cannot be null or empty.
   * @param {String} password User-provided password. Cannot be null or empty.
   * @return {String} Returns the full path and file name to the member data.
   *
   * @private
   * @methodOf Member#
   */
  var getMemberBundle = function () {
    var sha = crypto.createHash("sha");
    var dir = path.join(__dirname, "..", MEMBERS_DIR);
    var file;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    sha.update(id);
    sha.update(password);
    file = path.join(__dirname, "..", MEMBERS_DIR, sha.digest("hex"));

    return file;
  };

  return {

    /** Affiliates this member.
     * @param {Object} data Member data. Cannot be null.
     * @param {Function} callback Invoked when the member is successfuly
     *    registered. It takes an error and the member data file as parameters.
     */
    affiliate: function (data, callback) {
      var bundleFile = getMemberBundle();
      var serializedData = JSON.stringify(data);
      var command = "echo \"" + serializedData + "\" | gpg -e -u " +
        gpgOptions.sender + " -r " + gpgOptions.receipt +
        " -o " + bundleFile + ".gpg --yes --batch " +
        "--trust-model always -";

      exec(command, function (error, stdout, stderr) {
        var result = new Buffer(fs.readFileSync(bundleFile + ".gpg"));

        if (error) {
          callback(error);
          return;
        }

        fs.unlinkSync(bundleFile + ".gpg");
        fs.writeFileSync(bundleFile, result.toString("base64"));

        callback(null, bundleFile);
      });
    },

    /** Unaffiliates this member, if possible.
     * @return {Boolean} Returns true if the member was successfully
     *    unaffiliated, false otherwise.
     */
    unaffiliate: function () {
      var bundleFile = getMemberBundle();

      if (fs.existsSync(bundleFile)) {
        fs.unlinkSync(bundleFile);
        return true;
      }

      return false;
    }
  };
};
