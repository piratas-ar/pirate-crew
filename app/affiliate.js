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
    placeOfBirth: req.param("placeOfBirth"),
    documentType: req.param("documentType"),
    document: req.param("document"),
    genre: req.param("genre"),
    job: req.param("job"),
    maritalStatus: req.param("maritalStatus"),
    email: req.param("email"),
    commune: req.param("commune"),
    street: req.param("street"),
    streetNumber: req.param("streetNumber"),
    floor: req.param("floor"),
    apartment: req.param("apartment"),
    cp: req.param("cp"),
    nickname: req.param("nickname")
  }, function (err, bundleFile) {
    res.render("affiliate_success.html", {
      affiliationCode: id
    });
  });
});
