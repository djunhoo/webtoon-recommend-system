var Webtoon = require('../models/webtoon').webtoonModel;
var uuid = require('node-uuid');
var download = require('image-downloader');
var imageArray = [];

Webtoon.find({}, function(err, docs) {
    docs.forEach(function(doc) {
        imageArray.push(doc.img_src);
    });
    console.log('imgsc=', imageArray);

    imageArray.forEach(function(src) {
        console.log('src=', src);
        var random_name = uuid.v4();
        var options = {
            url: src,
            dest: 'public/images/webtoon/'+ random_name + '.jpg' // Save to /path/to/dest/image.jpg
        }

        download.image(options)
            .then(({
                filename,
                image
            }) => {
                var real_url = '/images/webtoon/' + random_name + '.jpg';
                Webtoon.findOneAndUpdate({img_src: src}, {img_src: real_url}, {
                    upsert: true
                }, function(err, doc) {
                    if (err) console.log('err=', err);
                    console.log('doc=', doc);
                });
            }).catch((err) => {
                throw err
            })
    });
});
