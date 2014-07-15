/** Manages users in the specified assembly.
 *
 * Assemblies index must be defined in the environment variable ASSEMBLIES_URL.
 *
 * @param {String} name Name of the assembly. Cannot be null or empty.
 */
module.exports = function Assembly(name) {

  /** Request HTTP library.
   * @type {Object}
   * @private
   * @fieldOf Assembly#
   */
  var request = require("request");

  /** Url to subscribe users to this assembly.
   * @type {String}
   * @private
   * @fieldOf Assembly#
   */
  var SUBSCRIPTION_URL = (function () {
    var baseUrl = process.env.ASSEMBLIES_URL;
    var action = "subscribe/" + name;

    if (baseUrl.substr(-1, 1) !== "/") {
      baseUrl += "/";
    }

    return baseUrl + action;
  }());

  return {
    /** Subscribes a user to this assembly.
     *
     * @param {String} user Name of the user in the assembly. Cannot be null or
     *    empty.
     * @param {String} email Email of the user to subscribe. Cannot be null or
     *    empty.
     * @param {String} password User password. Cannot be null or empty.
     * @param {Function} [callback] Invoked when the subscription request
     *    has finished. Can be null.
     */
    subscribe: function (name, email, password, callback) {
      request.post(SUBSCRIPTION_URL, {
        form: {
          "fullname": name,
          "email": email,
          "pw": password,
          "pw-conf": password,
          "digest": 0
        }
      }, callback);
    }
  };
};
