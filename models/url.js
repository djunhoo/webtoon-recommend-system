var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;
var webtoonCategory = require('./WebtoonCategory').webtoonCategorySchema;

var urlSchema = new Schema({
		url: String,
		category: {
	      type: Number,
	      ref: 'webtoonCategory'
	    }
});

var urlModel = db.model('url', urlSchema);

module.exports = { urlModel: urlModel, urlSchema: urlSchema};
