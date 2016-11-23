var express = require('express');
var router = express.Router();
var User = require('../models/user');

var passport = require('passport');

//全局变量
global.title = 'xiaoyun';

router.use(function(req,res,next){
  console.log("235");
  next();
})
// 商城首页
router.get('/', function(req, res, next) {
	// 如果cookie未被设置过authenticated则重定向 
	if(!req.session.authenticated){
    return res.redirect('/shop/login'); 
  } 
  console.log('Cookies: ', req.cookies);
  res.render('shop/index',{title: '陈小姐的店',username:"username"});
});

//登录页面
router.route('/login')
  .get(function(req, res){
      res.render('shop/client/login',{})
  })
  .post(passport.authenticate('local', { failureRedirect: '/shop/login' }),
    function(req, res) {
      // 如果进入了该方法，则已经验证成功。：
      req.session.authenticated = true; // 不仅设置了cookie，还设置了对应的哈希值
      res.status(200).end();
			res.redirect('/shop');
		}
	);

//注册页面
router.route('/register')

	.get(function(req, res) {
  		res.render('shop/client/register',{title: '陈小姐的店-注册'});
	})

    .post(function (req, res, next) {
       var username = req.body.username || '',
            password = req.body.password || '';
       if (username.length === 0 || password.length === 0) {
            return res.status(400).end('用户名或密码不合法');
        }
/*        User.create({username: username, password: password},
            function(err, user) {
                if (err) return next(err);    // 交给接下来的错误处理中间件
                res.status(201).end('注册成功');       // 存储成功
            });*/
        //密码加密
        User.register(new User({ username: username }), req.body.password,
        	function(err) {
            	if (err){
            		console.log('用户名已被使用');
            	} 
            	res.status(201).end();
       		})
        //register(user, password, cb) Convenience method to register a new user instance with a given password.Checks if username is unique.
    });

module.exports = router;