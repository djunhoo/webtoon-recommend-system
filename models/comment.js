var mongoose = require('mongoose');
var db = require('./db');

var user = require('./user').userSchema;
var webtoon = require('./webtoon').webtoonSchema;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var commentSchema = new Schema({
    content: String,
    point: Number,
    userId: {
        type: Number,
        ref: 'user'
    },
    webtoonId: {
        type: Number,
        ref: 'webtoon'
    }
});


commentSchema.plugin(autoIncrement.plugin, {
    model: 'comment',
    field: '_id',
    startAt: 1,
    incrementBy: 1
})


var commentModel = db.model('comment', commentSchema);


module.exports = {
    commentModel: commentModel,
    commentSchema: commentSchema
};
