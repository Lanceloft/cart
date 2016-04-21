var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var session = require('express-session');
var crypto = require('crypto');
var app = express();
//全局
global.dbHelper = require('./common/dbHelper');
global.db = mongoose.connect('mongodb://127.0.0.1:27017/cart');

app.use(session({
    secret:'secret',
    cookie:{
        maxAge:1000 * 60 * 60 * 24 * 30
    }
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

//静态资源
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    res.locals.message = '';
    if(err){
        res.locals.message = '<div style="position: absolute;top:0;color:red;right: 0;">' + err + '</div>';
    }
    next();
});
require('./routes')(app);
app.get('/',function(req,res){
    res.render('login');
});

app.listen(3000);
