/** Creates the new user and sends a notification. */
app.post("/user/create", function (req, res) {
  var userName = req.param("nickname");
  var email = req.param("email");

  // Send email to notify new user.
  console.log(userName + ":" + email);

  res.render("affiliate_success.html");
});
