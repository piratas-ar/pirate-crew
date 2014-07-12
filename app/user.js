var path = require("path");
var Mailer = require("../lib/Mailer");

/** Creates the new user and sends a notification to the general assembly. */
app.post("/user/create", function (req, res) {
  var userName = req.param("nickname");
  var email = req.param("email");
  var interests = [
    req.param("freeCulture"),
    req.param("copyright"),
    req.param("surveillance"),
    req.param("commonResources"),
    req.param("infrastructure"),
    req.param("pairProduction"),
    req.param("coops"),
    req.param("education"),
    req.param("federalism"),
    req.param("activism"),
    req.param("freeSoftware"),
    req.param("press"),
    req.param("politics")
  ];

  var mailer = new Mailer(path.join(__dirname, "..", "views", "email_welcome"));

  mailer.send(email, {
    userName: userName,
    interests: interests.filter(function (interest) {
      return interest !== undefined && interest !== null;
    }).join(", ")
  }, function (error, responseStatus) {
    if (error) {
      throw error;
    } else {
      console.log(responseStatus);
    }
  });

  res.render("affiliate_success.html");
});
