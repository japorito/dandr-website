var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('dashboard', {
        title: 'Administration'
    });
});

router.get('/users', function(req, res, next) {
    res.render('users', {
        title : 'Manage Users'
    });
});

module.exports = router;
