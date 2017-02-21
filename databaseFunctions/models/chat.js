var thinky = require(__dirname+'/util/thinky.js');
var type = thinky.type;
var Chat = thinky.createModel("chat", {
    id: type.string(),
    name: type.string(),
    numberOfMessages: type.number().integer(),
    invitedIds: [type.string()],
    messages: {
        index: type.number().integer(),
        userId: type.string(),
        dateTime: type.date(),
        text: type.string()
    },
    members: {
        userId: type.string(),
        lastSeenMessageIndex: type.number().integer()
    }
});
module.exports = Chat;