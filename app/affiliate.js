var path = require("path");
var fs = require("fs");
var uuid = require('node-uuid');

var Member = require("../lib/Member")
var MEMBERS_DIR = path.join(__dirname, "..", "members");

app.get("/", function (req, res) {
  var members = fs.readdirSync(MEMBERS_DIR);

  res.render("affiliate.html", {
    membersCount: members.length
  });
});
app.post("/", function (req, res) {
  var id = uuid.v4();
  var member = new Member(id, req.param("password"), {
    sender: process.env.NODE_GPG_SENDER,
    receipt: process.env.NODE_GPG_RECEIPT
  });

  member.affiliate({
    id: id,
    firstName: req.param("firstName"),
    lastName: req.param("lastName"),
    dateOfBirth: req.param("dateOfBirth"),
    document: req.param("document"),
    email: req.param("email"),
    commune: req.param("commune"),
    address: req.param("address"),
    cp: req.param("cp")
  }, function (err, bundleFile) {
    res.render("affiliate_success.html", {
      affiliationCode: id
    });
  });
});
