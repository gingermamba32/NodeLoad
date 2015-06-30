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
var Post = db.model('post', { 	
	postname: String,
	postemail: String,
	postphone: String,
	postorg:  String,
	postcontent: String
});


/* GET Splash page to describe UCLA *************************/
router.get('/', function(req, res, next) {
  res.render('index.jade', {title: 'hello'})
});

// Get the tahnkyou page
router.get('/thankyou', function(req, res, next) {
  res.render('thankyou.jade', {title: 'hello'})
});



// Get the Proposals page with a get to the database and the proposals listed below
// including the form at the top to submit to the top of the page...and redirect you to a thank you page.

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    Post.find( {}, function(err, docs){
    	docs.reverse();
    	console.log(docs);
    	res.render('userlist', {'postlist': docs})
    })
});

// get new user from the database
router.get('/newuser', function(req,res){
	res.render('newuser', {title: 'Welcome new user'})
})

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

	var newpost = new Post({
		postname: req.body.postname,
		postemail: req.body.postemail,
		postphone: req.body.postphone,
		postorg:  req.body.postorg,
		postcontent: req.body.postcontent
	});

	console.log(newpost);
	newpost.save(function(err, callback){
		res.redirect('/thankyou');
	})
    
});

router.get('/deleteuser/:id', function(req, res){
	console.log(req.params.id);
	Post.remove({ _id: req.params.id }, function(){
		res.redirect('/userlist');
	});
});

router.get('/edituser/:id', function(req, res){
	Post.find({_id: req.params.id}, function(err, docs){
		console.log(docs + ' skljfjdksfds');
		res.render('edituser', { post: docs } );
	});
	
});

router.post('/update', function(req, res) {
		console.log(req.body.id);
		Post.findOneAndUpdate(
			{_id: req.body.id},
            {$set: {
                	_id     	      : req.body.id,
                    postname      	  : req.body.postname,
                    postcontent 	  :	req.body.postcontent 
            }}, 
            {upsert: false} , function(err, doc) {
            	res.redirect('userlist');
            });
            
    });






module.exports = router;
