var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET access denied page. */
router.get('/denied', function(req, res, next) {
  res.render('denied', { title: 'Access Denied' });
});

module.exports = router;
