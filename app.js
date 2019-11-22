var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var sql = require("mssql");
//Config for database.
var config = {
    user: "sa",
    password: "Lecanhduy1",
    server: "localhost",
    database: "hoteldatabase"
};

app.use(express.static("public"));
app.use(express.static("images"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

var arrayImages = [
    {
        hotel_id: "123",
        image: "1.jpg",
        price: "21334 d",
        address: "the so 2"
    },
    {
        hotel_id: "123",
        image: "2.jpg",
        price: "21334 d",
        address: "the so 2"
    },
    {
        hotel_id: "123",
        image: "3.jpg",
        price: "21334 d",
        address: "the so 2"
    },
    {
        hotel_id: "123",
        image: "4.jpg",
        price: "21334 d",
        address: "the so 2"
    },
    {
        hotel_id: "123",
        image: "5.jpg",
        price: "21334 d",
        address: "the so 2"
    },
    {
        hotel_id: "123",
        image: "6.jpg",
        price: "21334 d",
        address: "the so 2"
    }
]

app.listen(2000, function () {
    console.log("App listen at port 2000");

});

app.get("/home", function (req, res) {
    res.render("home", { data: arrayImages });
})

app.get("/signin", function (req, res) {
    res.render("signin");
})

// Xứ lí đăng nhập ở trong hàm này . 
app.post("/signin", function (req, res) {
    var userName = req.body.username
    var password = req.body.password

    // Connect to database.
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        request.query('select * from usersinfo', function (err, recordset) {
            if (err) console.log(err)
            // send records as a response
            res.send(recordset);
        });
    });
    sql.close()

});
//////////////////////

// Xử lí signup ở đây 
app.post("/signup", function (req, res) {
    var user = req.body.username;
    var pass1 = req.body.password1;
    var pass2 = req.body.password2;

    // Connect to database.
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        request.query('select * from usersinfo', function (err, recordset) {
            if (err) console.log(err)
            // send records as a response
            res.send(recordset);
        });
    });
    sql.close()
});
////////

app.get("/detail", function (req, res) {
    res.render("detail");
});

app.post("/detail", function (req, res) {
    // res.render("/detail",{data:arrayImages[0]})
    // console.log("chi tiet clicked");
    console.log(req.body);

});

app.get("/signup", function (req, res) {
    res.render("signup");
});


