
$(document).ready(function() {

$("#get-button").on("click", function(){
    console.log("click");

    $.getJSON("/api/all", function(data){
        console.log(data)
    

        for(var i = 0; i < 10; i++){
            // console.log(data[i])
            var dataTitle = data[i].title;
            // console.log(dataTitle);
            var dataLink= data[i].link;
            // console.log(dataLink)
            var dataSummary = data[i].summary; //showing as undefined righ tnow
            // console.log(dataSummary)
            var articleId = data[i]._id;

            // var addButton = $("<button>").addClass("addBtn").text("Add Article");
    
    
            $(".articlesTable").append("<tr>" + "<td id='"+articleId +"' "+ " >" + "<br>" +
             dataTitle + "<br>" + "<a href=' " +
            dataLink  + " 'target='_blank' '> Read more about article here</a>" + 
            "<br>" + dataSummary + "<br>" + "<button class= 'saveBtn'> Save Article </button>" );

        }
  
    });

});


$(document.body).on("click",".saveBtn", function(){
    console.log("click");
   
    var getArticleId= $(this).parent("td").attr("id");
    console.log(getArticleId)

    //send to save route 
    $.getJSON("/api/savedarticle/"+ getArticleId, function(data){

        console.log(data);

        $.post("/api/postarticle/" + getArticleId, data, function(dataPost){
            console.log("here is what i'm going to post:" + dataPost.title)
            $("#saved").append(dataPost.title)
        })

    });
        

    
    });





});




