var thinky = require(__dirname+'\\..\\models\\util\\thinky.js');
module.exports = require(__dirname+'\\..\\models\\all.js');
var Errors = thinky.Errors;

getProjects = function () { // returns all projects w/ a user model that is the owner and w/ its type model
    //Project.hasOne(module.exports.Type, "type", "typeId", "id");
    Project.hasOne(module.exports.User, "user", "userId", "id");
    var combinedProject = Project.getJoin({User: true}).run().then(function(fullProject) {
        return fullProject;
    });
    return combinedProject;
}
getProject = function(id){ // returns the project w/ submissions, a user model that is the owner, a type model
    exports.Project.hasMany(module.exports.Submission, "submission", "submissionId", "id");
    var combinedProject = Project.get(id).getJoin({Submission: true}).run().then(function(fullProject) {
        return fullProject;
    });
    var user = module.exports.User.get(combinedProject.userId).run().then(function(user) {
        return user;
    });
    /*var type = module.exports.Type.get(project.type).run().then(function(type) {
        return type;
    });*/
    return {project: combinedProject, user: user/*, type: type*/};
}
saveProject = function(projToSave){ // recreates the object and saves it
    var proj = new module.exports.Project({
        id: projToSave.id,
        name: projToSave.name,
        userId: projToSave.userId,
        description: projToSave.description,
        tags: projToSave.tags,
        createdDate: projToSave.createdDate,
        resourceFile: projToSave.resourceFile,
        status: projToSave.status,
        submissionIds: projToSave.submissionIds,
        acceptedSubmissionId: projToSave.acceptedSubmissionId
    });
    if(proj.isSaved()){
        Project.get(proj.id).run().then(function(unneeded) {
            Project.merge(proj).save().then(function(result) {
                console.log(result);
            });
        }).catch(Errors.DocumentNotFound, function(err) {
            console.log("Document not found");
        }).error(function(error) {
            // undecided about this as of now
        });
    } else {
        proj.save.then(function(doc) {
            console.log(doc);
        });
    }

    return proj.id;
}
deleteProject = function(id){
    Project.get(id).then(function(user) {
        Project.delete().then(function(result) {
            console.log(result);// user === result // user was deleted from the database
            result.isSaved(); // false
        });
    });
}
//var testText = "Made it to testText in projectCRUD.js";
module.exports.ProjectCRUD = {
    getProjects: getProjects,
    getProject: getProject,
    saveProject: saveProject,
    deleteProject: deleteProject//,
    //testText: testText
}

//console.log("Made it to " + __dirname + "\\projectCRUD.js");
