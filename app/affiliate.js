var path = require("path");
var fs = require("fs");
var hkp = require('hkp-client');

var Member = require("../lib/Member")
var MEMBERS_DIR = path.join(__dirname, "..", "members");

app.get("/", function (req, res) {
  var members = fs.readdirSync(MEMBERS_DIR);
  var keyserver = 'http://pgp.mit.edu:11371';

  hkp.fetch(keyserver, process.env.KEY_ID, function (err, pubKey) {
    res.render("affiliate.html", {
      membersCount: members.length,
      publicKey: pubKey,
      error: err
    });
  });
});
app.post("/", function (req, res) {
  var id = req.param("id");
  var data = req.param("data");
  var member = new Member(id, data);

  member.affiliate();
  res.send("OK");
});
