var express = require('express');
var router = express.Router();

// Database connection
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/Upnode');
// mongolabs connection
// var db = mongoose.connect( 'mongodb://leigh1:leigh1@ds061751.mongolab.com:61751/upnode2015' );
var uristring;

try{
	uristring = require('./mongolabinfo.js').name;
}
catch(err){
	console.log("no connection file so go on to Heroku config var")
	uristring = process.env.MONGOLAB_URI;   //if Heroku env
}

console.log("uristring is "+ uristring);

var db = mongoose.connect( uristring ); 


// Database schema
var User = db.model('user', { 	
	username: String, 
	email: String 
});


/* GET Splash page to describe UCLA */
router.get('/', function(req, res, next) {
  res.render('index.jade', {title: 'hello'})
  console.log('Welcome!!!!!');
});


// Get the Proposals page with a get to the database and the proposals listed below
// including the form at the top to submit to the top of the page...and redirect you to a thank you page.



/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    User.find({}, function(err, docs){
    	console.log(docs);
    	res.render('userlist', {
    		'userlist': docs
    	})
    })
});

// get new user from the database
router.get('/newuser', function(req,res){
	res.render('newuser', {title: 'Welcome new user'})
})

/* POST to Add User Service */
router.post('/adduser', function(req, res) {
	var newuser = new User({
		username: req.body.username,
		email: req.body.email
	});
	console.log(newuser);
	newuser.save(function(err, callback){
		res.redirect('userlist');
	})
    
});




module.exports = router;
