var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(express.static("images"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

var arrayImages = [
    {
        image:"1.jpg",
        price:"21334 d",
        address:"the so 2"
    },
    {
        image:"3.jpg",
        price:"21334 d",
        address:"the so 1"
    },
    {
        image:"5.jpg",
        price:"21334 d",
        address:"the so 3"
    },
    {
        image:"2.jpg",
        price:"21334 d",
        address:"the so 3"
    },
    {
        image:"6.jpg",
        price:"21334 d",
        address:"the so 3"
    },
    {
        image:"4.jpg",
        price:"21334 d",
        address:"the so 3"
    }
]

app.listen(2000, function() {
    console.log("App listen at port 2000");

});

app.get("/home", function(req, res) {
    res.render("home",{data: arrayImages});
})

app.get("/signin",function(req,res){
    res.render("signin");
    
})

app.get("/details",function(req,res){
    res.render("detail");
});

app.get("/signup",function(req,res){
    res.render("signup");
});