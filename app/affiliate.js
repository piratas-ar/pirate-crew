var path = require("path");
var fs = require("fs");

var Member = require("../lib/Member")
var MEMBERS_DIR = path.join(__dirname, "..", "members");

app.get("/", function (req, res) {
  var members = fs.readdirSync(MEMBERS_DIR);
  var publicKey = fs.readFileSync(path.join(__dirname, "..",
    process.env.KEY_FILE), "ascii");

  res.render("affiliate.html", {
    membersCount: members.length,
    publicKey: publicKey.toString()
  });
});
app.post("/", function (req, res) {
  var id = req.param("id");
  var data = req.param("data");
  var member = new Member(id, data);

  member.affiliate();
  res.send("OK");
});
