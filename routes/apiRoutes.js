const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = (app) => {

app.get("/api/scrape", (req, res) => {
    axios.get("https://people.com/tag/beauty-news/").then((response) => {

        const $ = cheerio.load(response.data);
        const results = {};

        $(".category-page-item").each((i, element) => {
            results.link = $(element).children(".category-page-item-content").children("a").attr("href")
           results.title =$(element).children(".category-page-item-content").children("a").find(".category-page-item-title").text();
            results.summary = $(element).children(".category-page-item-content").children(".category-page-item-description").text();

            db.Article.create(results).then((dbArticle) => {
              console.log(dbArticle);
            })
            .catch((err) => {
                console.log(err);
            });
        });

    });
    res.send();
 });
    

 //delete ALL articles
app.get("/api/delete", (req, res) => {
   db.Article.deleteMany({"saved":false}, (err) => {
        if(err) console.log(err);
        console.log("Successful deletion");
      });

      res.send();

});

 //delete one article from saved html
 app.get("/api/delete/:id", (req, res) => {
    const noteId = req.params.id;
    
    db.Article.deleteOne({"_id": noteId}, (err, result) => {
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
app.get("/api/all", (req, res) => {
    db.Article.find({"saved": false}).then((dbAll) => {
        res.json(dbAll);
    })
    .catch((err) => {
        res.json(err);
    });

});

//get that specific article  
app.get("/api/savedarticle/:id", (req, res) => {
    const savedArticle = req.params.id

    db.Article.findById(savedArticle).then((dbOne) => {
        res.json(dbOne);
    })
    .catch((err) => {
        res.json(err);
    });
});

// get route to display all saved article 
app.get("/api/allsaved", (req, res) => {

    db.Article.find({"saved": true}).then((dbAll) => {
        res.json(dbAll);
    })
    .catch((err) => {
        res.json(err);
    });
  
});

//update = specific article to SAVE 
app.put("/api/savearticle/:id", (req, res) => {

    const savedArticle = req.params.id;
    
    db.Article.findOneAndUpdate({_id:savedArticle}, {$set: {saved: true}}).then((dbOne) => {
        res.json(dbOne);
    })
    .catch((err) => {
        res.json(err);
    });
});

//user can post note associated with that specific article 
app.post("/api/addnote/:id", (req, res) => {

    const note= req.body.body;
    const savedArticle = req.params.id;

    db.Note.create({"body": note}).then((dbNote) => {
        return db.Article.findOneAndUpdate({_id:savedArticle}, {$push: {note: dbNote._id }},{new: true}) 
    }).then((dbArticle) => {
        res.json(dbArticle);
    })
    .catch((err) => {
        res.json(err);
    });
});

//users can get ALL notes for that specific article 
app.get("/api/allnotes/:id", (req, res) => {

    const savedArticle = req.params.id;
   
    db.Article.findById(savedArticle).populate("note").then((dbArticle) => {
        console.log(dbArticle)
        res.json(dbArticle);
    })
    .catch((err) => {
        res.json(err);
    });

});

//user can delete note 
app.get("/api/deletenote/:id", (req, res) => {
    
    const noteId = req.params.id;

    db.Note.deleteOne({"_id":noteId}).then((dbNote) => {
        res.json(dbNote);
    }).catch((err) => {
        res.json(err);
    });

});


};