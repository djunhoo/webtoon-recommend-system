// serviceseed.js
var db = require('../models/db');
var CategoryModel = require('../models/WebtoonCategory').webtoonCategoryModel;
var mongoose = require('mongoose');

var category = [
	new CategoryModel({
		category_name: "에피소드"
	}),
	new CategoryModel({
		category_name: "옴니버스"
	}),
	new CategoryModel({
		category_name: "스토리"
	}),
	new CategoryModel({
		category_name: "일상"
	}),
	new CategoryModel({
		category_name: "개그"
	}),
	new CategoryModel({
		category_name: "판타지"
	}),
	new CategoryModel({
		category_name: "액션"
	}),
	new CategoryModel({
		category_name: "드라마"
	}),
	new CategoryModel({
		category_name: "순정"
	}),
	new CategoryModel({
		category_name: "감성"
	}),
	new CategoryModel({
		category_name: "스릴러"
	}),
	new CategoryModel({
		category_name: "시대극"
	}),
	new CategoryModel({
		category_name: "스포츠"
	})
];
console.log('category=', category)
var done = 0;
for (var i=0; i<category.length; i++) {
	category[i].save(function(err, result){
		console.log('result=', result);
		done++;
		if(done == category.length) {
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
}
