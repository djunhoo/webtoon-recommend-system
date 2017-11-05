var express = require('express');
var router = express.Router();
var Webtoon = require('../models/webtoon').webtoonModel;
var Category = require('../models/WebtoonCategory').webtoonCategoryModel;
var Board = require('../models/board').boardModel;
var common = require('../config/etc');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('successMessage', '로그인이 필요합니다.');
        res.redirect('/users/login');
    }
}

router.post('/search', function(req, res, next) {
    console.log('value=', req.body.name);
    var name = req.body.name;
    if( name == "" ) {
        name = "wefij23f289f289524m2lkj9wefm23o";
    }
    Webtoon.find({name: new RegExp(name, "i")})
        .limit(10)
        .exec(function(err, docs) {
            if(err) console.log('err=', err);
            console.log('results=', docs);
            res.send({
                title: '웹툰 검색',
                webtoon: docs,
                user: req.user
            });
        });
});

router.post('/board/write', isLoggedIn, function(req, res, next) {
    var board = new Board();
    board.title = req.body.title;
    board.content = req.body.content;
    board.userId = req.user._id;
    board.regdate = common.regDateTime();
    board.readCount = 0;
    board.isNotice = false;
    board.save();
    res.redirect('/board');
});

router.get('/board', function(req, res, next) {
    Board.find({})
    .populate('userId')
    .limit(10)
    .skip(0)
    .exec()
    .then(function(boards) {
        res.render('etc/board', {
            title: '자유게시판',
            user: req.user,
            boards: boards.reverse()
        });
    })
    .catch(function(err) {
        if(err)
            next(err);
    })

});

router.get('/board/write', isLoggedIn, function(req, res, next) {
    res.render('etc/writeBoard', {
        title: '자유게시판',
        user: req.user
    });
});

router.get('/search', function(req, res, next) {
    res.render('webtoon/search', {
        title: '웹툰 검색',
        webtoon: null,
        user: req.user
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
                categorys: other,
                user: req.user
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
                categorys: other,
                user: req.user
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
