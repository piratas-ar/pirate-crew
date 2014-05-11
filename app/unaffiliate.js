var Member = require("../lib/Member")

app.get("/unaffiliate", function (req, res) {
  res.render("unaffiliate.html");
});
app.post("/unaffiliate", function (req, res) {
  var member = new Member(req.param("id"), req.param("password"));
  var success =  member.unaffiliate();

  if (success) {
    res.render("unaffiliate_success.html");
  } else {
    res.render("unaffiliate.html", {
      error: true
    });
  }
});
