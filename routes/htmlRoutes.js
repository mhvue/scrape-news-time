var path = require("path");

module.exports= function(app) {

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/savedarticles", function(req, res){
    res.sendFile(path.join(__dirname, "../public/savedArticles.html"));
});

app.get("*", function(req, res) {
    res.status(404).send("Unable to find. Try again")
});

};
