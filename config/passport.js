// 인증 정보
var LocalStrategy   = require('passport-local').Strategy;
var jwt = require('jwt-simple');
var User            = require('../models/user'); // 사용자 모델



// App.Exports
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
          done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // 로컬 로그인
    passport.use('local-login', new LocalStrategy({
           usernameField : 'email',
           passwordField : 'password',
           passReqToCallback : true
       },
       function(req, email, password, done) {
           console.log('email=', email);
           console.log('password=', password);
           User.findOne({ 'email' :  email }, function(err, user) {
              console.log('user=',user);
               if (err)
                   return done(err);
               if (!user)
                   return done(null, false, req.flash('loginMessage', '아이디가 없습니다.'));
               if (!user.validPassword(password))
                   return done(null, false, req.flash('loginMessage', '비밀번호가 틀렸습니다.'));
               return done(null, user);
           });

       }));

    // 회원가입
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        process.nextTick(function() {
        User.findOne({ 'email' :  email }, function(err, user) {
            if (err)
                return done(err);
            if (user) {
                return done(null, false, req.flash('signupMessage', '회원가입이 되어 있는 이메일입니다.'));
            } else {
                var newUser      = new User();
                newUser.email    = email;
                newUser.password = newUser.generateHash(password);
                newUser.name     = req.body.name;
                newUser.token    = jwt.encode(email, configAuth.jwt_secret);
                console.log('newUser=', newUser);
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

        });

    }));

};
