$(document).ready(() => {
   
     $("#nothingMsg").show();
      
    $("#get-button").on("click", () => {
        $(".articlesTable").empty();
        //1st scrape 
        $.get("/api/scrape").then(() => {
           
        //2nd run GET to get all scraped articles 
            $.get("/api/all").then((data, status) => {
                console.log(data, status)
                for (let i = 0; i < 10; i++) {

                    const dataTitle= $("<h4>").text(data[i].title).attr("data-title", "title");
                    const dataLink = $("<p>").html("<a href='" + data[i].link +
                    "'target='_blank'> Read more about article here</a>").attr("data-link", "link");
                    const dataSummary = $("<p>").text(data[i].summary).attr("data-summary", "summary");
                    const articleId = data[i]._id;
                    const saveArticleBtn = $("<button>").addClass("addBtn").text("Save Article");

                    //if we are unable to get a summary of article, show msg that we are unable to get get summary. 
                    if (data[i].summary == "") {
                        const nullMsg=  $("<p>").text("Sorry, no summary at this time. Click link for more").attr("data-summary", "summary");

                        const dataNew = $("<div>").append(dataTitle,nullMsg,dataLink,saveArticleBtn,
                            $("<p>").html("<hr>"));

                            dataNew.attr("id", articleId);
                            $(".articlesTable").append(dataNew);

                    } else {
                        const dataNew = $("<div>").append(dataTitle,dataSummary,dataLink,saveArticleBtn,
                            $("<p>").html("<hr>"));

                            dataNew.attr("id", articleId);
                            $(".articlesTable").append(dataNew);
                    }
                }
            });

        });
    });

    //saving one article by updating save to true
    $(document.body).on("click", ".addBtn", () => {
        const articleId = $(this).parent("div").attr("id");
        $.ajax({
            url: "/api/savearticle/" + articleId,
            type: 'PUT',
            success: (dataSaved) => {
                $("#" + articleId).fadeOut("slow");
                $("#savedModal").modal("toggle");
            }
        });

    });

    //adding a note to articles that is saved 
    $(document.body).on("click", ".addNote", () => {
            //getting the id of that specific article
            const noteIdArticle = $(this).parent("div").attr("id");
            console.log("yoooo:" + noteIdArticle)
            //have the modal show to allow user to add a note 
            $("#noteModal").modal("toggle");
            //comment textarea created 
            const noteTxtBox = $("<textarea rows='8' cols='50'>").attr("id", "noteBox");
            //in modal-body, have text area there 
            $(".modal-body").html(noteTxtBox);
            //click on button to add a note 
            $(".btn-primary").on("click", () => {
                const addNote = {
                    body: $("#noteBox").val()
                };
                //send enter note to this endpt to update db at that specific article id
                //PROBLEM: keep running into a note getting added to previous ID and not sure why....trying to troubleshoot
                $.post("/api/addnote/" + noteIdArticle, addNote,  (data,status) => {
                    //hide text box. show msg to user that is Added 
                    $("#noteBox").hide();
                    const addedMsg= "<h4>Note Added!</h4>";
                    $(".modal-body").html(addedMsg);
                });     
            });
    });
      
    // view notes 
    $(document.body).on("click",".viewNotes", () => {
       const noteIdArticle = $(this).parent("div").attr("id");
       const persistTxtBox= $("<div>").addClass("savednotes");
     
            $.get("/api/allnotes/" + noteIdArticle, (data) => {
                $("#viewNotesModal").modal("toggle");
                if(data.note.length >0){
                    //want most recent note to show up first 
                    for (let k = data.note.length-1; k >= 0; k--) {
                        const noteId = data.note[k]._id
                        const noteBody="<p class='noteBody'>"+data.note[k].body+"</p>";
                        const noteBody2= $(noteBody).attr("id", noteId).append($("<button>").addClass("x-btn").text("x"));
                        persistTxtBox.append(noteBody2)
                        $("#viewSpan").html(persistTxtBox); 
                    };
                }else{
                    $("#viewSpan").html("");
                }
            });

             //deleting a note
            $(document.body).on("click", ".x-btn", () => {
                //get the id of the article  
                const xId = $(this).parent("p").attr("id");
                $("#" + xId).fadeOut("slow");
                $.get("api/deletenote/" + xId, (data, status) => {
                    console.log("delete status:" + status)
                });

            });
    })
   
    //delete all articles from Index.html
    $("#clear-button").on("click", () =>{
        $(".articlesTable").empty();
        $.get("/api/delete", () => {
            console.log("done!");
        });
        const newDiv = $("<div>").html("<br> <h5> All Cleared!" + "<br>" +
            "Start again by clicking Get Articles </h5>");
        $(".articlesTable").append(newDiv);
    });

    //delete one article from  SAVED list 
    $(document.body).on("click", ".deleteBtn", (req, res) => {
        const deleteArticle = $(this).parent("div").attr("id");
        $.get("/api/delete/" + deleteArticle, () => {
         });

        $("#" + deleteArticle).fadeOut();

    });
});
