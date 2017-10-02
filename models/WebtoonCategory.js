var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var webtoonCategorySchema = new Schema({
		_id: Number,
		category_name: String
})

webtoonCategorySchema.plugin(autoIncrement.plugin, {model: 'webtoonCategory', field: '_id', startAt: 1, incrementBy: 1});


var webtoonCategoryModel = db.model('webtoonCategory', webtoonCategorySchema);

module.exports = { webtoonCategoryModel: webtoonCategoryModel, webtoonCategorySchema: webtoonCategorySchema};
