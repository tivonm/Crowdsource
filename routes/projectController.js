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


router.get('/view', function(req, res) {
    getProjects().then(function(projects){
        getUsersWithIDs(projects).then(function(projects1){
            res.render('viewProjects', { title: 'Projects' , msg: "" , obj: projects1});
        },function(err){
            res.render('viewProjects', { title: 'Projects' , msg: err , obj: ""});
        });
    },function(err){
        //console.log(err);
        res.render('viewProjects', { title: 'Projects' , msg: err , obj: ""});
    });
});

function getUsersWithIDs(projects){
    return new Promise(function(resolve, reject) {
        //const promisedResults = ids.map(getProject);
        if(projects == null){
            resolve("");
        }
        var ids = 0
        for(var i = 0; i < projects.length; i++){
            if(ids == 0){
                ids[0] = projects[i].id;
            }else{
                ids.push(projects[i].id);
            }
        }
        const a = map.call(ids, getUserWithProject);
        var toRet = projects;
        Promise.all(a).then(users => {
            for (const currUser of users){
                toRet[i].username = currUser.username;
            }
            resolve(toRet);
    }).catch(reason => {
            return reject(reason);
    });
    });
}

function getProjects() { // returns 100 most recently created projects
    return new Promise(function(resolve, reject) {
        CRUD.Project.orderBy('createdDate').limit(100).run().then(function(result) {
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

/* Get /project/:id. Gets a specific project*/
router.get('/view/:id', function(req, res) {
    // the error res render needs to make sense, an obj isnt named
    // it was from before so i'm leaving to help with your thought process
	var id = req.params.id;
    var message = ""

    Promise.all([
        getProject(id),
        getSubmissions(id),
        getUserWithProject(id)
    ]).then(([project1, submissions1, user1]) => {
        user1.project = project1;
        user1.project.submissions = submissions1;
        res.render('viewProject', { title: 'Created Project' , msg: '', obj: user1});
    }).catch(err => {
        // need res for errors
    });
});


function getUserWithProject(id){
    return new Promise(function(resolve, reject) {
        CRUD.User.filter(function(user1) {
            return user1("yourProjectIds").contains(id)
        }).run().then(function(result) {
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


function getProject(id) { // project with id
    return new Promise(function(resolve, reject) {
        CRUD.Project.get(id).run().then(function(result) {
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

// gets submissions for a project from a project id
function getSubmissions(id){
    return new Promise(function(resolve, reject) {
        CRUD.Submission.filter({projectId:id}).run().then(function(result) {
            // output here
            resolve(result);
        }).error(function(err) {
            return reject(err);
        });
    });
}

//Create projects
/* Get /project/create. Create project form.*/
router.get('/new', function(req, res) {
	res.render('createProject', { title: 'Create Project', msg: "" });
});

/* Post /project. */
router.post('/new', function(req, res) {
    // need to fix these res renders, unsure where they go
	var formValues = req.body;
    console.log(JSON.stringify(formValues));
    console.log(JSON.stringify(req));
	var err = "";
	if(formValues.name.length < 1 || formValues.name.length > 20){
		err += "Invalid Name. \n";
	}
	if(formValues.description.length < 10 || formValues.description.length > 150){
		err += "Invalid description. \n";
	}
	if(formValues.tags.length < 0 || formValues.description.length > 50){
		err += "Invalid tags. \n";
	}
    if(!(formValues.additionalResources == null || formValues.additionalResources.length == 0)){
    	if(formValues.additionalResources.originalFilename.length > 0 && !formValues.additionalResources.originalFilename.endswith('.zip')){
    		err += "Invalid Additional Resource. Must be a zip file."; 
    	}
    }
	if( err.length > 0){
		res.render('createProject', { title: 'Create Project', msg: err, obj: formValues });
	}
	var name = formValues.name.replace(/^([a-zA-Z0-9 _-]+)$/gi,'');
	var spaceTags = formValues.tags.split(',');
	spaceTags.forEach(function(value) {
  		value = value.trim(); 
	});
	var tags = spaceTags;
	var description = validator.escape(formValues.description);
	var fileName;
	var userId = req.session.user.id;
	var userName = req.session.user.name;

    if(formValues.additionalResources != null || formValues.additionalResources.length == 0){
    	if(formValues.additionalResources.originalFilename > 0){
    		fs.readFile(formValues.additionalResources.path, function (err, data){
    		    var dirname = path.resolve(".")+'/public/files/submissionFiles/';
    		    var newPath = dirname + name + "." + userName;
    		    fs.writeFile(newPath, data, function (err) {
    			    if(err){
    			    	debug('fileUploadFailed');
    			    }else {
    			  		fileName = name + "." + userName;
    				}
    			});
    		});
    	}
    }

    formValues.tags = tags;
    formValues.description = description;
    formValues.userId = userId;
    formValues.username = userName;
    formValues.name = name;
    formValues.resourceFile = fileName;
    formValues.createdDate = Date();



    var project = createProjectObject(formValues);
    createProject(project).then(function(projectId){
        var testItem = {obj: projectId};
        console.log(JSON.stringify(testItem.obj));

        getProject(projectId).then(function(project){

            getUserWithProject(projectId).then(function(currUser){
                project.username = currUser.username;
                res.render('viewProject', { title:formValues.name , obj: project });
            },function(err){
                //console.log(err);
                res.render('error', {
                    message: 'Sorry, project not found.',
                    error: err
                });
            });
        },function(err){
            //console.log(err);
            res.render('error', {
                message: 'Sorry, project not found.',
                error: err
            });
        });
    },function(err){
        //console.log(err);
        res.render('error', {
            message: 'Sorry, project not found.',
            error: err
        });
    });
});

function createProjectObject(formValues){
    var project = new CRUD.Project({
        name: formValues.name,
        userId: formValues.userId,
        description: formValues.description,
        tags: formValues.tags,
        createdDate: formValues.createdDate,
        resourceFile: formValues.resourceFile,
        status: formValues.status,
        submissionIds: formValues.submissionIds,
        acceptedSubmissionId: formValues.acceptedSubmissionId
    });
    return project;
}

function createProject(project){
    return new Promise(function(resolve, reject) {
        project.save().then(function (doc) {
            //console.log("Project with ID: " + project.id + " was saved.\n");
            resolve(project.id);
        }).catch(Errors.DuplicatePrimaryKey, function (err) {
            //console.log("Duplicate primary key found.");
            return reject(err);
        }).error(function (err) {
            // not specific error, just a wide catch
            return reject(err);
        });
    });
}


//UpdateProjects
/* Get /project/new/:id. */
router.get('/new/:id', function(req, res) {
    // get project w/ id
    res.render('updateProject', { title: 'Update Project' , index: req.params.id});
});

/* Put /new/:id. */
router.put('/new/:id', function(req, res) {
    // unsure what this needs, if update a given project while being given the
    // entire project, make sure req.body is the project, and req.body.id is the id
	var id = req.params.id; // idk if this is needed
    // need to fix renders
    updateProject(req.body).then(function(id){
        // output
        res.render('confirmation', { title: 'Updated Project' , index: id , obj: 'project', action: 'updated'});
    },function(err){
        //console.log(err);
        res.render('error', {
            message: 'Sorry, project not found.',
            error: err
        });
    });
});

function updateProject(body){
    return new Promise(function(resolve, reject) {
        CRUD.Project.get(body.id).update(body).then(function(result) {
            resolve(result);
        }).catch(Errors.DocumentNotFound , function(err) {
            // output here
            return reject(err);
        }).error(function(err) {
            return reject(err);
        });
    });
}

/* Get /project/submit/:id */
router.get('/submit/:id', function(req, res) { //
	res.render('submission', { title: 'Update Project' , index: req.params.id});
});

/* Post /submit. */
router.post('/submit/:id', function(req, res) { // add submission to project
    var projectID = req.params.id;
    var formValues = req.body.formValues;
    var submission = createSubmissionObject(formValues);

    Promise.all([
        getProjectAndAddSubmissionID(id, submissionID),
        createSubmission(submission),
    ]).then(([result1, result2]) => {
        // unsure what you want returned
        // need res for this
    }).catch(err => {
        // need res for errors
    });

});

function getProjectAndAddSubmissionID(id, submissionID){
    getProject(id).then(function(project){
        project.submissionIds.push(submissionID);
        updateProject(project).then(function(updatedProject){
            // output
        },function(err){
            //console.log(err);
            res.render('error', {
                message: 'Sorry, project not found.',
                error: err
            });
        });
    },function(err){
        //console.log(err);
        res.render('error', {
            message: 'Sorry, project not found.',
            error: err
        });
    });
}

function createSubmissionObject(formValues){
    var submission = new CRUD.Submission({
        id: formValues.id,
        projectId: formValues.projectId,
        userId: formValues.userId,
        rating: formValues.rating,
        submissionDate: formValues.submissionDate,
        accepted: formValues.submissionDate,
        feedback: formValues.feedback,
        fileUrl: formValues.fileUrl
    });
    return submission;
}

function createSubmission(submission){
    return new Promise(function(resolve, reject) {
        submission.save().then(function (doc) {
            //console.log("Project with ID: " + project.id + " was saved.\n");
            resolve(submission.id);
        }).catch(Errors.DuplicatePrimaryKey, function (err) {
            //console.log("Duplicate primary key found.");
            return reject(err);
        }).error(function (error) {
            // not specific error, just a wide catch
            return reject(err);
        });
    });
}

/* Get /project/user/:id */
router.get('/user/:id', function(req, res) {
	var id = req.params.id;
    getProjectsOfUser(id).then(function(projects){
        // output
        // need res
    },function(err){
        //console.log(err);
        res.render('error', {
            message: 'Sorry, project not found.',
            error: err
        });
    });
	res.redirect('/project/' + projectId);
});

function getProjectsOfUser(id){
    return new Promise(function(resolve, reject) {
        CRUD.Projects.filter({userId:id}).run().then(function(result) {
            // output here
            resolve(result);
        }).error(function(err) {
            return reject(err);
        });
    });
}

module.exports = router;