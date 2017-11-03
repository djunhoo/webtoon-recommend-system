// serviceseed.js
var db = require('../models/db');
var Platform = require('../models/WebtoonPlatform').platformModel;
var mongoose = require('mongoose');

var myPlatform = [
    new Platform({
        name: "네이버"
    }),
    new Platform({
        name: "다음"
    }),
    new Platform({
        name: "카카오페이지"
    }),
    new Platform({
        name: "탑툰"
    }),
    new Platform({
        name: "레진코믹스"
    }),
    new Platform({
        name: "폭스툰"
    }),
    new Platform({
        name: "케이툰"
    })
];
console.log('myPlatform=', myPlatform)
var done = 0;
for (var i = 0; i < myPlatform.length; i++) {
    myPlatform[i].save(function(err, result) {
        console.log('result=', result);
        done++;
        if (done == myPlatform.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
