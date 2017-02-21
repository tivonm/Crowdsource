var thinky = require(__dirname+'/util/thinky.js');
var type = thinky.type;
var User = thinky.createModel("user", {
    id: type.string(),
    username: type.string(),
    email: type.string(),
    /*firstName: type.string(),
    lastName: type.string(),*/
    password: type.string(),
    //bio: type.string(),
    lastLogin: type.date(),
    profilePic: type.string(),
    //chatIds: [type.string()],
    facebookId: type.string(),
    //teamIds: [type.string()],
    watchedProjectIds: [type.string()],
    yourProjectIds: [type.string()],
    submittedProjectIds: [type.string()]/*,
    preferredTags: [type.string()]*/
});
module.exports = User;