//Include outside libraries
var express = require('express');
var router = express.Router();
var debug = require('debug')('my-application');
var validator = require('validator');
var fs = require('fs');
var path = require('path');
var session =  require('client-sessions');

//Include Crowdsource functions
var dbm = require('../databaseFunctions/databaseManagerMock.js');

//sCreate a user
/* Get /user/new/ */
router.get('/new', function(req, res) {
	res.render('createUser', { title: 'Create User' });
});

/* Post /user/new. */
router.post('/new', function(req, res) {
	//username password email profilepic
	res.render('viewProject', { title: 'Created Project' , msg: '', obj: project});
});


//forgot password page
/* Get /user/forgot */
router.get('/forgot', function(req, res) {
	res.render('updateProject', { title: 'Update Project' , index: req.params.id});
});

/* Post /user/forgot. */
router.post('/forgot', function(req, res) {
	res.render('viewProject', { title: 'Created Project' , msg: '', obj: project});
});

//login
/* Get /user/login */
router.get('/login', function(req, res) {
	res.render('updateProject', { title: 'Update Project' , index: req.params.id});
});

/* Post /user/login. */
router.post('/login', function(req, res) {
	var user = req.body.submit;
	var valid = dbm.checkLogin(req.body.submit)
	if (valid.status) {
		req.session.user = valid.value;
		res.redirect('/');
	} else {
		res.render('login', { title: "Login" , msg: 'invalid username or password'});
	}
});

//view user
/* Get /user/view */
router.get('/view', function(req, res) {
	var projects = dbm.getUsers();

});

/* Get /user/view/:id. */
router.get('/view/:id', function(req, res) {
	var user = dbm.getUser(req.params.id);
});

module.exports = router;