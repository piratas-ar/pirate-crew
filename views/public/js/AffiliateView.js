/** Manages the affiliation view.
 * @param {Element} container View container element. Cannot be null.
 * @constructor
 */
AffiliateView = function (container) {

  /** Public key to encrypt user data.
   * @type {Object}
   * @private
   * @fieldOf AffiliateView#
   */
  var publicKey = openpgp.key.readArmored(jQuery.trim(
    container.find(".js-public-key").text()));

  /** Encrypts the user data and returns the encrypted message.
   *
   * @return {String} Returns a message encrypted with the public key.
   *
   * @private
   * @methodOf AffiliateView#
   */
  var encryptUserData = function () {
    var fields = container.find(".js-affiliate-form").serializeArray();
    var field;
    var userData = {};

    for (field = fields.shift(); fields.length > 0; field = fields.shift()) {
      userData[field.name] = field.value;
    }

    return openpgp.encryptMessage(publicKey.keys, JSON.stringify(userData));
  };

  /** Generates the user id based on the document number and password.
   *
   * @return {String} Returns a SHA1 hash of f(documentId + ":" + password)
   *
   * @private
   * @methodOf AffiliateView#
   */
  var generateUserId = function () {
    var documentId = container.find("input[name='document']").val();
    var password = container.find("input[name='password']").val();
    var hash = openpgp.crypto.hash.sha1(documentId + ":" + password);

    return openpgp.util.hexstrdump(hash);
  };

  /** Initializes DOM event listeners.
   *
   * @private
   * @methodOf AffiliateView#
   */
  var initEventListeners = function () {
    var prevent = true;

    container.find(".js-account-info-form").submit(function (event) {
      if (prevent) {
        var userData = encryptUserData();
        var userId = generateUserId();

        jQuery.post("/", {
          id: userId,
          data: userData
        }, function (xhr) {
          // New user notification goes in another request.
          prevent = false;
          container.find(".js-account-info-form").submit();
        });

        event.preventDefault();
      }
    });
  };

  return {
    /** Renders the affiliate view.
     */
    render: function () {
      initEventListeners();
    }
  };
};
