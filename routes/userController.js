//Include outside libraries
var express = require('express');
var router = express.Router();
var debug = require('debug')('my-application');
var validator = require('validator');
var fs = require('fs');
var path = require('path');
var session =  require('client-sessions');
var CRUD = require(__dirname+'/models/all.js');
var Errors = thinky.Errors;
var r = thinky.r;
var map = Array.prototype.map;






//Include Crowdsource functions
var dbm = require('../databaseFunctions/databaseManagerMock.js');

   
/* Getting for viewing a user:
   User First Name: obj.user.firstName
   User Last Name: obj.user.lastName
   User Username: obj.user.username
   User Profile Pic: obj.user.profilePic
   User Top Tags: obj.projects.tags
   
   User Submission file name: obj.submissions.fileName
   User submission rating: obj.submission.rating

   User Project Requests Name: obj.projects.name
   User Project Requests Description: obj.projects.description
   User Project Requests Created Date: obj.projects.createdDate

*/

/* Giving for creating a User:
	User First Name: firstname
	User Last Name: lastName
	User username: username
	User password: password
	User email: email
	User profile pic: profilePic
*/
//view user
/* Get /user/view */
router.get('/view', function(req, res) {



});

function getUsers(){
    return new Promise(function(resolve, reject) {
        CRUD.User.orderBy('lastLogin').limit(100).run().then(function(result) {
            // console.log(JSON.stringify(result) + "\nAbove projects were retrieved.\n");
            resolve(result);
        }).catch(Errors.DocumentNotFound , function(err) {
            console.log("Document not found.");
            return reject(err);
        }).error(function(err) {
            return reject(err);
        });
    });
}

function getUser(id) {
    return new Promise(function(resolve, reject) {
        CRUD.User.get(id).run().then(function(result) {
            //console.log(JSON.stringify(result) + "\nAbove user was retrieved.\n");
            resolve(result);
        }).catch(Errors.DocumentNotFound , function(err) {
            console.log("Document not found.");
            return reject(err);
        }).error(function(err) {
            return reject(err);
        });
    });
}

/* Get /user/view/:id. */
router.get('/view/:id', function(req, res) {
	var id = req.params.id;

});


function createUserObject(formValues){
    var user = new module.exports.Project({
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
        lastLogin: formValues.lastLogin,
        profilePic: formValues.profilePic,
        facebookId: formValues.facebookId,
        watchedProjectIds: formValues.watchedProjectIds,
        yourProjectIds: formValues.yourProjectIds,
        submittedProjectIds: formValues.submittedProjectIds
    });
    return user;
}

function createUser(user){
    return new Promise(function(resolve, reject) {
        user.save().then(function (doc) {
            //console.log("Project with ID: " + project.id + " was saved.\n");
            resolve(user.id);
        }).catch(Errors.DuplicatePrimaryKey, function (err) {
            //console.log("Duplicate primary key found.");
            return reject(err);
        }).error(function (error) {
            // not specific error, just a wide catch
            return reject(err);
        });
    });
}

function updateUser(body){
    return new Promise(function(resolve, reject) {
        CRUD.User.get(body.id).update(body).then(function(result) {
            resolve(result);
        }).catch(Errors.DocumentNotFound , function(err) {
            // output here
            return reject(err);
        }).error(function(err) {
            return reject(err);
        });
    });
}



module.exports = router;