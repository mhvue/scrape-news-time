var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio")

var PORT = process.env.PORT || 3000;

var app = express();

//need models required here 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapenewsdb", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapenewsdb";

mongoose.connect(MONGODB_URI);

app.listen(PORT, function(){
    console.log("Listening on " + PORT)
});