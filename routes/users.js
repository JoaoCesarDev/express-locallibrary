var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index',{title:'respond with a resource'});
});
router.get('/cool', function(req, res, next) {
  res.render('index',{title:'Você é tão legal'});
});

module.exports = router;
