var thinky = require(__dirname+'/models/util/thinky.js');
module.exports = require(__dirname+'/models/all.js');
var Errors = thinky.Errors;

// relationships
module.exports.User.hasMany(module.exports.Project, "projects", "id", "userID");
module.exports.Project.belongsTo(module.exports.User, "user", "userID", "id");

getUsers = function () { // returns all users
    var users = module.exports.User.run().then(function(allUsers) {
        //console.log("Output should be:\n" + allUsers);
        return allUsers//JSON.stringify(allUsers)
    });
    console.log("Output is:\n" + users);
    console.log("Length is: " + users.length + "\n");
    return users;
}

getUsersProjects = function (id) { // returns all users
    var message = "Document not found.";
    var status = false;
    var value = 0;

    var user = module.exports.User.get(id).getJoin({project: true}).run().then(function(result) {
        console.log(JSON.stringify(result) + "\nAbove user was retrieved.\n");
        status = true;
        value = result;//JSON.stringify(result);
        //req.session.obj = result;
        //res.render('index', { title: 'Home' });
    }).catch(Errors.DocumentNotFound , function(err) {
        console.log("Document not found.");
        status = false;
    }).error(function(error) {
        // undecided about this as of now
    });
}


// gets the user so far
getUser = function(id){ // returns
    var ready = false;
    var message = "";
    var status = false;
    var value = 0;

    var user = module.exports.User.get(id).run(function(result) {
        //console.log(JSON.stringify(result) + "\nAbove user was retrieved.\n");
        status = true;
        value = JSON.stringify(result);
        ready = true;
	return {
            value: value,
            status: status,
            msg: message
        };

    }).catch(Errors.DocumentNotFound , function(err) {
        console.log("Document not found.");
        status = false;
        message = "Document not found.";
        ready = true;
	return {
            value: value,
            status: status,
            msg: message
        };

    }).error(function(error) {
        // undecided about this as of now
    });
    //while(!ready){}
    
}

deleteUser = function(id){
    var ready = false;
    var message = "Document not found.";
    var status = false;
    var value = 0;
    module.exports.User.get(id).then(function(user) {
        user.delete().then(function(result) {
            console.log("User with ID: " + id + " was successfully deleted.\n");
            status = true;
            value = id;
            ready = true;
        });
    }).catch(Errors.DocumentNotFound  , function(err) {
        console.log("Document not found.");
        status = false;
        message = "Document not found.";
        ready = true;
    }).error(function(error) {
        // undecided about this as of now
    });

    // cant get this to work here, unsure why, need to revisit
    //while(!ready){}
    return {
        value: value,
        status: status,
        msg: message
    };
}

deleteProject = function(id){
    var ready = false;
    var message = "Document not found.";
    var status = false;
    var value = 0;
    module.exports.Project.get(id).then(function(proj) {
        proj.delete().then(function(result) {
            console.log("User with ID: " + id + " was successfully deleted.\n");
            status = true;
            value = id;
            ready = true;
        });
    }).catch(Errors.DocumentNotFound  , function(err) {
        console.log("Document not found.");
        status = false;
        message = "Document not found.";
        ready = true;
    }).error(function(error) {
        // undecided about this as of now
    });

    // cant get this to work here, unsure why, need to revisit
    //while(!ready){}
    return {
        value: value,
        status: status,
        msg: message
    };
}

// saves so far
saveUser = function(userToSave) { // recreates the object and saves it
    var ready = false;
    var message = "";
    var status = false;
    var value = 0;
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
    
    user.save().then(function (doc) {
        console.log("User with ID: " + user.id + " was saved.\n");
        status = true;
        value = userToSave.id;

        ready = true;
    }).catch(Errors.DuplicatePrimaryKey, function (err) {
        console.log("Duplicate primary key found.");
        status = false;
        message = "Duplicate primary key found.";
        ready = true;
    }).error(function (error) {
        // undecided about this as of now
    });
    
    //while(!ready){}
    return {
        value: value,
        status: status,
        msg: message
    };
}


// counts properly
countUser = function(){
    module.exports.User.count().execute().then(function(total) {
        console.log(total+" users in the database\n");
    });
}

// counts properly
deleteUsers = function(){
    module.exports.User.delete().execute().then(function(total) {
        console.log("users deleted");
    });
}

// counts properly
deleteProjects = function(){
    module.exports.Project.delete().execute().then(function(total) {
        console.log("projects deleted");
    });
}



var user = new module.exports.User({
    id: "thisIsID",
    username: "username123",
    email: "email@gmail.com",
/*firstName: type.string(),
 lastName: type.string(),*/
 password: "placeholderPW",
 //bio: userToSave.bio,
 lastLogin: Date(),
 profilePic: "profPicFilePath",
 //chatIds: userToSave,
 facebookId: "FBID",
 //teamIds: userToSave,
 watchedProjectIds: ["proj1","proj3"],
 yourProjectIds: ["proj2"],
 submittedProjectIds: ["proj3"]/*,
 preferredTags: [type.string()]*/
 });
 
