const express = require('express');
const router = express.Router();
var expressValidator = require('express-validator');
var myssql = require("mssql");
var config = {
    user: "sa",
    password: "Lecanhduy1",
    server: "localhost",
    database: "hoteldatabase"
};

router.use(expressValidator());

router.get('/signup', function (req, res) {
    res.render('signup');
});
router.post('/signup', function (req, res) {
    var data = req.body;

    var email = data.email;
    var username = data.username;
    var pass = data.password;
    var passConfirm = data.password2;

    req.checkBody('Name','Name is required.').notEmpty();
    req.checkBody('User name','User name is required.').notEmpty();
    req.checkBody('password','Password on is required.').notEmpty();
    req.checkBody('Reconfirm password','Reconfirm password is required.').notEmpty();

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
            var checkUserExis = 0; // 0 mean not exis in database therefore you can assign this username.

            for (i = 0; i < database.length; i++) {
                var item = database[i];
                
                if (item.user_name === username) {
                    checkUserExis = 1
                    break;
                }

            }
            console.log(checkUserExis);
            
            if (checkUserExis = 1) {
                // res.render('signup', { error: { errText: 'Tài khoản đã tồn tại' } });
            } else {
                // res.flash('Welcome','Welcome to mypage, dumb ass');
                res.render('signin');
            }

        });
    });


});

router.get('/signin', function (req, res) {
    res.render('signin');
    // console.log('hello duy');

});

router.post('/signin', function (req, res) {


});


module.exports = router;