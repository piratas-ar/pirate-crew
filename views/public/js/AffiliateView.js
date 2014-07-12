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

  /** Pirate account info form.
   * @type {Element}
   * @private
   * @fieldOf AffiliateView#
   */
  var accountInfoForm = container.find(".js-account-info-form");

  /** Affiliate form.
   * @type {Element}
   * @private
   * @fieldOf AffiliateView#
   */
  var affiliateForm = container.find(".js-affiliate-form");

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

  /** Sets up the initial layout.
   * @private
   * @methodOf AffiliateView#
   */
  var setupLayout = function () {
    var district = container.find("select[name=district]").val();
    container.find(".js-commune").css({
      display: (district === "CF") ? "block" : "none"
    });
  };

  /** Sets up validation for forms.
   * @private
   * @methodOf AffiliateView#
   */
  var setupValidation = function () {
    var validateOptions = {
      errorElement: "span",
      showErrors: function (errorMap, errorList) {
        this.defaultShowErrors();
        container.find("span.error").hide();
      }
    };

    affiliateForm.validate(validateOptions);
    accountInfoForm.validate(validateOptions);

    // Show/hide error on when the user enter or leave a field.
    container.find("input").focus(function (event) {
      var input = jQuery(event.target);
      if (input.hasClass("error")) {
        input.parent().find(".error").show();
      }
    });
    container.find("input").blur(function (event) {
      var input = jQuery(event.target);
      input.parent().find("span.error").hide();
    });
  };

  /** Initializes DOM event listeners.
   *
   * @private
   * @methodOf AffiliateView#
   */
  var initEventListeners = function () {
    var prevent = true;

    container.find(".main-action").click(function (event) {
      // Show errors.
      affiliateForm.valid();
      accountInfoForm.valid();

      if (affiliateForm.valid() && accountInfoForm.valid()) {
        accountInfoForm.submit();
      }
      event.preventDefault();
    });
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
    container.find("select[name=district]").change(function (event) {
      setupLayout(jQuery(event.target));
    });
  };

  return {
    /** Renders the affiliate view.
     */
    render: function () {
      initEventListeners();
      setupLayout();
      setupValidation();
    }
  };
};
