var mongoose = require('mongoose');
var db = require('./db');

var webtoonCategory = require('./WebtoonCategory').webtoonCategorySchema;
var random = require('mongoose-simple-random');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);



var webtoonSchema = new Schema({
    name: String,
    writer: String,
    point: Number,
    description: String,
    img_src: String,
    link_url: String,
    categorys: [{
        type: Number,
        ref: 'webtoonCategory'
    }],
    platform: String
});

webtoonSchema.index({
    name: 'text',
    description: 'text',
    writer: 'text'
});
webtoonSchema.plugin(autoIncrement.plugin, {
    model: 'webtoon',
    field: '_id',
    startAt: 1,
    incrementBy: 1
})
webtoonSchema.plugin(random);


var webtoonModel = db.model('webtoon', webtoonSchema);


module.exports = {
    webtoonModel: webtoonModel,
    webtoonSchema: webtoonSchema
};
