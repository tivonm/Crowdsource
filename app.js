var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var session =  require('client-sessions');
var fileUpload = require('express-fileupload');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//tell node which parsers to use.
app.use(favicon());
app.use(fileUpload());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    cookieName: 'session',
    secret: 'Cs425Fall2016AndCs499Spring2017',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

//controller routes
var index = require('./routes/index');
var project = require('./routes/projectController');
var user = require('./routes/userController');
var login = require('./routes/login');
var api = require('./routes/api');
app.use('/log', login);

// a middleware function that checks if the user is logged in every time a new page is called
app.use(function (req, res, next) {
    
    if (req.session.user ==null) {
        res.redirect('/log/in');
    } else {
        next();
    }
});

//called routes
app.use('/', index);
app.use('/project', project);
app.use('/user', user);
app.use('/api', api);

// call error
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// print trace of 404
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// show 404 with no trace
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;