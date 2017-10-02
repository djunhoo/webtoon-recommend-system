var express = require('express');
var router = express.Router();
var Webtoon = require('../models/webtoon').webtoonModel;

/* GET home page. */
router.get('/', function(req, res, next) {
  Webtoon.findRandom({}, {}, {limit: 10}, function(err, results) {
    console.log(results);
        res.render('index', { title: 'Express', webtoon:results  });
  });

});

module.exports = router;
