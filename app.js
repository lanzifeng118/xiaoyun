var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var shop = require('./routes/shop');

var app = express();

//数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
mongoose.connection.on('connected', function(){
    console.log('Connection success!');
});
mongoose.connection.on('error', function(err){
    console.log('Connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
    console.log('Connection disconnected');
});

// 引入handlebars
var hbs = require('hbs');

//加密
var passport = require('passport'),
    User = require('./models/user');

passport.use(User.createStrategy());

//cookie
app.use(cookieParser());

//session
app.use(session({secret: 'xiaoyun', 
  resave: true, 
  saveUninitialized: true
}))

//
app.use(passport.initialize());
app.use(passport.session());

//将一个User对象序列化为cookie中的值，以及如何从cookie中的值反序列化生成User对象
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// 设置
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

//设置静态资源
app.use('/public', express.static('public'));
app.use('/lib', express.static('lib'));

//全局变量
app.locals.authenticated = true;


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Mounts the middleware
app.use('/', routes);
app.use('/shop',shop)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
