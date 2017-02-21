/**
 * Created by Jacob on 11/13/2016.
 */
// using: https://www.rethinkdb.com/docs/guide/javascript/
// good video: https://www.youtube.com/watch?v=xCU9RHDWXIY

var r = require('rethinkdb');

var connection = null;
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
});

var DB = "maindb";
var TABLE = "projects";

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
    }).run(conn, function(err, result) {
        if (err) throw err;
        console.log(result);
    });
};

deleteProject = function(project) {
    r.db(DB).table(TABLE).filter(r.row("id").eq(project.ID)).delete().run(conn,
        function(err, result) {
            if (err) throw err;
            console.log(result);
        }
    );
};

retrieveProjectByID = function(id){
    return r.db(DB).table(TABLE).filter(r.row("id").eq(id)).run(conn,
        function(err, result) {
            if (err) throw err;
            console.log(result);
        }
    );
};

retrieveAllProjects = function(){
    return r.db(DB).table(TABLE).run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
        });
    });
};

updateProject = function(project){
    r.db(DB).table(TABLE).filter(r.row(project.ID)).update({
        id: project.ID,
        description: project.DESC,
        submissionIDs: project.SUBIDS,
        tags: project.TAGS/*,
         ownerID: project.OWNERID,
         onProjectIDs = project.ONPROJIDS,
         baseFilePaths = project.BASEFILEPATHS
         */
    }).run(conn, function(err, result) {
        if (err) throw err;
        console.log(result);
    });
};

