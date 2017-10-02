// serviceseed.js
var db = require('../models/db');
var jobModel = require('../models/job').jobModel;
var mongoose = require('mongoose');

var myjob = [
	new jobModel({
		jobName: "학생"
	}),
	new jobModel({
		jobName: "관리자"
	}),
  new jobModel({
		jobName: "전문가"
	}),
  new jobModel({
		jobName: "사무직"
	}),
  new jobModel({
		jobName: "서비스업"
	}),
  new jobModel({
		jobName: "판매직"
	}),
  new jobModel({
		jobName: "농량어업 종사자"
	}),
  new jobModel({
		jobName: "기능직"
	}),
  new jobModel({
		jobName: "기계조작 및 조립 농사자"
	}),
  new jobModel({
		jobName: "노무직"
	}),
  new jobModel({
		jobName: "군인"
	})
];
console.log('myjob=', myjob)
var done = 0;
for (var i=0; i<myjob.length; i++) {
	myjob[i].save(function(err, result){
		console.log('result=', result);
		done++;
		if(done == myjob.length) {
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
}
