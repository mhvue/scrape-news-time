$(document).ready(function () {
   
     $("#nothingMsg").show();
      
    $("#get-button").on("click", function () {
        $(".articlesTable").empty();
        //1st scrape 
        $.get("/api/scrape").then(function () {
           
        //2nd run GET to get all scraped articles 
            $.get("/api/all").then(function(data, status) {
                console.log(data, status)
                for (var i = 0; i < 10; i++) {

                    var dataTitle= $("<h4>").text(data[i].title).attr("data-title", "title");
                    var dataLink = $("<p>").html("<a href='" + data[i].link +
                    "'target='_blank'> Read more about article here</a>").attr("data-link", "link");
                    var dataSummary = $("<p>").text(data[i].summary).attr("data-summary", "summary");
                    var articleId = data[i]._id;
                    var saveArticleBtn = $("<button>").addClass("addBtn").text("Save Article");

                    if (data[i].summary == "") {
                        var nullMsg=  $("<p>").text("Sorry, no summary at this time. Click link for more").attr("data-summary", "summary");

                        var dataNew = $("<div>").append(dataTitle,nullMsg,dataLink,saveArticleBtn,
                            $("<p>").html("<hr>"));

                            dataNew.attr("id", articleId);
                            $(".articlesTable").append(dataNew);

                    } else {
                        var dataNew = $("<div>").append(dataTitle,dataSummary,dataLink,saveArticleBtn,
                            $("<p>").html("<hr>"));

                            dataNew.attr("id", articleId);
                            $(".articlesTable").append(dataNew);
                    }
                }
            });

        });
    });

    //saving one article by updating save to true
    $(document.body).on("click", ".addBtn", function () {
        var articleId = $(this).parent("div").attr("id");
        $.ajax({
            url: "/api/savearticle/" + articleId,
            type: 'PUT',
            success: function (dataSaved) {
                $("#" + articleId).fadeOut("slow");
                $("#savedModal").modal("toggle");
            }
        });

    });

    //adding a note to articles that is saved 
    $(document.body).on("click", ".addNote", function () {
            //getting the id of that specific article
            var noteIdArticle = $(this).parent("div").attr("id");
            console.log("yoooo:" + noteIdArticle)
            //have the modal show to allow user to add a note 
            $("#noteModal").modal("toggle");
            //comment textarea created 
            var noteTxtBox = $("<textarea rows='8' cols='50'>").attr("id", "noteBox");
            //in modal-body, have text area there 
            $(".modal-body").html(noteTxtBox);
            //click on button to add a note 
            $(".btn-primary").on("click", function () {
                var addNote = {
                    body: $("#noteBox").val()
                };
                //send enter note to this endpt to update db 
                $.post("/api/addnote/" + noteIdArticle, addNote, function (data,status) {
                    console.log(data,status)
                    //clear the text box after posting and show words Added to user 
                   // $("#noteBox").val(" ").before("<h2>Added!</h2>")    
                   
                   $.get("/api/allnotes/" + noteIdArticle, function (data) {
                    console.log(data)
                    for (var k = 0; k < data.note.length; k++) {
                        console.log(data.note.length)
                        var noteBody=data.note[k].body;
                        var noteId = data.note[k]._id
                        console.log(noteBody,noteId)

                        var persistTxtBox = $("<div>").addClass("savednotes").attr("id",noteId).append(
                        $("<p>").html(noteBody),
                        $("<button>").addClass("x-btn").text("x"));
    
                        $(".modal-body").prepend("<br>",persistTxtBox);

                           //deleting a note
                            $(".x-btn").on("click",function () {
                                var xId = $(this).parent("div").attr("id");
                                console.log(xId)
                            
                            // var xId = $(".x-btn").parent("div").attr("id");
                            // console.log(xId)
                            $($(this).parent("div")).fadeOut("slow");

                            $.get("api/deletenote/" + xId, function(data, status){
                                console.log("delete status:" + status)
                            });

                });
                    };
    
    
                });

               
                });     
            });
    });

      
    // view notes 
    $(document.body).on("click",".viewNotes", function(){
       var noteIdArticle = $(this).parent("div").attr("id");
       var persistTxtBox;
       $("#viewNotesModal").modal("toggle");

            $.get("/api/allnotes/" + noteIdArticle, function (data) {
                console.log(data)
                for (var k = 0; k < data.note.length; k++) {
                    var noteBody=data.note[k].body;
                    var noteId = data.note[k]._id

                     persistTxtBox = $("<div>").attr("id", noteId).addClass("savednotes").append(
                    $("<p>").html(noteBody),
                    $("<button>").addClass("x-btn").text("x"));

                    $("#viewSpan").html(persistTxtBox); //gotta fix this.if we use prepend, it prepends ALL the notes over again. if use html, it replaces each every time SO not showing allnotes.
                };

            });

             //deleting a note
            $(document.body).on("click", ".x-btn", function () {
                //get the id of the article  
                var xId = $(this).parent("div").attr("id");

                $("#" + xId).fadeOut("slow");

                $.get("api/deletenote/" + xId, function(data, status){
                    console.log("delete status:" + status)
                });

            });
    })
   
   

    //delete all articles from Index.html
    $("#clear-button").on("click", function () {
        $(".articlesTable").empty();
        $.get("/api/delete", function () {
            console.log("done!");
        });
        var newDiv = $("<div>").html("<br> <h5> All Cleared!" + "<br>" +
            "Start again by clicking Get Articles </h5>");
        $(".articlesTable").append(newDiv);
    });

    //delete one article from  SAVED list 
    $(document.body).on("click", ".deleteBtn", function (req, res) {
        var deleteArticle = $(this).parent("div").attr("id");
        $.get("/api/delete/" + deleteArticle, function () {
         });

        $("#" + deleteArticle).fadeOut();

    });


});
