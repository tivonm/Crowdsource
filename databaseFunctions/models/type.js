var thinky = require(__dirname+'/util/thinky.js');
var type = thinky.type;
var Type = thinky.createModel("type", {
    id: type.string(),
    name: type.string(),
    picture: type.string(),
    tags: [type.string()]
});
module.exports = Type;