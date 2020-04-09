var express = require("express");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

var app = express();

var db = require("./models"); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapenewsdb", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapenewsdb";

mongoose.connect(MONGODB_URI);
mongoose.set('useFindAndModify', false);

//routes here
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.listen(PORT, function(){
    console.log("Listening on " + "http://localhost:" + PORT)
});

module.exports = app;