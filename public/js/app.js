$(document).ready(function () {

    $("#get-button").on("click", function () {
        console.log("click");
        $(".articlesTable").empty();

        $.getJSON("/api/scrape", function (data) {
           console.log(data)
    
            for (var i = 0; i < 10; i++) {
             
                // console.log(data[i])
                var dataTitle = data[i].title;
                var dataLink = data[i].link;
                // console.log(dataLink)
                var dataSummary = data[i].summary; //showing as undefined righ tnow
                // console.log(dataSummary)
                var articleId = data[i]._id;

                // var addButton = $("<button>").addClass("addBtn").text("Add Article");

                //if/else not not working correctly
                if(dataTitle == "" && dataSummary == "") {
                    var nullMsg= "Sorry No value at this time."

                    var dataNew= $("<div>").append($("<h5>").text(nullMsg).attr("data-title", "title"),
                    $("<p>").text(nullMsg).attr("data-summary", "summary"),
                    $("<p id='linkID>").html("<a href=' " + dataLink +
                        " 'target='_blank' '> Read more about article here</a>").attr("data-link", "link"),
                    $("<button>").addClass("addBtn").text("Add Article")
                );

                    dataNew.attr("data-info", articleId);

                    $(".articlesTable").append(dataNew);
                
                }

                else {
                var dataNew= $("<div>").append($("<h5>").text(dataTitle).attr("data-title", "title"),
                    $("<p>").text(dataSummary).attr("data-summary", "summary"),
                    $("<p id='linkID>").html("<a href=' " + dataLink +
                        " 'target='_blank' '> Read more about article here</a>").attr("data-link", "link"),
                    $("<button>").addClass("addBtn").text("Add Article")
                );

                dataNew.attr("data-info", articleId);

                $(".articlesTable").append(dataNew);
            }
                
            }


        });
    });


    //saving one article 
    $(document.body).on("click", ".addBtn", function () {
        console.log("click");
        console.log(this)
        var articleId = $(this).parent("div").attr("data-info")
        console.log(articleId)

        $.ajax({
            url: "/api/postarticle/" + articleId,
            type: 'PUT',
            success: function (dataPost) {
                console.log(dataPost)
                $("#savedModal").modal("toggle")

            }
        });

    });

    //get ALL the saved articles 
    $("#save-button").on("click",function () {
        console.log("click")


        $.get("/api/savedarticles", function (data) {
            // console.log(data);
        
            //running to erroes with the for loop
            for (var j = 0; j < 10; j++) {
        
               console.log(data[j]);
    
                var savedTitle = data[j].title;
                console.log("Title" + savedTitle)
                var savedSummary = data[j].summary;
                console.log("Summary" + savedSummary)
                var savedLink = data[j].link;
                console.log("Link" + savedLink)

                if(savedTitle || savedSummary == "") {
                    var nullMsg= "Sorry No value at this time."
                }

                else{

                    var savedData = $("<div>").append($("<h5>").text(savedTitle).attr("data-title", "title"),
                        $("<p>").text(savedSummary).attr("data-summary", "summary"),
                        $("<p id='linkID>").html("<a href=' " + savedLink +
                            " 'target='_blank' '> Read more about article here</a>").attr("data-link", "link"),
                        $("<button>").addClass("addBtn").text("Delete Article"),
                        $("<button>").addClass("addNote").text("Add Note")
                    );

                        savedData.attr("data-info", "saved");
                        
                        var saveTable = $("<div>").addClass("saveTable"); 
                        saveTable.append( savedLink) //not appending
            };

        };
        });
          
        // };
           
});
    // savedData()
//   $(".articlesTable").append("hello")



    $("#clear-button").on("click", function(){
        console.log("click")
        $(".articlesTable").empty();
        
        $.get("/api/delete", function(data){
            console.log(data);

            $(".articlesTable").append("Click Get Article to start again.")
        });
        
     });





});


