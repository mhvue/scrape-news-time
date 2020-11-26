var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {

app.get("/api/scrape", function(req, res){
    axios.get("https://people.com/tag/beauty-news/").then(function(response){

        var $ = cheerio.load(response.data);
        var results = {};

        $(".category-page-item").each(function(i, element){
            results.link = $(element).children(".category-page-item-content").children("a").attr("href")
           results.title =$(element).children(".category-page-item-content").children("a").find(".category-page-item-title").text();
            results.summary = $(element).children(".category-page-item-content").children(".category-page-item-description").text();

            db.Article.create(results).then(function(dbArticle){
              console.log(dbArticle);
            })
            .catch(function(err){
                console.log(err);
            });
        });

    });
    res.send();
 });
    

 //delete ALL articles
app.get("/api/delete", function(req, res) {
   db.Article.deleteMany({"saved":false}, function (err) {
        if(err) console.log(err);
        console.log("Successful deletion");
      });

      res.send();

});

 //delete one article from saved html
 app.get("/api/delete/:id", function(req, res) {
    var noteId = req.params.id;
    
    db.Article.deleteOne({"_id": noteId}, function (err, result) {
         if(err){
             console.log(err);
         }
         else{
            res.send(result);
         console.log("Successful deletion");
         }
       });
 });


//get all the articles (that is scraped)
app.get("/api/all", function (req,res){
    db.Article.find({"saved": false}).then(function(dbAll){
        res.json(dbAll);
    })
    .catch(function(err){
        res.json(err);
    });

});

//get that specific article  
app.get("/api/savedarticle/:id", function(req, res){
    var savedArticle = req.params.id

    db.Article.findById(savedArticle).then(function(dbOne){
        res.json(dbOne);
    })
    .catch(function(err){
        res.json(err);
    });
});

// get route to display all saved article 
app.get("/api/allsaved", function(req, res){

    db.Article.find({"saved": true}).then(function(dbAll){
        res.json(dbAll);
    })
    .catch(function(err){
        res.json(err);
    });
  
});

//update = specific article to SAVE 
app.put("/api/savearticle/:id", function(req, res){

    var savedArticle = req.params.id;
    
    db.Article.findOneAndUpdate({_id:savedArticle}, {$set: {saved: true}}).then(function(dbOne){
        res.json(dbOne);
    })
    .catch(function(err){
        res.json(err);
    });
});

//user can post note associated with that specific article 
app.post("/api/addnote/:id", function(req, res){

    var note= req.body.body;
    var savedArticle = req.params.id;

    db.Note.create({"body": note}).then(function(dbNote){
        return db.Article.findOneAndUpdate({_id:savedArticle}, {$push: {note: dbNote._id }},{new: true}) 
    }).then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

//users can get ALL notes for that specific article 
app.get("/api/allnotes/:id", function(req, res){

    var savedArticle = req.params.id;

    db.Article.findById(savedArticle).populate("note").then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });

});

//user can delete note 
app.get("/api/deletenote/:id", function (req, res){
    
    var noteId = req.params.id;

    db.Note.deleteOne({"_id":noteId}).then(function(dbNote){
        res.json(dbNote);
    }).catch(function(err){
        res.json(err);
    });

});


};