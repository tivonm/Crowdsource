// need to check this out

var r = require('rethinkdb');

var connection = null;
r.connect( {
	host: 'localhost', 
	port: 28015
}, function(err, conn) {
    if (err) throw err;
    connection = conn;
});




var DB = "test";
var TABLE = "projects";
var projToCreate = {
	ID: 5,
	DESC: "try",
	SUBIDS: 3,
	TAGS: "ballin"
};

createProject = function(project) {
    r.db(DB).table(TABLE).insert({
        id: project.ID,
        description: project.DESC,
        submissionIDs: project.SUBIDS,
        tags: project.TAGS/*,
         ownerID: project.OWNERID,
         onProjectIDs = project.ONPROJIDS,
         baseFilePaths = project.BASEFILEPATHS
         */
    }).run(connection);
};

createProject(projToCreate);

