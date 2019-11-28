var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var sql = require("mssql");
var app_tool = require("./src/index.js");
var flash = require('flash-express');
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
app.use(flash());


var arrayImages = [
    {
        hotel_id: "1",
        image: "1.jpg",
        price: "21334 d",
        address: "the so 2"
    },
    {
        hotel_id: "2",
        image: "2.jpg",
        price: "21334 d",
        address: "the so 2"
    },
    {
        hotel_id: "3",
        image: "3.jpg",
        price: "21334 d",
        address: "the so 2"
    },
    {
        hotel_id: "4",
        image: "4.jpg",
        price: "21334 d",
        address: "the so 2"
    },
    {
        hotel_id: "5",
        image: "5.jpg",
        price: "21334 d",
        address: "the so 2"
    },
    {
        hotel_id: "6",
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

// app.get("/signin", function (req, res) {
//     res.render("signin");
// })

app.get("/detail/:hotel_id", function (req, res) {

    var hotel_id = req.params.hotel_id;
    var hotel = app_tool.getHotel(hotel_id);
    res.render("detail", { hotel: hotel });
    console.log(hotel);

});


// app.get("/signup", function (req, res) {
//     res.render("signup");
// });



// SignIn
var login_user;
var login_user_id;
var test = 0;
app.get('/signin/:user_id/:password', (req, res) => {

    var users = req.params.user_id;
    var password = req.params.password;
    // Connect to database.

    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query('select * from usersinfo', function (err, recordsets) {
            if (err) console.log(err)
            // Save data from db
            var data = recordsets.recordset;
            var status_code = {
                status: 0,
                user_account: ""
            }; // 0: false, 1: success.
            

            for (i = 0; i < data.length; i++) {
                let item = data[i];
                if (item.user_name == users && item.password == password) {
                    status_code.status = 1;
                    status_code.user_account = item.user_name;
                    break;
                }
            }
            var test = 2;
            res.send(status_code);


        });
    });

})

// Register area.
let users = require('./routes/users');
app.use('/users',users);