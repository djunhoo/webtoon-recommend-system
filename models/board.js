var mongoose = require('mongoose');
var db = require('./db');

var user = require('./user').userSchema;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var boardSchema = new Schema({
    title: String,
    content: String,
    userId: {
        type: Number,
        ref: 'user'
    },
    regdate: String,
    readCount: Number,
    isNotice: Boolean
});


boardSchema.plugin(autoIncrement.plugin, {
    model: 'board',
    field: '_id',
    startAt: 1,
    incrementBy: 1
})


var boardModel = db.model('board', boardSchema);


module.exports = {
    boardModel: boardModel,
    boardSchema: boardSchema
};
