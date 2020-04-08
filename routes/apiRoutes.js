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
            results.summary = $(element).children(".text").find("p").text();
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

app.get("/api/delete", function(req, rest) {
   db.Article.deleteMany({}, function (err) {
        if(err) console.log(err);
        console.log("Successful deletion");
      });
});


//when press button, we get all the articles (that is scraped)
app.get("/api/all", function (req,res){
    db.Article.find({"saved": false}).then(function(dbAll){
        res.json(dbAll)
    })
    .catch(function(err){
        res.json(err)
    });

});

//get that specific article  
app.get("/api/savedarticle/:id", function(req, res){
    var savedArticle = req.params.id
    console.log(savedArticle)
    
    db.Article.findById(savedArticle).then(function(dbOne){
        res.json(dbOne)
        console.log("hello" + dbOne);
    })
    .catch(function(err){
        res.json(err)
    });
    
});

// get route to display all saved article 

//post to save html
app.post("/api/postarticle/:id", function(req, res){

    var savedArticle = req.params.id
    console.log("from app.post"+ savedArticle)
    
    db.Article.findOneAndUpdate({_id:savedArticle}, {"saved": true}).then(function(dbOne){
        res.json(dbOne)
        console.log("now saved" + dbOne);
    })
    .catch(function(err){
        res.json(err)
    });
    
});
//once saved, user can add comment POST

//once saved, user can delete comment 

//once saved, user can delete article 

};