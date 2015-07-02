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


// Submit schema
var Post = db.model('post', { 	
	postname: String,
	postemail: String,
	postphone: String,
	postorg:  String,
	postcontent: String,
	date: {type: Date}
});

// ADMIN USER
var hardadminperson = "joe";
var hardadminpass = "secret";
var cookieTime;


// // User schema
// var User = db.model('user', { 	
// 	username: String,
// 	password: String
// });

/* GET Splash page to describe UCLA *************************/
router.get('/', function(req, res, next) {
  res.render('index.jade');
});

// Get the tahnkyou page
router.get('/thankyou', function(req, res, next) {
  res.render('thankyou.jade');
});



// Get the Proposals page with a get to the database and the proposals listed below
// including the form at the top to submit to the top of the page...and redirect you to a thank you page.

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    
    var cookieTime = req.cookies.datecookie;
    

    console.log(req.cookies.datecookie);



	if ( recent(cookieTime) ){


		    Post.find( {}, function(err, docs) {
		    	docs.reverse();
		    	console.log(docs + "userlist");
		    	res.render('userlist', {'postlist': docs})
		    })
	}

	else {
		console.log('admin blocked');
		res.redirect('/');
	}

});

// get new user from the database
router.get('/newuser', function(req, res){
	res.render('newuser', {title: 'Welcome new user'})
})

router.get('/login', function(req, res){
	res.render('login', {title: 'Login Page'})
})

router.get('/about', function(req,res){
	res.render('about');
})

/* POST to Add User to Mongo */
router.post('/adduser', function(req, res) {
	var date = Date.now();
	var newpost = new Post({
		postname: req.body.postname,
		postemail: req.body.postemail,
		postphone: req.body.postphone,
		postorg:  req.body.postorg,
		postcontent: req.body.postcontent,
		date: date
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
		console.log(docs + ' User to edit');
		res.render('edituser.jade', { post: docs } );
	});
});

router.post('/update', function(req, res) {
		console.log(req.body.id);
		Post.findOneAndUpdate(
			{_id: req.body.id},
            {$set: {
                	_id     	      : req.body.id,
                    postname      	  : req.body.postname,
                    postemail 		  : req.body.postemail,
                    postphone         : req.body.postphone,
                    postorg           : req.body.postorg,
                    postcontent 	  :	req.body.postcontent 
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log(docs + "Updated Document");
            	res.redirect('userlist');
            });          
    });

router.get('/singleview/:id', function(req, res){
	Post.find({_id: req.params.id}, function(err, docs){
		console.log(docs + ' single view');
		res.render('singleview', { post: docs } );
	});
});

// verify if user exists on the loginpage .... need to send cookies back to the client
router.post('/verify', function(req, res){
	console.log(req.body.username);
    console.log(req.body.password);

    var username = req.body.username;
    var password = req.body.password;
    if (verifyuser(username, password))
        {
        console.log(username + " " + password + " is user ");
        res.cookie('username', req.body.username);
        res.cookie('password', req.body.password);
        res.cookie('datecookie', Date.now());

        }
    else
        {console.log("not a valid login "); res.send('not a valid login')}

	res.redirect('/');
})



function verifyuser (username, password){
    if ( (username === hardadminperson) && (password === hardadminpass ) ) 
        {loggedin = true;}
    else
    	{loggedin = false;}
    return loggedin;
}

function recent (cookieTime){
	if ( (cookieTime + 20000) >= Date.now() ){
		return true;
	}
}








module.exports = router;
