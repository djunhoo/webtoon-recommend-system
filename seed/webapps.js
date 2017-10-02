// hotelseed.js
var request = require('request');
var cheerio = require('cheerio');
var iconv   = require('iconv-lite');
var mongoose = require('mongoose');
var Webtoon = require('../models/webtoon').webtoonModel;
var webtoonCategoryModel = require('../models/WebtoonCategory').webtoonCategoryModel;
var urls = [];
urls.push("http://comic.naver.com/webtoon/genre.nhn?genre=omnibus");

console.log(urls);
urls.forEach(function(url){
	var options = {
	    url: url,
	    encoding: 'binary'
	};
	request(options, function(err, response, body) {
	    if(err) return console.log('err', err);
	    var strContents = iconv.decode(body, 'utf-8');
	    var $ = cheerio.load(strContents);
	    //var strName = $('dl').find('dt')[0].children[0].attribs.title;
			var strlength = $('dl').find('dt').length;

			for(var i=0; i<strlength; i++) {
				var strName = $('dl').find('dt')[i].children[0].attribs.title;
				var strWriter = $('.desc').find('a')[i].children[0].data;
				var strCategory = "옴니버스";
				var strPoint = $('.rating_type').find('strong')[i].children[0].data;
				var strImage = $('.thumb').find('img')[i].attribs.src;
				var last_url = $('.thumb').find('a')[i].attribs.href;
				var webtoon_url = "comic.naver.com" + last_url;
				var myWebtoon = new Webtoon();
				myWebtoon.name = strName;
				myWebtoon.writer = strWriter;
				myWebtoon.point = strPoint;
				myWebtoon.img_src = strImage;
				myWebtoon.link_url = webtoon_url;
				myWebtoon.categorys.push(1);
				myWebtoon.save(function(err, doc) {
					 if(err) console.log('err=', err);
					 console.log('doc=', doc);
				});
			}
	});
});
