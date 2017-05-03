var thinky = require(__dirname+'/util/thinky.js');
var type = thinky.type;
var Tag = thinky.createModel("tag",
    {name: type.string()},
    {pk: 'name'}
);
module.exports = Tag;