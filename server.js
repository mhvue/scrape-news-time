const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const app = express();

const db = require("./models"); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapenewsdb", { useUnifiedTopology: true, useNewUrlParser: true });
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapenewsdb";

mongoose.connect(MONGODB_URI);

//routes here
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.listen(PORT, () =>{
    console.log("Listening on " + `http://localhost:${PORT}`)
});

module.exports = app;