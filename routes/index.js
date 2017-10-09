var express = require('express');
var router = express.Router();
var Webtoon = require('../models/webtoon').webtoonModel;
var Category = require('../models/WebtoonCategory').webtoonCategoryModel;


router.get('/search', function(req, res, next) {
    res.render('webtoon/search', {
        title: '웹툰 검색'
    });
});
/* GET home page. */
router.get('/', function(req, res, next) {
    var category_id = req.body.category_id;
    if (!category_id) {
        category_id = 1;
    }
    console.log('_id=', category_id);
    Category.find({}, function(err, other) {
        var filter = {
            categorys: {
                $in: [category_id]
            }
        };
        var options = {
            limit: 12,
            populate: 'categorys'
        };
        Webtoon.findRandom(filter, {}, options, function(err, results) {
            console.log(results);
            console.log('categorys=', other);
            res.render('index', {
                title: '웹툰 추천 시스템',
                webtoons: results,
                categorys: other
            });
        });
    });
});

router.post('/', function(req, res, next) {
    var category_id = req.body.category_id;
    if (!category_id) {
        category_id = 1;
    }
    console.log('_id=', category_id);
    Category.find({}, function(err, other) {
        var filter = {
            categorys: {
                $in: [category_id]
            }
        };
        var options = {
            limit: 12,
            populate: 'categorys'
        };
        Webtoon.findRandom(filter, {}, options, function(err, results) {
            console.log(results);
            console.log('categorys=', other);
            res.send({
                title: '웹툰 추천',
                webtoons: results,
                categorys: other
            });
        });
    });
});



router.get('/addCategory', function(req, res, next) {
    res.render('etc/addCategory', {
        title: '카테고리 추가'
    });
});

module.exports = router;
