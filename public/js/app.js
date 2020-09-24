$(document).ready(function () {
   
     $("#nothingMsg").show();
      
    $("#get-button").on("click", function () {
        $(".articlesTable").empty();
        //1st scrape 
        $.get("/api/scrape").then(function () {
        //2nd run GET to get all scraped articles 
            $.get("/api/all").then(function(data) {
                console.log(data)
                for (var i = 0; i < data.length; i++) {

                    var dataTitle = data[i].title;
                    var dataLink = data[i].link;
                    var dataSummary = data[i].summary;
                    var articleId = data[i]._id;

                    if (dataSummary == "") {
                        var nullMsg = "Sorry, no summary at this time. Click link for more"

                        var dataNew = $("<div>").append($("<h4>").text(dataTitle).attr("data-title", "title"),
                            $("<p>").text(nullMsg).attr("data-summary", "summary"),
                            $("<p>").html("<a href='" + dataLink +
                                "'target='_blank'> Read more about article here</a>").attr("data-link", "link"),
                            $("<button>").addClass("addBtn").text("Save Article"),
                            $("<p>").html("<hr>"));

                            dataNew.attr("id", articleId);
                            $(".articlesTable").append(dataNew);

                    } else {
                        var dataNew = $("<div>").append($("<h4>").text(dataTitle).attr("data-title", "title"),
                            $("<p>").text(dataSummary).attr("data-summary", "summary"),
                            $("<p>").html("<a href='" + dataLink +
                                "' target='_blank' > Read more about article here</a>").attr("data-link", "link"),
                            $("<button>").addClass("addBtn").text("Save Article"),
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
                    $("#noteBox").val(" ").before("<h2>Added!</h2>")       
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

                    $("#viewSpan").prepend("<br>",persistTxtBox);
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
