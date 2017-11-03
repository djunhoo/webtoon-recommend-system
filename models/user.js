// models/ user
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var job = require('./job').jobSchema;
var category = require('./WebtoonCategory').webtoonCategorySchema;
var db = require('./db');
var webtoonSchema = require('./webtoon').webtoonSchema;
var platform = require('./WebtoonPlatform').platformSchema;
var webtoon = require('./webtoon').webtoonModel;

var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);

var userSchema = mongoose.Schema({
    //_id              : Number,
    email: String,
    password: String,
    name: String,
    age: String,
    job: {
        type: Number,
        ref: 'job'
    },
    sex: String,
    token: String,
    readWebtoon: [webtoonSchema],
    preferCategory: {
        type: Number,
        ref: 'category'
    },
    preferPlatform: {
        type: Number,
        ref: 'platform'
    },
    profImg: String
});

// 해쉬 암호화
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(autoIncrement.plugin, {
    model: 'user',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

var User = db.model('user', userSchema);

module.exports = {
    userModel: User,
    userSchema: userSchema
};
