var mongoose = require('mongoose');
var db = require('./db');

var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var jobSchema = new Schema({
		_id: Number,
		jobName: String
})

jobSchema.plugin(autoIncrement.plugin, {model: 'job', field: '_id', startAt: 1, incrementBy: 1});


var jobModel = db.model('job', jobSchema);

module.exports = { jobModel: jobModel, jobSchema: jobSchema};
