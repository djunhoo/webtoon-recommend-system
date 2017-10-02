// hotelseed.js
var request = require('request');
var cheerio = require('cheerio');
var iconv   = require('iconv-lite');
var mongoose = require('mongoose');
var urls = [];
urls.push("http://comic.naver.com/webtoon/genre.nhn?genre=omnibus");
var webtoonUrl = require('../models/url.js').urlModel;
var webtoonCategoryModel = require('../models/WebtoonCategory').webtoonCategoryModel;

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
				var strName = $('dl').find('dt')[i].children[0].attribs.href;
				var newUrl = new webtoonUrl();

				newUrl.category = 3;
				newUrl.url = strName;
				newUrl.save(function(err, doc) {
					 if(err) console.log('err=', err);
				});
				//console.log('url=', newUrl);
			}
	});
});

//mongoose.disconnect();
