var thinky = require(__dirname+'/util/thinky.js');
var type = thinky.type;
var Team = thinky.createModel("team", {
    id: type.string(),
    name: type.string(),
    ownerId: type.string(),
    image: type.string(),
    description: type.string(),
    inviteIds: [type.string()],
    chatId: [type.string()],
    requestIds: [type.string()],
    memberIds: [type.string()],
    watchedProjectIds: [type.string()],
    submittedProjectIds: [type.string()]
});
module.exports = Team;