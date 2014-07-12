var NUMBER_OF_SHADOWS = 2;

var path = require("path");
var fs = require("fs");
var Mailer = require("../lib/Mailer");
var shadows = JSON.parse(fs.readFileSync(path.join(__dirname, "..",
  "shadows.json")));

var getPirates = function () {
  var pirates = [];
  var name;

  for (name in shadows.pirates) {
    pirates.push(shadows.pirates[name]);
  }
  return pirates;
};

var randomPirate = function (currentPirates, matchingPirates) {
  var pirates = matchingPirates.filter(function (pirate) {
    return currentPirates.indexOf(pirate) === -1;
  });

  return pirates[Math.floor(Math.random() * pirates.length)];
};

var findShadows = function (interests) {
  var pirates = getPirates();
  var shadow;
  var selectedShadows = [];
  var matchingShadows = pirates.filter(function (pirate) {
    var votes = interests.reduce(function (previousValue, interest) {
      if (pirate.interests.indexOf(interest) > -1) {
        return previousValue + 1;
      } else {
        return previousValue;
      }
    }, 0);
    return votes > 0;
  });

  while (selectedShadows.length < NUMBER_OF_SHADOWS &&
      selectedShadows.length < pirates.length) {

    shadow = randomPirate(selectedShadows, matchingShadows);

    if (!shadow) {
      shadow = randomPirate(selectedShadows, pirates);
    }

    selectedShadows.push(shadow);
  }

  return selectedShadows;
};

/** Creates the new user and sends a notification to the general assembly. */
app.post("/user/create", function (req, res) {
  var userName = req.param("nickname");
  var email = req.param("email");
  var interests = [
    req.param("freeCulture"),
    req.param("copyright"),
    req.param("surveillance"),
    req.param("commonGoods"),
    req.param("infrastructure"),
    req.param("pairProduction"),
    req.param("coops"),
    req.param("education"),
    req.param("activism"),
    req.param("freeSoftware"),
    req.param("press"),
    req.param("politics")
  ].filter(function (interest) {
    return interest !== undefined && interest !== null;
  });

  var shadows = findShadows(interests);
  var cc = shadows.map(function (shadow) {
    return shadow.email;
  });
  var mailer = new Mailer(path.join(__dirname, "..", "views", "email_welcome"));

  mailer.send(email, {
    userName: userName,
    interests: interests.join(", "),
    shadows: shadows.map(function (shadow) {
      return shadow.name;
    })
  }, function (error, responseStatus) {
    if (error) {
      throw error;
    } else {
      console.log(responseStatus);
    }
  });

  res.render("affiliate_success.html");
});
