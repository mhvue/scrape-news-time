
$(document).ready(function() {

$("#get-button").on("click", function(){
    console.log("click");

    $.getJSON("/api/all", function(data){
        console.log(data)
        for(var i = 0; i < 10; i++){
            // console.log(data[i])
            var dataTitle = data[i].title;
            var dataLink= data[i].link;
            // console.log(dataLink)
            var dataSummary = data[i].summary; //showing as undefined righ tnow
            // console.log(dataSummary)
            var articleId = data[i]._id;

            // var addButton = $("<button>").addClass("addBtn").text("Add Article");

            var data = $("<div>").append($("<h5>").text(dataTitle).attr("data-title", "title"),
               $("<p>").text(dataSummary).attr("data-summary", "summary"),
               $("<p id='linkID>").html( "<a href=' " + dataLink  + 
                " 'target='_blank' '> Read more about article here</a>").attr("data-link", "link"),
                $("<button>").addClass("addBtn").text("Add Article")
                
            );

            data.attr("data-info",articleId); 

            $(".articlesTable").append(data);
        }
    });
});


//saving one article 
$(document.body).on("click",".addBtn", function(){
    console.log("click");
   console.log(this)
    var articleId= $(this).parent("div").attr("data-info")
    console.log(articleId)



    $.ajax({
        url: "/api/postarticle/" + articleId,
        type: 'PUT',
        success: function(dataPost) {
            console.log(dataPost)
            alert("saved!")// eventually will be a modal

        }
     });

    });


    //get ALL the saved articles 
    $("#save-button").on("click", function(){
        console.log("click")
        $.getJSON("/api/savedarticles",function(data){
            console.log(data)
            for (var j =0; j < data.length; j++) {
                // console.log(data[j].title)
                var savedTitle = data[j].title;
                var savedSummary= data[j].summary;
                var savedLink=data[j].link;

            var savedData  = $("<div>").append($("<h5>").text(savedTitle).attr("data-title", "title"),
            $("<p>").text(savedSummary).attr("data-summary", "summary"),
            $("<p id='linkID>").html( "<a href=' " + savedLink  + 
             " 'target='_blank' '> Read more about article here</a>").attr("data-link", "link"),
             $("<button>").addClass("addBtn").text("Delete Article")
             
         );
           savedData.attr("data-info","saved"); 
           $("#saved").append(savedData);

        }

            // $("#saved").append(savedDataRow);

        })

        // $("#saved").append(savedDataRow);

    });








});

