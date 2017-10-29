// hotelseed.js
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var mongoose = require('mongoose');
var Webtoon = require('../models/webtoon').webtoonModel;
var urlModel = require('../models/url').urlModel;

urlModel.find({}, function(err, urls) {
  urls.forEach(function(url) {
    var options = {
      url: "http://comic.naver.com" + url.url,
      encoding: 'binary'
    };
    request(options, function(err, response, body) {
      if (err) return console.log('err', err);
      var strContents = iconv.decode(body, 'utf-8');
      var $ = cheerio.load(strContents);

      try {
          var strName = $('.detail').find('h2')[0].children[0].data.trim();
          var strWriter = $('.detail').find('h2').find('span')[0].children[0].data.trim();
          var strImage = $('.comicinfo').find('.thumb').find('img')[0].attribs.src;
          var strText = $('.detail').find('p')[0].children[0].data;
          var strPoint = $('.rating_type').find('strong')[0].children[0].data;
      } catch(e){
          console.log('try err=', err);
      }

      if(strName == undefined) {
          return;
      }
      console.log('strName=', strName);
      console.log('strWrtier=', strWriter);
      console.log('strWrtier=', strImage);
      console.log('strWrtier=', strText);
      console.log('strPoint=', parseFloat(strPoint));
      console.log('linkURL=', "http://comic.naver.com" + url.url);
      console.log('category=', url.category);
      Webtoon.findOne({name: strName}, function(err, webtoon){
          if(!webtoon){
              var newWebtoon = new Webtoon();
              newWebtoon.name = strName;
              newWebtoon.writer = strWriter;
              newWebtoon.point = strPoint;
              newWebtoon.description = strText;
              newWebtoon.link_url = url;
              newWebtoon.img_src = strImage;
              newWebtoon.platform = url.platform;
              newWebtoon.categorys.push(url.category);
        	  newWebtoon.save(function(err, doc) {
        		   if(err) console.log('err=', err);
        		   console.log('doc=', doc);
        	  });
          }
      });
    });
  });
});
