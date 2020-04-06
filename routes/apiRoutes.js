var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
//get the scraped articles + add it scrape articles to db
app.get("/api/scrape", function(req, res){
    axios.get("https://www.getthegloss.com/").then(function(response){

        var $ = cheerio.load(response.data);
    
    
        var results = {};

        $(".listingItem").each(function(i, element){
            results.title = $(element).children(".text").find("h2").text();
            resuls.summary = $(element).children(".text").find("p").text();
            results.link = $(element).children("p.image").find("a").attr("href");

    
        db.Article.create(results).then(function(dbArticle){
            console.log(dbArticle)
        })
        .catch(function(err){
            console.log(err)
        });
    });

});
    res.send("Scrape Complete");
})

//when press button, saved that specific article 
app.get("/api/all", function (req,res){
    db.Article.find({}).then(function(dbAll){
        res.json(dbAll)
    })
    .catch(function(err){
        res.json(err)
    })

})



//once saved, user can add comment POST

//once saved, user can delete comment 

//once saved, user can delete article 

};