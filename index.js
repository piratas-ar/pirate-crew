var path = require("path");
var express = require('express');

app = express();

// Global configuration.
app.configure(function () {
  var exphbs  = require('express3-handlebars');

  app.engine('html', exphbs({ defaultLayout: 'main.html' }));
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "handlebars");

  app.use(express.cookieParser());
  app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: __dirname + '/tmp'
  }));

  app.use(express.static(path.join(__dirname, "views", "/public")));
  require("./app");
  app.listen(7000);
});
