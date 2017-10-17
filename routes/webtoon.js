// webtoon.js

var express = require('express');
var router = express.Router();
var Webtoon = require('../models/webtoon').webtoonModel;


router.get('/:webtoon_id', function(req, res, next) {

	var webtoon_id = req.params.webtoon_id;
	console.log('id=', webtoon_id);

	if(!webtoon_id) {
		console.log('파라미터 에러');
	}

	Webtoon.find({_id: webtoon_id}, function(err, doc) {
		if(err) next(err);

		if(!doc) {
			res.json({
				err: "찾는 웹툰이 없다."
			})
		}
		console.log('doc-', doc);

		res.render('webtoon/webtoon', {
        	title: doc.name,
       		user: req.user,
       		webtoon: doc[0]
    	});
	});
});


router.get('/', function(req, res, next) {
    res.render('webtoon/webtoon', {
        title: '웹툰 인덱스',
       	user: req.user
    });
});

module.exports = router;
