var thinky = require(__dirname+'/util/thinky.js');
var type = thinky.type;
var Submission = thinky.createModel("submission", {
    id: type.string(),
    projectId: type.string(),
    userId: type.string(),
    //teamId: type.string(),
    rating: type.number().integer(),
    submissionDate: type.date(),
    //message: type.string(),
    //public: type.boolean(),
    accepted: type.boolean(),
    feedback: type.string(),
    //file: type.string(),
    fileUrl: type.string()
});
module.exports = Submission;