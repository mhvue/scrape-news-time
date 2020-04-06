function displayArticles(){
    var newRow = $("<tr>").append(
        $("<td>").text(data.title),
        $("<td>").html(data.link),
    )
    $(".articleHere").append(newRow)
}
$(document).ready(function() {

$("#get-button").on("click", function(){
    console.log("click");

    $.getJSON("/api/all", function(data){
        console.log(data)
        
        for(var i = 0; i < 10; i++){
            // console.log(data[i])
            var dataTitle = data[i].title;
            console.log(dataTitle);
            var dataLink= data[i].link;
            console.log(dataLink)
            // var dataSummary = data[i].summary; //showing as undefined righ tnow
            // console.log(dataSummary)

            var addButton = $("<button>").addClass("addBtn").text("Add Article");
    

            $("#articlesTable").append("<tr>" + "<td>" + "<br>" +
             dataTitle + "<br>" + "<a href=' " +
            dataLink  + " 'target='_blank' '>Link Here</a>")
            $("<td>").append(addButton);

            
    
            
        }
  
    });

});


});