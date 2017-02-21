
module.exports = require(__dirname+'\\CRUD\\allCRUD.js');


// getAllProjects = function(){};
// getAProject = function(id){};



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

function getUsers() {

}

function getUser(id) {

}

function getAllProjects() {
    var projects = exports.ProjectCRUD.getProjects();


    var toRet = {
        value: projects,
        status: true,
        msg: "yay"
    };
    return ;
}


module.exports = {
    checkLogin: checkLogin,
    getUsers: getUsers,
    getUser: getUser,
    getAllProjects: getAllProjects
};

