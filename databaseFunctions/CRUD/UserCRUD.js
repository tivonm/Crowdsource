var thinky = require(__dirname+'\\..\\models\\util\\thinky.js');
module.exports = require(__dirname+'\\..\\models\\all.js');
var Errors = thinky.Errors;



getUsers = function () { // returns all users
    var users = module.exports.User.run().then(function(fullProject) {
        return fullProject;
    });
    return combinedProject;
}
getUser = function(id){ // returns
    var user = module.exports.User.get(id).run().then(function(user) {
        return user;
    });
}
saveUser = function(userToSave){ // recreates the object and saves it
    var user = new module.exports.User({
        id: userToSave.id,
        username: userToSave.username,
        email: userToSave.email,
        /*firstName: type.string(),
         lastName: type.string(),*/
        password: userToSave.password,
        //bio: userToSave.bio,
        lastLogin: userToSave.lastLogin,
        profilePic: userToSave.profilePic,
        //chatIds: userToSave,
        facebookId: userToSave.facebookId,
        //teamIds: userToSave,
        watchedProjectIds: userToSave.watchedProjectIds,
        yourProjectIds: userToSave.yourProjectIds,
        submittedProjectIds: userToSave.submittedProjectIds/*,
         preferredTags: [type.string()]*/
    });
    if(user.isSaved()){
        module.exports.User.get(user.id).run().then(function(unneeded) {
            module.exports.User.merge(user).save().then(function(result) {
                console.log(result);
            });
        }).catch(Errors.DocumentNotFound, function(err) {
            console.log("Document not found");
        }).error(function(error) {
            // undecided about this as of now
        });
    } else {
        user.save.then(function(doc) {
            console.log(doc);
        });
    }

    return user.id;
}
deleteUser = function(id){
    module.exports.User.get(id).then(function(user) {
        module.exports.User.delete().then(function(result) {
            console.log(result);// user === result // user was deleted from the database
            result.isSaved(); // false
        });
    });
}

countUser = function(){
    module.exports.User.count().execute().then(function(total) {
        console.log(total+" users in the database\n");
    });
}
//var testText = "Made it to testText in projectCRUD.js";
module.exports.UserCRUD = {
    getUsers: getProjects,
    getUser: getProject,
    saveUser: saveProject,
    deleteUser: deleteProject//,
    //testText: testText
}