var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var sql = require("mssql");
var app_tool = require("./src/index.js");
var flash = require('connect-flash');
var session = require('express-session');
var fs = require('fs');

var config = {
    user: "sa",
    password: "Lecanhduy1",
    server: "localhost",
    database: "hoteldatabase",
    multipleStatements: true
};
app.use(express.static("./public"));
app.use(express.static("images"));
app.use(express.static("./public/uploads"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash());

// Express session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express Messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-message')(req, res);
    next();
});

app.listen(2000, function (req, res) {
    console.log("App listen at port 2000");
});

app.get('/home', function (req, res) {

    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        // query to the database and get the records
        request.query('select hotel_id, title, description,address, available, price from hotels', function (err, recordsets) {

            var database = recordsets.recordset;
            if (err) {
                console.log(err);
            }

            var dataFetched = [];

            for (i = 0; i < database.length; i++) {
                canContinue = false;
                let item = database[i];
                var data = {
                    hotel_id: item.hotel_id,
                    title: item.title,
                    description: item.description,
                    address: item.address,
                    available: item.available,
                    price: item.price
                };
                dataFetched.push(data);
            }

            request.query('select * from hotel_images', function (err, record) {
                var data = record.recordset;

                dataFetched.forEach(function (hotelItem) {
                    var images = [];
                    data.forEach(function (hotelImages) {

                        if (hotelItem.hotel_id == hotelImages.hotel_id) {
                            images.push(hotelImages.image);
                        }
                    })
                    hotelItem.image = images;
                })

                res.render('home', { data: dataFetched });



            });
        });

    });



});

app.get('/increase/:login_username', function (req, res) {
    var username = req.params.login_username;

    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        // get hotel details.
        request.query('select hotel_id, title, description,address, available, price from hotels', function (err, recordsets) {

            var database = recordsets.recordset;

            if (err) {
                console.log(err);
            }

            var dataFetched = [];

            for (i = 0; i < database.length; i++) {
                canContinue = false;
                let item = database[i];
                var data = {
                    hotel_id: item.hotel_id,
                    title: item.title,
                    description: item.description,
                    address: item.address,
                    available: item.available,
                    price: item.price
                };
                dataFetched.push(data);
            }
            
    

            
            

            // get images of hotels
            request.query('select * from hotel_images', function (err, record) {
                var data = record.recordset;

                dataFetched.forEach(function (hotelItem) {
                    var images = [];
                    data.forEach(function (hotelImages) {

                        if (hotelItem.hotel_id == hotelImages.hotel_id) {
                            images.push(hotelImages.image);
                        }
                    })
                    hotelItem.image = images;
                })

                for (i = 0; i < dataFetched.length - 1; i++) {
                    for (k = i + 1; k < dataFetched.length; k++) {
                        if(dataFetched[i].price > dataFetched[k].price) {
                            var temp = dataFetched[i];
                            dataFetched[i] = dataFetched[k];
                            dataFetched[k] = temp;
                        }
                    }
                }

                // Get user avatar
                request.query(`select avatar from usersinfo where user_name = '${username}'`, function (err, recordUser) {
                    if (err) {
                        console.log(err);

                    }

                    var arrAvatar = recordUser.recordset;
                    arrAvatar.forEach(function (avt) {
                        console.log(avt.avatar);
                        res.render('login_home', {
                            data: dataFetched,
                            user: {
                                username: username,
                                avatar: (avt.avatar != undefined ? avt.avatar : '/user.png')
                            }
                        });
                    });
                    res.end();
                });





            });
        });

    });
})

app.get("/login_home/:login_username", function (req, res) {
    var username = req.params.login_username;

    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        // get hotel details.
        request.query('select hotel_id, title, description,address, available, price from hotels', function (err, recordsets) {

            var database = recordsets.recordset;

            if (err) {
                console.log(err);
            }

            var dataFetched = [];

            for (i = 0; i < database.length; i++) {
                canContinue = false;
                let item = database[i];
                var data = {
                    hotel_id: item.hotel_id,
                    title: item.title,
                    description: item.description,
                    address: item.address,
                    available: item.available,
                    price: item.price
                };
                dataFetched.push(data);
            }

            // get images of hotels
            request.query('select * from hotel_images', function (err, record) {
                var data = record.recordset;

                dataFetched.forEach(function (hotelItem) {
                    var images = [];
                    data.forEach(function (hotelImages) {

                        if (hotelItem.hotel_id == hotelImages.hotel_id) {
                            images.push(hotelImages.image);
                        }
                    })
                    hotelItem.image = images;
                })

                // Get user avatar
                request.query(`select avatar from usersinfo where user_name = '${username}'`, function (err, recordUser) {
                    if (err) {
                        console.log(err);

                    }

                    var arrAvatar = recordUser.recordset;
                    arrAvatar.forEach(function (avt) {
                        console.log(avt.avatar);
                        res.render('login_home', {
                            data: dataFetched,
                            user: {
                                username: username,
                                avatar: (avt.avatar != undefined ? avt.avatar : '/user.png')
                            }
                        });
                    });
                    res.end();
                });





            });
        });

    });



})



