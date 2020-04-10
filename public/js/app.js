$(document).ready(function () {
//get ALL articles to show on index.html (need to fix so that it scrapes 1st then shows all)
    $("#get-button").on("click", function () {
        console.log("click");
        $(".articlesTable").empty();

        $.getJSON("/api/all", function (data) {
           console.log(data)
    
            for (var i = 0; i < 10; i++) {

                var dataTitle = data[i].title;
                var dataLink = data[i].link;
                var dataSummary = data[i].summary; 
                // console.log(dataSummary)
                var articleId = data[i]._id;
                
                if(dataSummary == "") {
                    var nullMsg= "Sorry, no summary at this time. Click link for more"

                    var dataNew= $("<div>").append($("<h5>").text(dataTitle).attr("data-title", "title"),
                        $("<p>").text(nullMsg).attr("data-summary", "summary"),
                        $("<p>").html("<a href='" + dataLink +
                            "'target='_blank'> Read more about article here</a>").attr("data-link", "link"),
                        $("<button>").addClass("addBtn").text("Add Article"),
                        $("<div>").html("<hr>") );

                        dataNew.attr("data-info", articleId);
                        $(".articlesTable").append(dataNew);
                    
                }
                else {
                    var dataNew= $("<div>").append($("<h5>").text(dataTitle).attr("data-title", "title"),
                        $("<p>").text(dataSummary).attr("data-summary", "summary"),
                        $("<p>").html("<a href='" + dataLink +
                        "' target='_blank' > Read more about article here</a>").attr("data-link", "link"),
                        $("<button>").addClass("addBtn").text("Add Article"),
                        $("<div>").html("<hr>") );

                        dataNew.attr("data-info", articleId);
                        $(".articlesTable").append(dataNew);
                }
            }
        });
    });


 //saving one article 
    $(document.body).on("click", ".addBtn", function () {
        var articleId = $(this).parent("div").attr("data-info");
        $.ajax({
            url: "/api/savearticle/" + articleId,
            type: 'PUT',
            success: function (dataSaved) {
                // console.log(dataSaved)
                $("#savedModal").modal("toggle");

            }
        });

    });

//get ALL the saved articles 
    $("#save-button").on("click",function () {
        $.get("/api/allsaved", function (data) {
            console.log(data);
    
            for (var j = 0; j < data.length; j++) {
    
                var savedTitle = data[j].title;
                var savedSummary = data[j].summary;
                var savedLink = data[j].link;
                var savedId= data[j]._id;
                
                if(savedSummary == "") {
                    var nullMsg= "Sorry, no summary at this time. Click link for more"

                    var savedNew= $("<div>").append($("<h5>").text(savedTitle).attr("data-savedTitle", "title"),
                        $("<p>").text(nullMsg).attr("data-savedSummary", "summary"),
                        $("<p>").html("<a href='" + savedLink +
                            "'target='_blank'> Read more about article here</a>").attr("data-savedLink", "link"),
                        $("<button>").addClass("addNote").text("Add Note"),
                        $("<button>").addClass("deleteBtn").text("Delete Article"),
                        $("<div>").html("<hr>") );

                        savedNew.attr("data-savedInfo", savedId);
                        $(".saveTable").append(savedNew);
                    
                }
                else {
                    
                    var savedNew= $("<div>").append($("<h5>").text(savedTitle).attr("data-savedTitle", "title"),
                        $("<p>").text(savedSummary).attr("data-savedSummary", "summary"),
                        $("<p>").html("<a href='" + savedLink +
                            "'target='_blank'> Read more about article here</a>").attr("data-savedLink", "link"),
                        $("<button>").addClass("addNote").text("Add Note"),
                        $("<button>").addClass("deleteBtn").text("Delete Article"),
                        $("<div>").html("<hr>") );

                        savedNew.attr("data-info", savedId);
                        $(".saveTable").append(savedNew);
                 };

            };
           
        });
           
    });

//adding a comment/note 



//delete all articles from Index.html
    $("#clear-button").on("click", function(){
        
        $(".articlesTable").empty();
        
        $.get("/api/delete", function(data){
            console.log("done!");

        });

        var newDiv = $("<div>").html("<h5> All Cleared!" + "<br>" +
        "Start again by clicking Get Articles </h5>")
        $(".articlesTable").append(newDiv);
        
     });

//delete one article from  SAVED list 
     $(document.body).on("click", ".deleteBtn",function(req, res){
        console.log(this);
        
        var deleteArticle= $(this).parent("div").attr("data-savedInfo")
        // console.log(deleteArticle)

        $.get("/api/delete/" + deleteArticle, function(data){
             if(data){
                 console.log("done")
             }
        });


     })





});


