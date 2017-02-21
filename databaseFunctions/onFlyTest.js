//var thinky = require(__dirname+'\\models\\util\\thinky.js');
module.exports = require(__dirname+'\\CRUD\\allCRUD.js');


var proj = new module.exports.ProjectCRUD.Project({
    id: "idOfProj123",
    name: "name",
    userId: "userID123",
    description: "snazzyLittleDescription RIGHT HURRRR!",
    typeId: "typeID123",
    tags: ["tag1","tag2","tag3"],
    createdDate: Date.now(),
    helpingFile: "helpingFile.js",
    status: 1,
    submissionIds: ["subId1","subId2","subId3"],
    acceptedSubmissionId: "acceptedSubId123"
});
console.log(proj);
//var id = module.exports.CRUD.saveProject(proj);
//var id = module.exports.CRUD.testText;
//console.log("projectId: " + id);
//console.log(module.exports.test1);
//console.log(module.exports.test2.first);
