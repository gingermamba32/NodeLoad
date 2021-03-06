var express = require('express');
var router = express.Router();
var path = require('path');
var moment = require('moment');
// Database connection
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/Upnode');
// mongolabs connection
// var db = mongoose.connect( 'mongodb://leigh1:leigh1@ds061751.mongolab.com:61751/upnode2015' );


try{
	var uristring = require('./mongolabinfo.js').name;
}
catch(err){
	console.log("no connection file so go on to Heroku config var");
	var uristring = process.env.MONGOLAB_URI;   //if Heroku env
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
var hardadminperson = "admin";
var hardadminpass = "admin";
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
		    	res.render('userlist', {'postlist': docs, moment: moment})
		    })
	}

	else {
		console.log('admin blocked');
		res.redirect('/');
	}

});
//******************************************
// get form submittal page
router.get('/newuser', function(req, res){
	res.render('newuser', {title: 'Welcome new user'})
})

// New angular send post page
router.get('/sendpost', function(req,res){
	res.sendFile(path.join(__dirname, '../views/newpost.html') );
})

//**************************************************

router.get('/login', function(req, res){
	res.render('login', {title: 'Login Page'})
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
    if (verifyuser(username, password)) {

        console.log(username + " " + password + " is user ");
        res.cookie('username', req.body.username);
        res.cookie('password', req.body.password);
        res.cookie('datecookie', Date.now());
        res.redirect('userlist');

        }
    else {
        console.log("not a valid login "); res.send('not a valid login')
    }

})

router.get('/logout', function(req, res){
	// entire cookei
	res.clearCookie('datecookie');
	res.clearCookie('username');
	res.clearCookie('password');
	res.redirect('/');
})


// used for valid cookie verification
function verifyuser (username, password){
    if ( (username === hardadminperson) && (password === hardadminpass ) ) 
        {loggedin = true;}
    else
    	{loggedin = false;}
    return loggedin;
}

// used for valid login for hours ************************
function recent (cookieTime){
	if ( (Date.now() - cookieTime ) <= 3600000 ) {
		return true;
	}
}


module.exports = router;
