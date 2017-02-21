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

//View current projects
/* Get /project. Gets all projects*/
router.get('/view', function(req, res) {
	var result = dbm.getAllProjects();

	if(!result.status){
		debug('Individual project search failed with a message of\"' + result.msg + '\"');
		res.status(500);
	    res.render('error', {
	        message: 'We are currently experiencing technical issues. Try again soon.',
	        error: result.msg
	    });
	}

	var projects = result.value;

	projects.forEach(function(value) {
		value.projectTags = value.projectTags.join(", ");
		value.projectTags = validator.unescape(value.projectTags);
	});

	res.render('viewProjects', { title: 'Projects' , msg: "" , obj: projects});
});

/* Get /project/:id. Gets a specific project*/
router.get('/view/:id', function(req, res) {
	var id = req.params.id;

	var result = dbm.getAProject(id);

	if(!result.status){
		debug('Individual project search failed with a message of\"' + result.msg + '\"');
		res.status(404);
	    res.render('error', {
	        message: 'Sorry, project not found.',
	        error: result.msg
	    });
	}

	var project = result.value;
	project.description = validator.unescape(project.description);
	project.projectTags = value.projectTags.join(", ");
	project.projectTags = validator.unescape(value.projectTags);

	var title = 'Project \"' + project.name + '\"';
	res.render('viewIndividualProject', { title: title , obj: project });
});

//Create projects
/* Get /project/create. Create project form.*/
router.get('/new', function(req, res) {
	res.render('createProject', { title: 'Create Project', msg: "", obj: returnObject });
});

/* Post /project. */
router.post('/new', function(req, res) {
	var formValues = req.body.submit;
	var err = "";
	if(formValues.name.length < 1 || formValues.name.length > 20){
		err += "Invalid Name. \n";
	}
	if(formValues.description.lenght < 10 || formValues.description.length > 150){
		err += "Invalid description. \n";
	}
	if(formValues.tags.length < 0 || formValues.description.length > 50){
		err += "Invalid tags. \n";
	}
	if(formValues.additionalResources.originalFilename.length > 0 && !formValues.additionalResources.originalFilename.endswith('.zip')){
		err += "Invalid Additional Resource. Must be a zip file."; 
	}
	if( err.length > 0){
		res.render('submitProject', { title: 'Create Project', msg: err, obj: formValues });
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

	var dbObject = {
		name: name,
		user: userId,
		description: description,
		tags: tags,
		createdDate: Date.Now(),
		filePath: fileName
	}

	var result = dbm.addProject(dbObject);

	if(!result.status){
		debug('Project add failed with a message of\"' + result.err + '\"');
		res.status(500);
	    res.render('error', {
	        message: 'We are currently experiencing technical issues. Try again soon.',
	        error: result.msg
	    });
	}
	var projectId = result.value;

	res.redirect('/project/' + projectId);
});

//UpdateProjects
/* Get /project/new/:id. */
router.get('/new/:id', function(req, res) {
	res.render('updateProject', { title: 'Update Project' , index: req.params.id});
});

/* Put /new/:id. */
router.put('/new/:id', function(req, res) {
	var id = req.params.id;
	res.render('confirmation', { title: 'Updated Project' , index: id , object: 'project', action: 'updated'});
});

//submission for project
/* Get /project/submit/:id */
router.get('/submit/:id', function(req, res) {
	res.render('submission', { title: 'Update Project' , index: req.params.id});
});

/* Post /project. */
router.post('/submit/:id', function(req, res) {
	res.render('viewProject', { title: 'Created Project' , msg: '', obj: project});
});


//Projects to a specific user
/* Get /project/user/:id */
router.get('/user/:id', function(req, res) {
	dbm.addSubmission(req.body.submit);
	var projectId = result.value;

	res.redirect('/project/' + projectId);
});

module.exports = router;