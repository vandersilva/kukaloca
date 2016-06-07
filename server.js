require('rootpath')();
var favicon = require('serve-favicon');
var path = require('path');

var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

var logger = require("./utils/logger");
//logger.debug("Overriding 'Express' logger");
//app.use(require('morgan')({ "stream": logger.stream }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/kukaloca/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/api/trainings', require('./controllers/api/trainings.controller'));

// make '/kukaloca/app' default route
app.get('/', function (req, res) {
    //res.sendStatus(404);
    res.status(401).send('Test bed environment for Vanderlei\'s kukaloca. A playground for learning and having fun with new tech (and at times, be reminded that I am getting older and a bit slower)...');
});
// make '/kukaloca' default route
app.get('/kukaloca', function (req, res) {
    return res.redirect('/kukaloca/app');
});
// make '/kuka' default route
app.get('/kuka', function (req, res) {
    return res.redirect('/kukaloca/app');
});
// make '/nodejs' default route
app.get('/nodejs', function (req, res) {
    return res.redirect('/kukaloca/app');
});
// make '/nodejs' default route
app.get('/testapp', function (req, res) {
    return res.redirect('/kukaloca/app');
});


// favicon in /home

logger.debug("Favicon dir: %s", __dirname);
app.use(favicon(path.join(__dirname, '\\app\\home', 'favicon.ico'))); 


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
//app.set('port', port);

// start server
var server = app.listen(port, function () {
    logger.info('Server listening at http://' + server.address().address + ':' + server.address().port);
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
