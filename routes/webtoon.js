// webtoon.js

var express = require('express');
var router = express.Router();
var Webtoon = require('../models/webtoon').webtoonModel;
var Comment = require('../models/comment').commentModel;

router.post('/comment/write', function(req, res, next) {

    var webtoonId = req.body.webtoonId;
    var userId = req.user._id;
    var content = req.body.content;
    var point = req.body.point;

    if(!webtoonId || !userId || !content || !point) {
        console.log('inavlid params');
    }

    Comment.findOne({userId: userId,
                    webtoonId: webtoonId}, function(err, comment) {
        if(comment) {
            console.log('이미 리뷰가 있습니다.');
            return;
        } else {
            var commentObject = new Comment();
            commentObject.content = content;
            commentObject.point = point;
            commentObject.userId = userId;
            commentObject.webtoonId = webtoonId;
            commentObject.save();
            Comment.populate(commentObject, {path: "userId"}, function(err, populateComment) {
                res.send(populateComment);
            });

        }
    });
});


router.get('/:webtoon_id', function(req, res, next) {

    var webtoon_id = req.params.webtoon_id;
    console.log('id=', webtoon_id);
    var isRead = true;

    if (!webtoon_id) {
        console.log('파라미터 에러');
    }
    Webtoon.find({
        _id: webtoon_id
    }).populate('categorys').exec(function(err, doc) {
        if (err) next(err);

        if (!doc) {
            res.json({
                err: "찾는 웹툰이 없다."
            })
        }
        console.log('doc-', doc[0].link_url);

        if (req.user) {
            var webtoonMap = new Map();
            req.user.readWebtoon.forEach(function(userToon) {
                webtoonMap.set(userToon.name, userToon);
            });
            var checkWebtoon = webtoonMap.get(doc[0].name);
            if (checkWebtoon) {
                isRead = false;
            }
        }
        console.log('isRead=', isRead);
        res.render('webtoon/webtoon', {
            title: doc.name,
            user: req.user,
            webtoon: doc[0],
            isRead: isRead
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
