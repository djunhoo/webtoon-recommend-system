var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var platformSchema = new Schema({
    name: String
})

platformSchema.plugin(autoIncrement.plugin, {
    model: 'platform',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


var platformModel = db.model('platform', platformSchema);

module.exports = {
    platformModel: platformModel,
    platformSchema: platformSchema
};
