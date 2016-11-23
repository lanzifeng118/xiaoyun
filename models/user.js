
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//为UserSchema添加了一个插件，该插件为User模型添加了一些验证和加密方法
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    username: {type: String, index: {unique: true}},
    password: String,
/*    avatar: {
        type: String,
        default: '/images/default-avatar.jpeg'
    },
    title: {
        type: String,
        default: '未命名博客'
    },
    description: {
        type: String,
        default: '博主很懒，还没有添加任何描述……'
    }*/
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);