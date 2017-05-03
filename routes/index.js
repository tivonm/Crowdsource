var express = require('express');
var router = express.Router();
var CRUD = require(__dirname+'/models/all.js');
thinky = require(__dirname+'/models/util/thinky.js');
var Errors = thinky.Errors;
var r = thinky.r;
var map = Array.prototype.map;
var Errors = thinky.Errors;
var r = thinky.r;

// relationships
//CRUD.User.hasMany(CRUD.Project, "projects", "id", "userID");
//CRUD.Project.belongsTo(CRUD.User, "user", "userID", "id");


/*Projects{
    Project name: obj.projects.name
    Project Description: obj.projects.description
    Project Created Date: obj.projects.createdDate
    Project Tags: obj.projects.tags
}*/


/* GET home page. */
router.get('/', function(req, res) {
    if(!req.session.user.id){
        res.render('login', { title: 'Login'});
    }
    getUser(req.session.user.id).then(function(user){
        Promise.all([
            getUserProjects(req.session.user.id),
            getListOfProjects(user.watchedProjectIds),
            getListOfProjects(user.submittedProjectIds)
        ]).then(([result1, result2, result3]) => {
            user.projects = result1;
            user.watchedProjects = result2;
            user.submittedProjects = result3;
        res.render('index', {title: 'Home', obj: user});
        }).catch(err => {
            res.render('error', {
                message: 'Sorry, user and projects not found.',
                error: err
            });
        });
    },function(err){
        //console.log(err);
        res.render('error', {
            message: 'Sorry, user not found.',
            error: err
        });
    });
});




function getUser(id){
    return new Promise(function(resolve, reject) {
        CRUD.User.get(id).run().then(function(result) {
            // output here
            resolve(result);
        }).error(function(err) {
            return reject(err);
        });
    });
}

function getUserProjects(id){
    return new Promise(function(resolve, reject) {
        CRUD.Project.filter({userId: id}).run().then(function(result) {
            //console.log("projects (below): \n" + JSON.stringify(result));
            if(result[0] == null){
                resolve("");
            } else {
                //console.log('got projects!');
                resolve(result);
                //res.render('index', {title: 'Home', obj: {projects: result1, submitted: submitted, watched: watched }});
            }
        }).catch(Errors.DocumentNotFound , function(err) {
            return reject(err);
            //res.render('index', { title: 'Home' });
        }).error(function(err) {
            return reject(err);
        });
    });
}


/*Watch Projects{
    Project Name: obj.projects.name
    Project Description: obj.projects.description
    Project Created Date: obj.projects.createdDate
    Project Tags: obj.projects.tags 
  }*/
function getListOfProjects(ids){
    return new Promise(function(resolve, reject) {
        //const promisedResults = ids.map(getProject);
        if(ids == null){
            resolve("");
        }
        const a = map.call(ids, getProject);
        var toRet = [0];
        Promise.all(/*promisedResults*/a).then(retObjs => {
            for (const retObj of retObjs){
                if (toRet[0] == 0) {
                    toRet[0] = retObj;
                } else {
                    toRet.push(retObj);
                }
            }
        resolve(toRet);
        }).catch(reason => {
            return reject(reason);
        });
    });
}



function getProject(id){
    return new Promise(function(resolve, reject) {
        CRUD.Project.get(id).run().then(function(result) {
            // output here
            resolve(result);
        }).error(function(err) {
            return reject(err);
        });
    });
}

module.exports = router;
