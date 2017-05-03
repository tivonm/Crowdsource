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
var mkdirp = require('mkdirp');


router.get('/view', function(req, res) {
    getProjects().then(function(projects){
        getUsersWithIds(projects).then(function(projects1){
            res.render('viewProjects', { title: 'Projects' , msg: "" , obj: projects1});
        },function(err){
            res.render('viewProjects', { title: 'Projects' , msg: err , obj: ""});
        });
    },function(err){
        //console.log(err);
        res.render('viewProjects', { title: 'Projects' , msg: err , obj: ""});
    });
});

function getUsersWithIds(projects){
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
        var counter = 0;
        Promise.all(a).then(users => {
            for (const currUser of users){
                toRet[counter].username = currUser.username;
                counter++;
            }
            resolve(toRet);
    }).catch(reason => {
            return reject(reason);
    });
    });
}

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

function getProjects() { // returns 100 most recently created projects
    return new Promise(function(resolve, reject) {
        CRUD.Project.orderBy('createdDate').limit(100).run().then(function(result) {
            // console.log(JSON.stringify(result) + "\nAbove projects were retrieved.\n");
            resolve(result);
        }).catch(Errors.DocumentNotFound , function(err) {
            //console.log("Document not found.");
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
	//console.log("Id: " + id);
    var message = "";

    getProject(id).then(function(project){
        //console.log("Current project retrieved:\n" +JSON.stringify(project) + "\n");
        Promise.all([
            getSubmissions(project.id),
            getUser(project.userId)
        ]).then(([submissions1, user1]) => {
            user1.project = project;
            user1.project.submittedProjects = submissions1;
            //console.log(JSON.stringify(user1) + "\nAbove object was retrieved.\n");
            getUsersWithSubmissions(user1.project.submittedProjects).then(function(submissions){
                user1.project.submittedProjects = submissions;
                console.log(JSON.stringify(user1, undefined, 2) + "\nAbove object was retrieved.\n");
                res.render('viewProject', { title: 'Created Project' , msg: '', obj: user1});
            },function(err){
                res.render('viewProjects', { title: 'Projects' , msg: err , obj: ""});
            });

    }).catch(err => {
            // need res for errors
        });
    },function(err){
        //console.log(err);
        res.render('error', {
            message: 'Sorry, project not found.',
            error: err
        });
    });
});

function getUsersWithSubmissions(submissions){
    return new Promise(function(resolve, reject) {
        //const promisedResults = ids.map(getProject);
        if(Array.isArray(submissions) && submissions.length <= 0){
            //console.log("<=0.");
            resolve(submissions);
        } else if (!Array.isArray(submissions)){
            //console.log("!isArr.");
            resolve(submissions);
        } else {
            var ids = 0
            for(var i = 0; i < submissions.length; i++){
                if(ids == 0){
                    ids[0] = submissions[i].userId;
                }else{
                    ids.push(submissions[i].userId);
                }
            }
            //console.log("There are "+ids.length+" submissions.");
            const a = map.call(ids, getUser);
            var toRet = submissions;
            var counter = 0;
            Promise.all(a).then(users => {
                for (const currUser of users){
                    toRet[counter].username = currUser.username;
                    counter++;
                }
                resolve(toRet);
            }).catch(reason => {
                return reject(reason);
            });
        }
    });
}

function getUserWithProject(projectId){
    return new Promise(function(resolve, reject) {
        CRUD.User.filter(function(user) {
            return user("yourProjectIds").contains(projectId);
        }).run().then(function(result) {
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

function getProject(id) { // project with id
    return new Promise(function(resolve, reject) {
        CRUD.Project.get(id).run().then(function(result) {
            //console.log(JSON.stringify(result) + "\nAbove project was retrieved.\n");
            resolve(result);
        }).catch(Errors.DocumentNotFound , function(err) {
            //console.log("Document not found.");
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
            //console.log(JSON.stringify(result) + "\nAbove submissions were retrieved.\n");
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
    //console.log("Form values:\n"+JSON.stringify(formValues));
    //console.log(JSON.stringify(req));
	var err = "";
	if(formValues.name.length < 1 || formValues.name.length > 20){
		err += "Invalid name, must be between 1 and 20 characters. \n";
	}
	if(formValues.description.length < 10 || formValues.description.length > 150){
		err += "Invalid description length, must be between 10 and 150 characters. \n";
	}
	if(formValues.tags.length < 0 || formValues.description.length > 50){
		err += "Invalid tags, must have one or more, and be less than 50 characters. \n";
	}
	if( err.length > 0){
		res.render('createProject', { title: 'Create Project', msg: err, obj: formValues });
	}
	var name = formValues.name;
	var spaceTags = formValues.tags.split(',');
	for(i=0;i<spaceTags.length;i++)
    {
        spaceTags[i] = spaceTags[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
	var tags = spaceTags;
	var description = validator.escape(formValues.description);
	var fileName;
	var userId = req.session.user.id;
	var userName = req.session.user.name;

    if(req.files.additionalResources != null){
        var  additionalResources = req.files.additionalResources;
        var lowPath = path.join(__dirname, '..');
        var pathName = "/public/files/projectFiles/" + userId;
        if(!fs.existsSync(lowPath + pathName)){
            mkdirp(lowPath + pathName, function (err) {
            });
        }
        var fileName = pathName + "/" + name + "." + additionalResources.name + ".zip";
        additionalResources.mv(lowPath + fileName, function(err) {
            if (err)
                return res.status(500).send(err);
        });
    }

    formValues.tags = tags;
    formValues.description = description;
    formValues.userId = userId;
    formValues.username = userName;
    formValues.name = name;
    formValues.resourceFile = fileName;
    formValues.createdDate = Date();

    var project = createProjectObject(formValues);
    createProject(project).then(function(createdProject){
        addYourProjectId(req.session.user.id, createdProject.id);
        addTagsOfProject(project);
        //console.log("New project id: " + JSON.stringify(createdProject.id) + ".\n" );
        getProject(createdProject.id).then(function(project){
            getUser(project.userId).then(function(currUser){
                project.username = currUser.username;
                res.render('viewProject', { title:formValues.name , obj: project });
            },function(err){
                //console.log(err);
                res.render('error', {
                    message: 'Sorry, project\'s owner not found.',
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
            message: 'Sorry, project couldn\'t be created.',
            error: err
        });
    });
});

function addTagsOfProject(project){
    //console.log("Adding tag(s):\n"+JSON.stringify(project.tags)+"\n");
    if(project.tags.constructor === Array){
        const arr = project.tags;
        const promisedResults = arr.map(createTag);
        Promise.all(promisedResults).then(retObjs => {
            //for (const retObj of retObjs){console.log(retObj);}
        }).catch(reason => {
            //console.log("Had an issue adding tags to project with id: " +project.id+ ".\n");
        });
    } else {
        createTag(project.tags);
    }
}

function createTagObject(name){
    var tag = new CRUD.Tag({
        name: name
    });
    return tag;
}


function createTag(name){
    var tag = createTagObject(name);
    return new Promise(function(resolve, reject) {
        tag.save().then(function (doc) {
            //console.log("Tag: " + tag.name + " was saved.\n");
            resolve(tag.name);
        }).catch(Errors.DuplicatePrimaryKey, function (err) {
            //console.log("Duplicate primary key found.");
            return reject(err);
        }).error(function (error) {
            // not specific error, just a wide catch
            return reject(err);
        });
    });
}

function addYourProjectId(userId, projectId){
    return new Promise(function(resolve, reject) {
        CRUD.User.get(userId).run().then(function(result) {
            console.log("User retrieved:\n" + JSON.stringify(result) + ".\n");
            if(!result.yourProjectIds){ // if not empty
                if(!Array.isArray(result.yourProjectIds)){ // if not an array
                    result.yourProjectIds = [projectId];
                } else { // if an array
                    result.yourProjectIds.push(projectId);
                }
            } else { // if empty
                result.yourProjectIds = [projectId];
            }
            updateUser(result);
            //console.log("Added project id of: " +projectId+ " to user with id: "+userId+".\n");
            resolve(result);
        }).error(function(err) {
            return reject(err);
        });
    });
}

function addSubmittedProjectId(userId, projectId){
    return new Promise(function(resolve, reject) {
        CRUD.User.get(userId).run().then(function(result) {
            if(!result.submittedProjectIds){ // if not empty
                if(result.submittedProjectIds.constructor != Array){ // if not an array
                    result.submittedProjectIds = [result.submittedProjectIds, projectId];
                } else { // if an array
                    result.submittedProjectIds.push(projectId);
                }
            } else { // if empty
                result.submittedProjectIds[0] = projectId;
            }
            updateUser(result);
            //console.log("Added project id of: " +projectId+ " to user with id: "+userId+".\n");
            resolve(result);
        }).error(function(err) {
            return reject(err);
        });
    });
}

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
        project.save().then(function (proj) {
            //console.log("Project with id '" + proj.id + "' was saved.\n");
            resolve(proj);
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
            //console.log("Project with id " + result + " was updated.\n");
            resolve(result);
        }).catch(Errors.DocumentNotFound , function(err) {
            // output here
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

/* Post /submit. */
router.post('/submit/:id', function(req, res) { // add submission to project
    var projectId = req.params.id;
    var date = Date();
    var fileName;
    var userId = req.session.user.id;

    var additionalResources = req.files.workFileName;
    var lowPath = path.join(__dirname, '..');
    var pathName = "/public/files/submissionFiles/" + projectId;
    if(!fs.existsSync(lowPath + pathName)){
        mkdirp(lowPath + pathName, function (err) {
        });
    }
    fileName = pathName + "/" + userId + ".zip";
    additionalResources.mv(lowPath + fileName, function(err) {
        if (err)
            return res.status(500).send(err);
    });

    var formValues = {
        projectId: projectId,
        userId: userId,
        submissionDate: date,
        accepted: false,
        fileUrl: fileName
    };
    var submission = createSubmissionObject(formValues);

    Promise.all([
        addSubmittedProjectId(userId, projectId),
        createSubmission(submission),
    ]).then(([result1, result2]) => {
        getProjectAndAddSubmissionId(projectId, result2.id);
        res.redirect('/project/view/' + projectId);
    }).catch(err => {
        res.render('error', {
            message: 'Sorry, could not create submission and add submission id.',
            error: err
        });
    });
});

function getProjectAndAddSubmissionId(projectId, submissionId){
    getProject(projectId).then(function(project){
        project.submissionIds.push(submissionId);
        updateProject(project).then(function(updatedProject){
            //console.log("Updated project with id " + id + " after adding submission id "+submissionId+".\n");
        },function(err){
            //console.log(err);
            res.render('error', {
                message: 'Sorry, project could not be updated.',
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