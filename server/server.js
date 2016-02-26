var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');
var gcm = require('node-gcm');
var dbscript = require('./db/dbscript');
var DeviceToken = require('./models/deviceToken.js');
var path = require('path');
var favicon = require('serve-favicon');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var appSocket = require('./sockets/socket.js')(io);
var session = require('express-session');

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe.
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use('/', require('./routes'));
// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    //res.sendFile(path.join(__dirname + '/public/views/404.html'));
});

app.use(function (err, req, res, next) {
    if (err.status !== 404) {
        return next();
    }

    res.sendFile(path.join(__dirname + '/public/views/404.html'));
});

// Start the server
app.set('port', process.env.PORT || 3000);
var server = http.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});