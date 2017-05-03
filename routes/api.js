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
router.post('/watch', function(req, res) {
    var userId = req.body.userId;
    var projectId = req.body.projectId;
    getUser(userId).then(function(user){
        if(user.watchedProjectIds.includes(projectId)){
            var index = user.watchedProjectIds.indexOf(projectId);
            if (index > -1) {
                user.watchedProjectIds.splice(index, 1);
                updateUser(user);
                res.write("ok");
            } else {
                res.write("error");
            }
        } else {
            user.watchedProjectIds.push(projectId);
            updateUser(user);
            res.write("ok");
        }
    },function(err){
        //console.log(err);
        res.write("error");
    });
});

function getUser(id) {
    return new Promise(function(resolve, reject) {
        CRUD.User.get(id).run().then(function(result) {
            //console.log(JSON.stringify(result) + "\nAbove user was retrieved.\n");
            resolve(result);
        }).catch(Errors.DocumentNotFound , function(err) {
            //console.log("Document not found.");
            return reject(err);
        }).error(function(err) {
            return reject(err);
        });
    });
}

function updateUser(body){
    return new Promise(function(resolve, reject) {
        CRUD.User.get(body.id).update(body).then(function(result) {
            //console.log("User with id " + result + " was updated.\n");
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