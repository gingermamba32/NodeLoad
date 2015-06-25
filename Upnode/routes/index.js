var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.jade', {title: 'hello'})
  console.log('Welcome');
});

router.get('/helloworld', function(req,res,next){
	res.render('helloworld.jade', {title: 'World'})
})

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(err, docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

module.exports = router;
