/** Represents a party member.
 *
 * @param {String} id User unique id. Cannot be null or empty.
 * @param {String} data User encrypted data. Cannot be null or empty.
 * @constructor
 */
module.exports = function Member(id, data) {

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

  return {

    /** Affiliates this member.
     * @param {Object} data Member data. Cannot be null.
     */
    affiliate: function () {
      var dataFile = path.join(__dirname, "..", MEMBERS_DIR, id);

      fs.writeFileSync(dataFile, data);
    },

    /** Unaffiliates this member, if possible.
     * @return {Boolean} Returns true if the member was successfully
     *    unaffiliated, false otherwise.
     */
    unaffiliate: function () {
      var dataFile = path.join(__dirname, "..", MEMBERS_DIR, id);

      if (fs.existsSync(dataFile)) {
        fs.unlinkSync(dataFile);
        return true;
      }

      return false;
    }
  };
};
