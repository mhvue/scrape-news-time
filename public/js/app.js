$(document).ready(function () {
//get ALL articles to show on index.html (need to fix so that it scrapes 1st then shows all)
    $("#get-button").on("click", function () {
        console.log("click");
        $(".articlesTable").empty();

        $.get("/api/scrape", function(){

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



//adding a note to articles that is saved 
    //click on add note button  
    //modal to pop up to:
        //add note in a textbox (need to create a textbox, append to model)
        // then click save to send info to server and DB
            //post to the api route 
        // display all notes entered 
            //(example doesn't display right away..happens after a click again)
            //display option to delete
    

//delete a note from article on modal on saved html
     //on click of deleteNote btn 
     // ajax of GET to go to db to delete 
     //alert msg note has been deleted 




//delete all articles from Index.html
    $("#clear-button").on("click", function(){
        
        $(".articlesTable").empty();
        
        $.get("/api/delete", function(){
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


