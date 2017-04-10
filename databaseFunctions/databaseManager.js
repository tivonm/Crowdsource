var thinky = require(__dirname+'/models/util/thinky.js');
module.exports = require(__dirname+'/models/all.js');
var Errors = thinky.Errors;


// relationships
module.exports.User.hasMany(module.exports.Project, "projects", "id", "userID");
module.exports.Project.belongsTo(module.exports.User, "user", "userID", "id");


function checkLogin(user) {
    if(user.username == "jacobBaird" && user.password == "bairdPass123"){
        return { status: true , value: {name: "jacobBaird", id: "baird123"}};
    }
    if(user.username == "jacobMelosi" && user.password == "melosiPass123"){
        return { status: true , value: {name: "jacobMelosi", id: "melosi123"}};
    }
    if(user.username == "tivonMissi" && user.password == "missiPass123"){
        return { status: true , value: {name: "tivonMissi", id: "missi123"}};
    }
    if(user.username == "enzoGalbo" && user.password == "galboPass123"){
        return { status: true , value: {name: "enzoGalbo", id: "galbo123"}};
    }
    return {status: false, msg: "invalid username or password." };
}


getUsers = function () { // returns all users
    var users = module.exports.User.run().then(function(allUsers) {

        //console.log("Output should be:\n" + allUsers);
        //return allUsers//JSON.stringify(allUsers)
    });
    //console.log("Output is:\n" + users);
    //console.log("Length is: " + users.length + "\n");
    //return users;
}

// gets the user so far
getUser = function(id){ // returns
    var message = "Document not found.";
    var status = false;
    var value = 0;

    var user = module.exports.User.get(id).run().then(function(result) {
        console.log(JSON.stringify(result) + "\nAbove user was retrieved.\n");
        status = true;
        value = result;//JSON.stringify(result);
        //ready = true;
        /*return {
            value: value,
            status: status,
            msg: message
        };*/
    }).catch(Errors.DocumentNotFound , function(err) {
        console.log("Document not found.");
        status = false;
        message = "Document not found.";
        //ready = true;
    }).error(function(error) {
        // undecided about this as of now
    });
    //while(!ready){}
    /*return {
        value: value,
        status: status,
        msg: message
    };*/
}

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

// saves so far
saveUser = function(userToSave) { // recreates the object and saves it
    var ready = false;
    var message = "Duplicate primary key found.";
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

// deletes so far
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

// counts properly
countUser = function(){
    module.exports.User.count().execute().then(function(total) {
        console.log(total+" users in the database\n");
    });
}


getUsersProjects = function (id) { // returns all users
    var message = "Document not found.";
    var status = false;
    var value = 0;

    var user = module.exports.User.get(id).getJoin({project: true}).run().then(function(result) {
        console.log(JSON.stringify(result) + "\nAbove user was retrieved.\n");
        status = true;
        value = result;//JSON.stringify(result);
        req.session.obj = result;
        res.render('index', { title: 'Home' });
    }).catch(Errors.DocumentNotFound , function(err) {
        console.log("Document not found.");
        status = false;
    }).error(function(error) {
        // undecided about this as of now
    });
}


function getProjects() { // returns 100 most recently created projects
    return new Promise(function(resolve, reject) {

        module.exports.Project.orderBy('createdDate').limit(100).run().then(function(result) {
            console.log(JSON.stringify(result) + "\nAbove projects were retrieved.\n");
            status = true;
            resolve(result);
        }).catch(Errors.DocumentNotFound , function(err) {
            console.log("Document not found.");

            return reject(err);
            //ready = true;
        }).error(function(error) {
            return reject(err);
        });


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

getUserRelevantProjects = function () { // returns all projects
    /*module.exports.Project.filter(function(proj) {
        return proj("userId").eq("thisIsID").and(user("types").contains(function(type) {
            return type("type").eq(22);
        }));
    });*/
    var projs = module.exports.Project.filter(function(proj) {
        return proj("userId").eq("thisIsID");
    }).run().then(function(){

    });

}



/*
// proper return layout
function getAllProjects() {
    var projects = exports.ProjectCRUD.getProjects();


    var toRet = {
        value: projects,
        status: true,
        msg: "yay"
    };
    return toRet;
}
*/

module.exports = {
    checkLogin: checkLogin,
    getUsers: getUsers,
    getUser: getUser,
    getAllProjects: getAllProjects
};

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

// stuff I am using in testing
/*deleteUser(user.id);
saveUser(user);
getUser(user.id);
//console.log(Promise.resolve(getUsers()[0]));
//countUser();
//deleteAllUsers();
//JSON.stringify(string)
*/
