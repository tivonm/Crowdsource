//Include outside libraries
var express = require('express');
var router = express.Router();
var debug = require('debug')('my-application');
var validator = require('validator');
var fs = require('fs');
var path = require('path');
var session =  require('client-sessions');
var CRUD = require(__dirname+'/models/all.js');
//var thinky = require('thinky');
thinky = require(__dirname+'/models/util/thinky.js');
var Errors = thinky.Errors;
var r = thinky.r;
var map = Array.prototype.map;

//login
router.get('/in', function(req, res) {
	res.render('login', { title: 'Login'});
});

/* Post /log/login. */
router.post('/in', function(req, res) {
    var message = "Document not found.";
    var value = 0;
    console.log("username: " + req.body.username);
    console.log("password: " + req.body.password);
    var user = CRUD.User.filter({username: req.body.username}).run().then(function(result) {
        console.log("user (below): \n" + JSON.stringify(result[0]));
    	if(result[0] == null){
            console.log("null")
            res.render('login', { title: "Login" , msg: 'Invalid username.'});
        } else if(result[0].password == req.body.password){
            req.session.user = {username: result[0].username, profilepic: result[0].profilePic, id: result[0].id};
            req.session.obj = result;
            console.log("user retrieved")
            res.redirect('/');
        } else {
        	console.log('well fuck me then');
            res.render('login', { title: "Login" , msg: 'Invalid password.'});
        }
    }).catch(Errors.DocumentNotFound , function(err) {
        res.render('login', { title: "Login" , msg: 'Invalid username.'});

    }).error(function(error) {
        // undecided about this as of now
    });
});

router.get('/out', function(req, res) {
	delete req.session.user;
 	res.redirect('log/in');
});


//forgot password page
/* Get /log/forgot */
router.get('/forgot', function(req, res) {
	res.render('forgotPassword', { title: 'Forgot Password' });
});

/* Post /log/forgot. */
router.post('/forgot', function(req, res) {
	var email = req.body.submit.email;
	res.render('login', { title: "Login" , msg: 'invalid username or password'});
});

//sCreate a user
/* Get /log/new/ */
router.get('/new', function(req, res) {

	res.render('createUser', { title: 'Create User' });
});

/* Post /log/new. */
router.post('/new', function(req, res) {
	//username password email profilepic
	var username = req.body.username;
	var password = req.body.password;
	var profilePic;
	var email = req.body.email;
	console.log("create user:\nusername: " + username + "\npassword: " + password + "\nemail: " + email);
	if(req.body.profilePic > 0){
		fs.readFile(req.body.profilePic.path, function (err, data){
		    var dirname = path.resolve(".")+'/public/files/userImages/';
		    var newPath = dirname + username;
		    fs.writeFile(newPath, data, function (err) {
			    if(err){
			    	debug('fileUploadFailed');
			    }else {
                    profilePic =  username;
				}
			});
		});
	}else{
        profilePic = 'generic.jpg';
	}
    console.log("Made it to before CRUD command");
    CRUD.User.filter({
    	username: username
	/*(function(row) {
	 console.log("Made it to filter");
        return row('username').eq(username).or(row("email").eq(email))*/
    }).run().then(function(result) {
        console.log("Made it to inside");
    	if(result[0] == null){
            console.log("Made it in if result[0]=null");
            var user = new CRUD.User({
                username: username,
                email: email,
                password: password,
                lastLogin: Date(),
                profilePic: profilePic
            });
            console.log("Made it to before save");
            user.save().then(function (doc) {
                console.log("User with ID: " + doc.id + " was saved.\n");
                req.session.user = {username: username, profilePic: profilePic, id: doc.id};
                res.redirect('/');
            }).catch(Errors.DuplicatePrimaryKey, function (err) {
                console.log("Duplicate primary key found.");
                res.render('createUser', {title: 'Create User'});
            }).error(function (error) {
                // undecided about this as of now
            });
        } else {
            console.log("Made it to else");
            res.render('createUser', {title: 'Create User'});
		}
    }).catch(Errors.DocumentNotFound , function(err) {
        console.log("Document not found.");
    }).error(function(error) {
        // undecided about this as of now
    });
});

module.exports = router;