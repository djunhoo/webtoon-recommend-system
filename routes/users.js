/* GET users listing. */
module.exports = function(passport) {
    require('../config/util');
    var express = require('express');
    var router = express.Router();


    // 모델 정의 부분
    var User = require('../models/user').userModel;
    var Webtoon = require('../models/webtoon').webtoonModel;
    var Recommend = require('../models/recommend').recommendModel;
    var Comment = require('../models/comment').commentModel;
    var common = require('../config/etc');
    var Job = require('../models/job').jobModel;
    var Category = require('../models/WebtoonCategory').webtoonCategoryModel;
    var Platform = require('../models/WebtoonPlatform').platformModel;

    // 기타 사용하는 모듈 정의
    var async = require('async');
    var Chart = require('chart.js');
    var aws = require('aws-sdk');
    var multer = require('multer');
    var multerS3 = require('multer-s3');
    var s3 = new aws.S3();
    var upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'dokio2',
            key: function(req, file, cb) {
                console.log(file);
                cb(null, Date.now().toString() + file.originalname); //use Date.now() for unique file keys
            }
        })
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('successMessage', '로그인이 필요합니다.');
            res.redirect('/users/login');
        }
    }

    router.get('/recommend', isLoggedIn, function(req, res, next) {
        res.render('webtoon/recommendType', {
            title: '웹툰 추천',
            user: req.user
        });
    });

    router.get('/login', function(req, res, next) {
        res.render('user/login', {
            message: req.flash('loginMessage'),
            success: req.flash('successMessage'),
            title: '로그인',
            user: req.user
        });
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true,
    }));

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/users/login',
        failureRedirect: '/users/login',
        failureFlash: true,
    }));

    router.post('/webtoon/read', function(req, res, next) {
        var user = req.user;
        var webtoonId = req.body.webtoon_id;

        if (user == undefined) {
            console.log('("user is not found")')
            return next(new Error("user is not found"));
        }


        if (!webtoonId)
            next(new Error("webtoonId is not found"));

        Webtoon.findOne({
            _id: webtoonId
        }, function(err, webtoon) {
            if (err)
                next(new Error("ERR"));
            if (!webtoon)
                next(new Error("webtoon is not found"));


            var userWebtoon = user.readWebtoon;
            var webtoonMap = new Map();
            userWebtoon.forEach(function(userToon) {
                webtoonMap.set(userToon.name, userToon);
            });

            var checkWebtoon = webtoonMap.get(webtoon.name)
            if (!checkWebtoon) {
                user.readWebtoon.push(webtoon);
            }
            user.save(function(err, doc) {
                res.send({
                    user: user,
                    title: webtoon.name,
                    webtoon: webtoon
                })
            });
        });
    });

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    router.post('/edit', upload.single('image'), function(req, res, next) {
        console.log('req.params=', req.body);
        User.findOne({
            _id: req.user._id
        }, function(err, user) {
            if (err)
                next(err);
            if (!user) {
                console.log('찾는 사용자가 없습니다.');
                next(err);
            } else {
                user.name = req.body.name;
                user.age = parseInt(req.body.age);
                user.job = req.body.job;
                user.sex = req.body.sex;
                user.preferCategory = req.body.category;
                user.preferPlatform = req.body.platform;
                if (req.file) {
                    user.profImg = req.file.location;
                }
                return user.save();
            }

        }).then(function(user) {
            res.redirect('/users/edit')
        });
    });

    router.get('/edit', isLoggedIn, function(req, res, next) {
        Comment.find({
                userId: req.user._id
            })
            .populate('userId')
            .populate('webtoonId')
            .exec().then(function(comments) {
                return Job.find({}).exec().then(function(jobs) {
                    return {
                        jobs: jobs,
                        comments: comments
                    }
                });
            }).then(function(result) {
                return Category.find({}).exec().then(function(categorys) {
                    result["categorys"] = categorys
                    return result;
                });
            }).then(function(result) {
                Platform.find({}).exec().then(function(platforms) {
                    res.render('user/edit', {
                        title: '정보 수정',
                        tab: 5,
                        user: req.user,
                        comments: result.comments,
                        jobs: result.jobs,
                        categorys: result.categorys,
                        platforms: platforms
                    });
                });
            }).catch(function(error) {
                console.log('err=', err);
            });
    });

    router.get('/mypage', isLoggedIn, function(req, res, next) {
        console.log('hi');
        Comment.find({
                userId: req.user._id
            }).populate('userId')
            .populate('webtoonId')
            .populate('preferPlatform')
            .populate('preferCategory')
            .exec().then(function(comments) {
                res.render('user/mypage', {
                    title: '마이 페이지',
                    tab: 1,
                    user: req.user,
                    comments: comments
                });
            });
    });

    router.get('/recommendWebtoons', isLoggedIn, function(req, res, next) {
        Comment.find({
                userId: req.user._id
            }).populate('userId')
            .populate('webtoonId')
            .populate('preferPlatform')
            .populate('preferCategory')
            .exec().then(function(comments) {
                res.render('user/recommendWebtoons', {
                    title: '마이페이지',
                    tab: 2,
                    user: req.user,
                    comments: comments
                });
            });
    });

    router.get('/comments', isLoggedIn, function(req, res, next) {
        Comment.find({
                userId: req.user._id
            }).populate('userId')
            .populate('webtoonId')
            .populate('preferPlatform')
            .populate('preferCategory')
            .exec().then(function(comments) {
                console.log('comments=', comments);
                res.render('user/comments', {
                    title: '마이페이지',
                    tab: 3,
                    user: req.user,
                    comments: comments
                });
            });
    });

    function getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
    }

    function getRatingMap(comments) {
        var ratingMap = new Map();
        for (var i = 0.0; i <= 5.0; i += 0.5) {
            ratingMap.set(i, 0);
        }
        for (var i = 0; i < comments.length; i++) {
            ratingMap.set(comments[i].point, ratingMap.get(comments[i].point) + 1);
        }
        return ratingMap;
    }

    function getRecommendCategory(results) {
        var categoryCountMap = new Map();
        var compareComment = [];
        for (var i = 0; i < results.comments.length; i++) {
            if (results.comments[i].point >= 3.5) {
                compareComment.push(results.comments[i]);
            }
        }
        for (var i = 0; i < results.categorys.length; i++) {
            categoryCountMap[results.categorys[i].category_name] = 0;
        }
        for (var i = 0; i < compareComment.length; i++) {
            categoryCountMap[compareComment[i].webtoonId.categorys[0].category_name] += 1;
        }

        var categoryData = [];
        var categoryLabel = [];

        for (var i = 0; i < results.categorys.length; i++) {
            if (categoryCountMap[results.categorys[i].category_name] > 0) {
                categoryData.push(results.categorys[i].category_name);
                categoryLabel.push(categoryCountMap[results.categorys[i].category_name]);
            }
        }
        console.log('categoryData=', categoryData);
        console.log('categoryLabel=', categoryLabel);
        return {
            categoryData: categoryData,
            categoryLabel: categoryLabel

        }

    }

    router.get('/dashboard', isLoggedIn, function(req, res, next) {
        Comment.find({
                userId: req.user._id
            }).populate('userId')
            .populate('webtoonId').then(function(comments) {
                return Category.populate(comments, {
                    path: 'webtoonId.categorys',
                    model: 'webtoonCategory'
                })
            })
            .then(function(comments) {
                return Platform.find({}).exec().then(function(platforms) {
                    return {
                        comments: comments,
                        platforms: platforms
                    }
                })
            })
            .then(function(result) {
                return Category.find({}).exec().then(function(categorys) {
                    result["categorys"] = categorys;
                    console.log('results=', result);
                    return result;
                });
            })
            .then(function(result) {
                var ratingMap = getRatingMap(result.comments);
                var chartLabel = [];
                var chartDatas = [];
                for (var j = 0.0; j <= 5.0; j += 0.5) {
                    chartLabel.push(j);
                    chartDatas.push(ratingMap.get(j));
                }
                var maxArray = [];
                ratingMap.forEach(function(item, key, mapObj) {
                    if (item == getMaxOfArray(chartDatas)) {
                        maxArray.push(key);
                    }
                });
                var hello = 0.0;
                for (var j = 0; j < chartDatas.length; j++) {
                    hello += chartLabel[j] * chartDatas[j];
                }
                var ratingAvg = hello / chartDatas.length;
                var recommendCategory = getRecommendCategory(result);
                res.render('user/dashboard', {
                    title: '마이페이지',
                    tab: 4,
                    user: req.user,
                    comments: result.comments,
                    maxRating: 5,
                    chartLabel: chartLabel,
                    chartDatas: chartDatas,
                    maxArray: maxArray,
                    ratingAvg: ratingAvg.toFixed(1),
                    recommendCategory: recommendCategory
                });
            }).catch(function(err) {
                console.log('err=', err);
                next(err);
            });
    });

    function getRecommendData(req, users) {
        var myUser = req.user;

        var recommendData = [];
        var agePoint = 0.2;
        var jobPoint = 0.1;
        var categoryPoint = 0.2;
        var sexPoint = 0.1;
        var platformPoint = 0.4;
        for (var i = 0; i < users.length; i++) {
            console.log('myUser=', myUser);
            console.log('userArray=', users[i]);
            if (myUser._id == users[i]._id) {
                continue;
            } else if(users[i].sex == undefined || users[i].job == undefined || users[i].age == undefined || users[i].preferCategory == undefined || users[i].preferPlatform == undefined) {
                continue;
            } else {
                var ageSum, jobSum, categorySum, sexSum, platformSum;

                ageSum = (myUser.age == users[i].age) ? 1 * agePoint : 0 * agePoint;
                jobSum = (myUser.job == users[i].job) ? 1 * jobPoint : 0 * jobPoint;
                categorySum = (myUser.preferCategory == users[i].preferCategory) ? 1 * categoryPoint : 0 * categoryPoint;
                sexSum = (myUser.sex == users[i].sex) ? 1 * sexPoint : 0 * sexPoint;
                platformSum = (myUser.preferPlatform == users[i].preferPlatform) ? 1 * platformPoint : 0 * platformPoint;

                var SumPoint = ageSum + jobSum + categorySum + sexSum + platformSum;
                recommendData.push({
                    point: SumPoint,
                    userId: users[i]._id
                })
            }
        }
        console.log('infunction=', recommendData);
        return recommendData;
    }


    router.get('/rec', function(req, res, next) {
        myUser = req.user;
        if (myUser.sex == undefined || myUser.job == undefined || myUser.age == undefined || myUser.preferCategory == undefined || myUser.preferPlatform == undefined) {
            res.redirect('/');
        }

        User.find({}, function(err, users) {

            var recommendData = getRecommendData(req, users);
            console.log('recommendData=', recommendData)
            var options = {
                $or: [{}]
            };

            recommendData = recommendData.sort(function(a, b) {
                return b.point - a.point
            });
            console.log('sortingrecommendData=', recommendData)

            var maxNumber = recommendData.length < 3 ? recommendData.length : 3;
            for (var i = 0; i < maxNumber; i++) {
                options.$or.push({
                    "_id": recommendData[i].userId
                });
            }
            options.$or.splice(0, 1);

            console.log('options=', options)
            User.find(options)
           .exec()
           .then(function(simmilarUsers) {
               console.log('simmilarUsers=', simmilarUsers)
               var recommendWebtoon = [];
               for(var i=0; i<simmilarUsers.length; i++) {
                   recommendWebtoon.push({
                       webtoon: simmilarUsers[i].readWebtoon[0],
                       userId: simmilarUsers[i]._id
                   });
               }
               console.log('recommendWebtoon=', recommendWebtoon);

               res.render('user/recommendResult', {
                   user:req.user,
                   title: "웹툰 추천",
                   webtoons: recommendWebtoon
               })
           });

        });
    });

    router.get('/', function(req, res, next) {
        var myUser = new User();
        myUser.email = "wefwef@naver.com";
        myUser.name = "이건호";
        myUser.age = "10대";
        myUser.job = 1;
        myUser.sex = "남자";
        myUser.categorys = "에피소드";
        myUser.platform = "네이버";
        myUser.save(function(err, doc) {
            res.json({
                user: myUser
            });
        });
    });


    /* router.post('/recommend', function(req, res, next) {
     User.find({_id: req.params.id}. function(err, myuser) {
       User.find({}, function(err, alluser) {
          allUser.forEach(function(err, user) {
               if(myuser == user)
                  callback();
               var myJacadRelationship = new JacadRelationshiop();
               // 근접이웃 스키마 생성 및 저장
          });
       });
     });
   });
*/
    return router;
}
