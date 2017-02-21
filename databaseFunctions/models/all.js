module.exports = {
    Project: require(__dirname+'\\project.js'),
    User: require(__dirname+'\\user.js'),
    //Type: require(__dirname+'\\type.js'),
    Tag: require(__dirname+'\\tag.js'),
    Submission: require(__dirname+'\\submission.js'),
    Chat: require(__dirname+'\\chat.js'),
    Team: require(__dirname+'\\team.js'),
    Rating: require(__dirname+'\\rating.js')//,
    //test1: "hi",
    //test2: {first:"first",second:"second"}
};

/*var proj = new module.exports.Project({
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
console.log(proj);*/
//console.log("Made it to " + __dirname + "\\all.js");