var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var logger = require('utils/logger');

router.get('/', function (req, res) {
    // log user out
    logger.debug("login.controller.js get method");
    delete req.session.token;

    // move success message into local variable so it only appears once (single read)
    var viewData = { success: req.session.success };
    delete req.session.success;

    res.render('login', viewData);
    //var loginURL = '/login?returnUrl=%2F' + config.urlPath + '%2Fapp%2F';
    //return res.redirect(loginURL);

});

router.post('/', function (req, res) {
    logger.debug("About to log in, inside login.controller");
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/authenticate',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('login', { error: 'An error occurred' });
        }

        if (!body.token) {
            return res.render('login', { error: 'Username or password is incorrect', username: req.body.username });
        }

        // save JWT token in the session to make it available to the angular app
        req.session.token = body.token;

        // redirect to returnUrl
        var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
        res.redirect(returnUrl);
    });
});

module.exports = router;