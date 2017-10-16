/* GET users listing. */
module.exports = function(passport) {
    var express = require('express');
    var router = express.Router();
    var User = require('../models/user');
    var Webtoon = require('../models/webtoon').webtoonModel;
    var Recommend = require('../models/recommend').recommendModel;

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('successMessage', '로그인이 필요합니다.');
            res.redirect('/login');
        }
    }

    router.get('/login', function(req, res, next) {
        res.render('user/login', {
            message: req.flash('loginMessage'),
            success: req.flash('successMessage'),
            title: '로그인',
            user: req.user
        });
    });

    router.post('/login', passport.authenticate('local-login', {
            successRedirect : '/',
            failureRedirect : '/users/login',
            failureFlash : true,
    }));

    router.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/users/login',
            failureRedirect : '/users/login',
            failureFlash: true,
    }));

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    router.get('/rec', function(req, res, next) {
        Webtoon.findOne({ _id: 1 }, function(err, doc) {

            var myrec = new Recommend();
            myrec.user_one_id = 1;
            myrec.user_two_id = 29;
            myrec.union = 6.00;
            myrec.intersection = 4.00;
            myrec.similarity = 0.6667;
            myrec.recommend = doc;
            myrec.save(function(err, doc) {
                if (err) console.log(err);
            });
            res.json({
                hi: 'hi'
            })
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