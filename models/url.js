var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;

var urlSchema = new Schema({
		url: String
})

var urlModel = db.model('url', urlSchema);

module.exports = { urlModel: urlModel, urlSchema: urlSchema};
