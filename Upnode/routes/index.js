var express = require('express');
var router = express.Router();

// Database connection
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/Upnode');

// Database schema
var Usercollection = db.model('usercollections', { 	
	username: String, 
	email: String 
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.jade', {title: 'hello'})
  console.log('Welcome!!!!!');
});

router.get('/helloworld', function(req,res,next){
	res.render('helloworld.jade', {title: 'World'})
})

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},function(err, docs){
        res.render('userlist.jade', {
            "userlist" : docs
        });
    });
});

// get new user from the database
router.get('/newuser', function(req,res){
	res.render('newuser', {title: 'Welcome new user'})
})

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});




module.exports = router;
