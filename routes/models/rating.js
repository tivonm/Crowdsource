var thinky = require(__dirname+'/util/thinky.js');
var type = thinky.type;
var Rating = thinky.createModel("rating", {
    id: type.string(),
    type: type.string(),
    tags: [type.string()]
});
module.exports = Rating;