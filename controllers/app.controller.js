var express = require('express');
var router = express.Router();
var logger = require("../utils/logger");


// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
    //logger.debug("Inside app.controller.js");
    if (req.path !== '/login' && !req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/kukaloca/app' + req.path));
    }

    next();
});

// make JWT token available to angular app
router.get('/token', function (req, res) {
    res.send(req.session.token);
});

// serve angular app files from the '/app' route
router.use('/', express.static('app'));

module.exports = router;