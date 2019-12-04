const express = require('express');
const router = express.Router();
var myssql = require("mssql");
const transaction = new myssql.Transaction();
const fs = require('fs');

var config = {
    user: "sa",
    password: "Lecanhduy1",
    server: "localhost",
    database: "hoteldatabase"
};

router.get('/signup', function (req, res) {
    res.render('signup');
});
router.post('/signup', function (req, res) {
    var data = req.body;

    var email = data.email;
    var username = data.username;
    var pass = data.password;
    var passConfirm = data.password2;

    myssql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new myssql.Request();

        // query to the database and get the records
        request.query('select * from usersinfo', function (err, recordsets) {
            var database = recordsets.recordset;
            if (err) {
                console.log(err);
            }
            var validateUser = 2; // 0 mean false, can't assign.
            // 0 : username already exis
            // 1 : not exis, can use .

            for (i = 0; i < database.length; i++) {
                let item = database[i];
                if (item.user_name === username) {
                    validateUser = 1;
                    break;
                }
            }

            if (passConfirm != pass) {
                res.send({
                    status: 0,
                    message: 'Hai mật khẩu không khớp, yêu cầu nhập lại'
                });
            }
            else if (validateUser == 1) {
                res.send({
                    status: 1,
                    message: 'Tài khoản đã tồn tại.'
                });
            }
            else {
                res.send({
                    status: 2,
                    message: 'Bạn đã đăng kí thành công.'
                });

                insertRow(username,pass,email);
            }


        });
    });



});

router.get('/signin', function (req, res) {
    res.render('signin');
});

router.post('/signin', function (req, res) {

    var userName = req.body.username;
    var password = req.body.password;

    var canSignIn = 0;
    var status = 0;


    myssql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new myssql.Request();
        // query to the database and get the records
        request.query('select user_name,password from usersinfo', function (err, recordsets) {
            var database = recordsets.recordset;
            if (err) {
                console.log(err);
            }

            for (i = 0; i < database.length; i++) {
                let item = database[i];
                if (item.user_name == userName && item.password == password) {
                    status = 1;
                    canSignIn = 1;
                    break;
                }
            }

            if (status == 0) { // mean false, can't signin
                res.send({
                    status: status,
                    message: 'Bạn đã nhập sai mật khẩu hoặc tài khoản không tồn tại.'
                });
            } else {
                res.send({
                    status: status,
                    message: '',
                    username: userName
                });
            }

        });
    });

});

function insertRow(username,password,email) {
    //2.
    var dbConn = new myssql.ConnectionPool(config);
    
    //3.
    dbConn.connect().then(function () {
        //4.
        var transaction = new myssql.Transaction(dbConn);
        //5.
        transaction.begin().then(function () {
            //6.
            var request = new myssql.Request(transaction);
            //7.
            request.query(`Insert into usersinfo (user_name,password,email) values ('${username}','${password}','${email}')`)
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
        });
    }).catch(function (err) {
        //12.
        console.log(err);
    });
}
module.exports = router;