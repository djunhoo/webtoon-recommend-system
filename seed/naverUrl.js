// hotelseed.js
var request = require('request');
var cheerio = require('cheerio');
var iconv   = require('iconv-lite');
var mongoose = require('mongoose');
var urls = [
	{
		category: 3,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=omnibus"
	},
	{
		category: 1,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=story"
	},
	{
		category: 2,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=episode"
	},
	{
		category: 4,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=daily"
	},
	{
		category: 5,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=comic"
	},
	{
		category: 6,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=drama"
	},
	{
		category: 7,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=pure"
	},
	{
		category: 8,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=action"
	},
	{
		category: 9,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=fantasy"
	},
	{
		category: 10,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=thrill"
	},
	{
		category: 11,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=sensibility"
	},
	{
		category: 12,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=sports"
	},
	{
		category: 13,
		src: "http://comic.naver.com/webtoon/genre.nhn?genre=historical"
	}
];
var webtoonUrl = require('../models/url.js').urlModel;
var webtoonCategoryModel = require('../models/WebtoonCategory').webtoonCategoryModel;

console.log(urls);
urls.forEach(function(url){
	var options = {
	    url: url.src,
	    encoding: 'binary'
	};
	request(options, function(err, response, body) {
	    if(err) return console.log('err', err);
	    var strContents = iconv.decode(body, 'utf-8');
	    var $ = cheerio.load(strContents);
			var strlength = $('dl').find('dt').length;

			for(var i=0; i<strlength; i++) {
				var strName = $('dl').find('dt')[i].children[0].attribs.href;
				var newUrl = new webtoonUrl();

				newUrl.category = url.category;
				newUrl.url = strName;
				newUrl.platform = "네이버";
				newUrl.save(function(err, doc) {
					 if(err) console.log('err=', err);
				});
				console.log('url=', newUrl);
			}
		//	mongoose.disconnect();
	});
});
