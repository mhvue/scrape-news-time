$(document).ready(function () {

    $("#get-button").on("click", function () {
        console.log("click");
        $(".articlesTable").empty();

        $.getJSON("/api/all", function (data) {
           console.log(data)
    
            for (var i = 0; i < 10; i++) {

                var dataTitle = data[i].title;
                var dataLink = data[i].link;
                console.log(dataLink)
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
        var articleId = $(this).parent("div").attr("data-info")
        $.ajax({
            url: "/api/savearticle/" + articleId,
            type: 'PUT',
            success: function (dataSaved) {
                console.log(dataSaved)
                $("#savedModal").modal("toggle")

            }
        });

    });

    //get ALL the saved articles 
    $("#save-button").on("click",function () {
        $.get("/api/allsaved", function (data) {
            console.log(data);
        
            //running to erroes with the for loop
            for (var j = 0; j < data.length; j++) {
    
                var savedTitle = data[j].title;
                var savedSummary = data[j].summary;
                var savedLink = data[j].link;
                
                if(savedSummary == "") {
                    var nullMsg= "Sorry, no summary at this time. Click link for more"

                    var savedNew= $("<div>").append($("<h5>").text(savedTitle).attr("data-title", "title"),
                        $("<p>").text(nullMsg).attr("data-summary", "summary"),
                        $("<p>").html("<a href='" + savedLink +
                            "'target='_blank'> Read more about article here</a>").attr("data-link", "link"),
                        $("<button>").addClass("addBtn").text("Add Article"),
                        $("<div>").html("<hr>") );

                        savedNew.attr("data-info", "saved");
                        $(".saveTable").append(savedNew);
                    
                }
                else {
                    
                    var savedNew= $("<div>").append($("<h5>").text(nullMsg).attr("data-title", "title"),
                        $("<p>").text(savedSummary).attr("data-summary", "summary"),
                        $("<p>").html("<a href='" + savedLink +
                            "'target='_blank'> Read more about article here</a>").attr("data-link", "link"),
                        $("<button>").addClass("addBtn").text("Add Article"),
                        $("<div>").html("<hr>") );

                        savedNew.attr("data-info", "saved");
                        $(".saveTable").append(savedNew);
                    }
            };

            // $(".saveTable").append(savedNew);
            // console.log(savedNew)
        });
          
        // };
           
});
    // savedData()
//   $(".articlesTable").append("hello")

    $("#clear-button").on("click", function(){
        
        $(".articlesTable").empty();
        
        $.get("/api/delete", function(data){
            console.log("done!");

        });

        var newDiv = $("<div>").html("<h5> All Cleared!" + "<br>" +
        "Start again by clicking Get Articles </h5>")
        $(".articlesTable").append(newDiv);
        
     });





});


