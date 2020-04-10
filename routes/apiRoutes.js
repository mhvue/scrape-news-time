var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
//get the scraped articles + add it scrape articles to db
app.get("/api/scrape", function(req, res){
    axios.get("https://people.com/tag/beauty-news/").then(function(response){

        var $ = cheerio.load(response.data);
        var results = {};

        $(".category-page-item").each(function(i, element){
            results.link = $(element).children(".category-page-item-content").children("a").attr("href")
           results.title =$(element).children(".category-page-item-content").children("a").find(".category-page-item-title").text();
            results.summary = $(element).children(".category-page-item-content").children(".category-page-item-description").text();

        
            db.Article.create(results).then(function(dbArticle){
              console.log(dbArticle)
            })
            .catch(function(err){
                console.log(err)
            });
        });

    });
    // res.send("Scrape Done")
//    return res.redirect("/api/all"); //not working 
 });
    

 //delete ALL articles
app.get("/api/delete", function(req, res) {
   db.Article.deleteMany({}, function (err) {
        if(err) console.log(err);
        console.log("Successful deletion");
      });

});

 //delete one article 
 app.get("/api/delete/:id", function(req, res) {
    var id = req.params.id
    console.log("this is to be delete" + id)

    // db.Article.deleteOne({_id:id}, function (err) {
    //      if(err){
    //          console.log(err)
    //      }
    //      else{
    //      console.log("Successful deletion");
    //      }
    //    });
 

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
app.get("/api/allsaved", function(req, res){

    db.Article.find({"saved": true}).then(function(dbAll){
        res.json(dbAll)
        console.log("hello" + dbAll);
    })
    .catch(function(err){
        res.json(err)
    });
  
});

//update = specific article to SAVE 
app.put("/api/savearticle/:id", function(req, res){

    var savedArticle = req.params.id
    console.log("from app.put"+  savedArticle)

    
    db.Article.findOneAndUpdate({_id:savedArticle}, {$set: {saved: true}}).then(function(dbOne){
        res.json(dbOne)
        console.log("now saved" + dbOne);
    })
    .catch(function(err){
        res.json(err)
    });
    
});


//user can post note associated with that specific article 
app.post("api/addnote/:id", function(req, res){

    var note= req.body
    var savedArticle = req.params.id

    db.Note.create(note).then(function(req, res){
        //if note is successfully created, find that specific article from
        // Article model, and push the new note _id to the Article col. note arrary
        return db.Article.findOneAndUpdate({_id:savedArticle}, {$push: {note: dbNote._id }},{new: true}); 
        //how would it know to find that specific article? 

    }).then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });

});

//users can get ALL notes for that specific article (this is POPULATE)
app.get("api/allnotes/:id", function(res, req){

    var savedArticle = req.params.id

    db.Article.findById(savedArticle).populate("note").then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err)
    });

});



//user can delete note from that specific article
app.get("api/deletenote/:id", function (req, res){
    
    var noteId = req.params.id

    //delete from the Note model or vice versa?
    //update the Article model 
    db.Note.deleteOne({_id:noteId}).then(function( res, req){
        db.Article.findOneAndDelete({_id: savedArticle})
    })
})


};