app.get("/detail/:hotel_id/:username", function (req, res) {

    var hotel_id_request = req.params.hotel_id;
    var username_request = req.params.username;

    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        // get hotel details.
        request.query('select hotel_id, title, description,address, available, price, phonecontact from hotels', function (err, recordsets) {

            var dataFetched = recordsets.recordset;




            // get images of hotels
            request.query('select * from hotel_images', function (err, record) {
                var data = record.recordset;

                dataFetched.forEach(function (hotelItem) {
                    var images = [];
                    data.forEach(function (hotelImages) {

                        if (hotelItem.hotel_id == hotelImages.hotel_id) {
                            images.push(hotelImages.image);
                        }
                    })
                    hotelItem.image = images;
                });

                // console.log(dataFetched);


                request.query(`select avatar from usersinfo where user_name='${username_request}'`, function (err, getAvatar) {
                    if (err) {
                        console.log(err);

                    }
                    var avatarData = getAvatar.recordset;
                    console.log(getAvatar);


                    var user;
                    avatarData.forEach(function (avt) {
                        user = {
                            username: username_request,
                            avatar: (avt.avatar != undefined ? avt.avatar : '/user.png')
                        }

                    });

                    dataFetched.forEach(function (item) {
                        if (item.hotel_id == hotel_id_request) {
                            res.render('detail', { hotel: item, user: user });
                        }
                    });

                });
            });

        });
    });

    // console.log(hotel_id);

});


// Register and signin
let users = require('./routes/users');
app.use('/users', users);


///////////////////////////////////////////////
// // upload image or file.
const multer = require('multer');
const path = require('path');

// Get storage Engine.
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

    }
});

// Init upload.
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).array('myfile', 4);

// check file type
function checkFileType(file, cb) {
    // allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mime.
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: images only');
    }
}

app.get('/upload', function (req, res) {
    res.render('addhotel');
});

app.post('/upload', function (req, res) {

    upload(req, res, function (err) {
        var dataBody = req.body;

        var title = dataBody.title;
        var description = dataBody.description;
        var address = dataBody.address;
        var price = dataBody.price;
        var phonecontact = dataBody.phonecontact;
        var listImage = req.files;

        if (err) {
            res.send({
                status: 0
            })
        } else {
            sql.connect(config, function (err) {
                if (err) {
                    console.log(err);
                }
                var request = new sql.Request();

                request.query('select count(*) as total from hotels', function (err, recordset) {
                    var amount_hotels = 0;
                    var listRecord = recordset.recordset;
                    listRecord.forEach((record) => {
                        amount_hotels = record.total;
                    })

                    insertRow(amount_hotels + 1, title, description, address, price, phonecontact, listImage);

                });

                res.end();


            })
        }
    })


});
function insertRow(hotel_id, title, description, address, price, phonecontact, listImage) {
    //2.
    var dbConn = new sql.ConnectionPool(config);

    //3.
    dbConn.connect().then(function () {
        //4.
        var transaction = new sql.Transaction(dbConn);
        //5.
        transaction.begin().then(function () {
            //6.
            var request = new sql.Request(transaction);
            //7.
            request.query(`Insert into hotels (hotel_id,title,description,address,price,phonecontact) values ('${hotel_id}','${title}','${description}','${address}','${price}','${phonecontact}')`)
                .then(function () {
                    //8.
                    transaction.commit().then(function (recordSet) {
                        console.log(recordSet);
                        dbConn.close();
                    }).catch(function (err) {
                        //9.
                        console.log("Error in Transaction Commit " + err);
                        dbConn.close();
                    });
                    listImage.forEach(function (item) {
                        insertImageToHotel_id(hotel_id, item.filename);
                        console.log(item.filename);

                    })

                }).catch(function (err) {
                    //10.
                    console.log("Error in Transaction Begin " + err);
                    dbConn.close();
                });

        }).catch(function (err) {
            //11.
            console.log(err);
            dbConn.close();
        })
    }).catch(function (err) {
        //12.
        console.log(err);
    });
}
function insertImageToHotel_id(hotel_id, image) {
    //2.
    var dbConn = new sql.ConnectionPool(config);

    //3.
    dbConn.connect().then(function () {
        //4.
        var transaction = new sql.Transaction(dbConn);
        //5.
        transaction.begin().then(function () {
            //6.
            var request = new sql.Request(transaction);
            //7.
            request.query(`Insert into hotel_images (hotel_id,image) values (${hotel_id},'${image}')`)
                .then(function () {
                    //8.
                    transaction.commit().then(function (recordSet) {
                        console.log(recordSet);
                        dbConn.close();
                    }).catch(function (err) {
                        //9.
                        console.log("Error in Transaction Commit " + err);
                        dbConn.close();
                    });
                }).catch(function (err) {
                    //10.
                    console.log("Error in Transaction Begin " + err);
                    dbConn.close();
                });

        }).catch(function (err) {
            //11.
            console.log(err);
            dbConn.close();
        })
    }).catch(function (err) {
        //12.
        console.log(err);
    });
}