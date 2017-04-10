var thinky = require(__dirname+'/util/thinky.js');
var type = thinky.type;
var Project = thinky.createModel("project", {
    id: type.string(),
    name: type.string(),
    userId: type.string(),
    description: type.string(),
    tags: [type.string()],
    createdDate: type.date(),
    resourceFile: type.string(),
    status: type.number().integer(),
    submissionIds: [type.string()],
    acceptedSubmissionId: type.string()
});
module.exports = Project;
//console.log("Made it to " + __dirname + "\\project.js");