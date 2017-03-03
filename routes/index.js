var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dungeons and Randomness' });
});

/* GET access denied page. */
router.get('/denied', function(req, res, next) {
  res.render('denied', { title: 'Dungeons and Randomness' });
});

module.exports = router;
