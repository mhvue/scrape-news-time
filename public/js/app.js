$(document).ready(function () {
   
     $("#nothingMsg").show();
      
    $("#get-button").on("click", function () {

        $(".articlesTable").empty();

        $.get("/api/scrape").then(function () {

            $.get("/api/all").then(function (data) {
                for (var i = 0; i < data.length; i++) {

                    var dataTitle = data[i].title;
                    var dataLink = data[i].link;
                    var dataSummary = data[i].summary;
                    var articleId = data[i]._id;

                    if (dataSummary == "") {
                        var nullMsg = "Sorry, no summary at this time. Click link for more"

                        var dataNew = $("<div>").append($("<h5>").text(dataTitle).attr("data-title", "title"),
                            $("<p>").text(nullMsg).attr("data-summary", "summary"),
                            $("<p>").html("<a href='" + dataLink +
                                "'target='_blank'> Read more about article here</a>").attr("data-link", "link"),
                            $("<button>").addClass("addBtn").text("Add Article"),
                            $("<p>").html("<hr>"));

                            dataNew.attr("id", articleId);
                            $(".articlesTable").append(dataNew);

                    } else {
                        var dataNew = $("<div>").append($("<h5>").text(dataTitle).attr("data-title", "title"),
                            $("<p>").text(dataSummary).attr("data-summary", "summary"),
                            $("<p>").html("<a href='" + dataLink +
                                "' target='_blank' > Read more about article here</a>").attr("data-link", "link"),
                            $("<button>").addClass("addBtn").text("Add Article"),
                            $("<p>").html("<hr>"));

                            dataNew.attr("id", articleId);
                            $(".articlesTable").append(dataNew);
                    }
                }
            });

        });

    });

    //saving one article 
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
            var noteIdArticle = $(this).parent("div").attr("id");
            console.log(noteIdArticle)
            $("#noteModal").modal("toggle");
            var noteTxtBox = $("<textarea rows='8' cols='50'>").attr("id", "noteBox");
            $(".modal-body").html(noteTxtBox);
            $(".btn-primary").on("click", function () {

                var addNote = {
                    body: $("#noteBox").val()
                };

                $.post("/api/addnote/" + noteIdArticle, addNote, function () {
                        
                        $.get("/api/allnotes/" + noteIdArticle, function (data) {
                                console.log(data)
                                for (var k = 0; k < data.note.length; k++) {

                                    console.log(data.note[k].body)
                                    var noteId = data.note[k]._id

                                var persistTxtBox = $("<div>").attr("id", noteId).append(
                                $("<p>").html(data.note[k].body),
                                $("<button>").addClass("x-btn").text("x"));
                                $(".modal-body").prepend(persistTxtBox);
                            };
                        
                        });

                    });
            });

    });
    //deleting a note
    $(document.body).on("click", ".x-btn", function () {
        var xId = $(this).parent("div").attr("id")
        console.log(xId)
        $.get("api/deletenote/" + xId, function(data){
            console.log("done on front end again")
             });
        $("#" + xId).fadeOut("slow");

    });

    //delete all articles from Index.html
    $("#clear-button").on("click", function () {
        $(".articlesTable").empty();
        $.get("/api/delete", function () {
            console.log("done!");
        });
        var newDiv = $("<div>").html("<h5> All Cleared!" + "<br>" +
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