var user2 = new module.exports.User({
    id: "thisIsID2",
    username: "username1234",
    email: "email2@gmail.com",
    /*firstName: type.string(),
    lastName: type.string(),*/
    password: "placeholderPW2",
    //bio: userToSave.bio,
    lastLogin: Date(),
    profilePic: "profPicFilePath2",
    //chatIds: userToSave,
    facebookId: "FBID2",
    //teamIds: userToSave,
    watchedProjectIds: ["proj1","proj3"],
    yourProjectIds: ["proj2"],
    submittedProjectIds: ["proj3"]/*,
    preferredTags: [type.string()]*/
 });

login = function(submittedUsername, submittedPassword){ // returns
    var message = "Document not found.";
    var status = false;
    var value = 0;
    var user = module.exports.User.filter({username: submittedUsername}).run().then(function(result) {
        //console.log(JSON.stringify(result) + "\nAbove user was retrieved.\n");
        status = true;
        /*return {
         value: result,
         status: status,
         msg: message
         };*/
        if(result.password == submittedPassword){
            // set stuff
        } else {
            // set to wrong combination
        }
    }).catch(Errors.DocumentNotFound , function(err) {
        //console.log("Document not found.");
        status = false;
        // set to wrong combination
    }).error(function(error) {
        // undecided about this as of now
    });
}

saveProject = function(projectToSave) { // recreates the object and saves it
    var message = "Duplicate primary key found.";
    var status = false;
    var value = 0;
    var project = new module.exports.Project({
        id: projectToSave.id,
        name: projectToSave.name,
        userId: projectToSave.userId,
        description: projectToSave.description,
        tags: projectToSave.tags,
        createdDate: projectToSave.createdDate,
        resourceFile: projectToSave.resourceFile,
        status: projectToSave.status,
        submissionIds: projectToSave.submissionIds,
        acceptedSubmissionId: projectToSave.acceptedSubmissionId
    });

    project.save().then(function (doc) {
        console.log("Project with ID: " + project.id + " was saved.\n");
        status = true;
        value = project.id;
        ready = true;
    }).catch(Errors.DuplicatePrimaryKey, function (err) {
        console.log("Duplicate primary key found.");
        status = false;
        message = "Duplicate primary key found.";
        ready = true;
    }).error(function (error) {
        // undecided about this as of now
    });

}

getProject = function(id){ // returns
    var message = "Document not found.";
    var status = false;
    var value = 0;

    var project = module.exports.Project.get(id).run().then(function(result) {
        console.log(JSON.stringify(result) + "\nAbove user was retrieved.\n");
        status = true;
        value = result;//JSON.stringify(result);
    }).catch(Errors.DocumentNotFound , function(err) {
        console.log("Document not found.");
        status = false;
        message = "Document not found.";
        //ready = true;
    }).error(function(error) {
        // undecided about this as of now
    });
}

getAllProjects = function () { // returns all projects
    module.exports.Project.run().then(function(projs) {
        console.log(JSON.stringify(projs));
    });
}

getAllUsers = function () { // returns all projects
    module.exports.User.run().then(function(users) {
        console.log(JSON.stringify(users));
    });
}

var proj1 = new module.exports.Project({
    id: "proj1id",
    name: "proj1name",
    userId: "thisIsID",
    description: "proj1desc",
    tags: ["tag1","tag2"],
    createdDate: Date(),
    resourceFile: "resourceFile",
    status: 1,
    submissionIds: ["subId1","subId2"],
    acceptedSubmissionId: "subId1"
});

var proj2 = new module.exports.Project({
    id: "proj2id",
    name: "proj2name",
    userId: "thisIsID",
    description: "proj2desc",
    tags: ["tag1","tag2"],
    createdDate: Date(),
    resourceFile: "resourceFile",
    status: 1,
    submissionIds: ["subId1","subId2"],
    acceptedSubmissionId: "subId1"
});


//getUsersProjects(user.id);
//console.log(JSON.stringify(getUserRelevantProjects()));
//getAllProjects();
//getAllUsers();

deleteUsers();
deleteProjects();

//getUser(user.id);
//getUser(user2.id);
//getProject(proj1.id);
//getProject(proj2.id);

//deleteUser(user.id);
//deleteUser(user2.id);
//deleteProject(proj1.id);
//deleteProject(proj2.id);

//saveUser(user);
//saveUser(user2);
//saveProject(proj1);
//saveProject(proj2);

//login("username123","placeholderPW");
//console.log(deleteUser(user.id));
//console.log(getUser(user.id));
//console.log(getUser(user.id2));
//console.log(Promise.resolve(getUsers()[0]));
//countUser();
//deleteAllUsers();
//JSON.stringify(string)



