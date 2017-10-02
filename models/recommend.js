var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var webtoonSchema = require('./webtoon').webtoonSchema;
autoIncrement.initialize(db);

var recommendSchema = new Schema({
    _id: Number,
    user_one_id: Number,
    user_two_id: Number,
    union: Number,
    intersection: Number,
    similarity: Number,
    recommend: webtoonSchema
})

recommendSchema.plugin(autoIncrement.plugin, {
    model: 'recommend',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});


var recommendModel = db.model('recommend', recommendSchema);

module.exports = {
    recommendModel: recommendModel,
    recommendSchema: recommendSchema
};
