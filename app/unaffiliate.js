var Member = require("../lib/Member")

/** Shows the unaffiliate view. */
app.get("/unaffiliate", function (req, res) {
  res.render("unaffiliate.html");
});

/** Unaffiliates a member. */
app.post("/unaffiliate", function (req, res) {
  var member = new Member(req.param("id"));
  var success = member.unaffiliate();

  if (success) {
    res.render("unaffiliate_success.html");
  } else {
    res.render("unaffiliate.html", {
      error: true
    });
  }
});
