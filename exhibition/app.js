var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var session = require('express-session');
var crypto = require('crypto');
var flash = require('connect-flash');
var app = express();


//全局
global.dbHelper = require('./common/dbHelper');
global.db = mongoose.connect('mongodb://127.0.0.1:27017/exhibition');

app.use(session({
    secret:'secret',
    cookie:{
        maxAge:1000 * 60 * 60 * 24 * 30
    }
}));
// 文件上传
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './exhibition/public/image/exhibition')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage });
global.upload = upload;
var cpUpload = upload.any();
app.use(cpUpload)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//静态资源
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {
    res.locals.user = req.session.user;
    var err = req.flash('error');
    res.locals.error = err.length ? err: null;
    var success = req.flash('success');
    res.locals.success = success.length ? success : null;

    next();
});
require('./routes')(app);

app.use(function (req, res, next) {
    res.status(404);

    if (req.accepts('html')) {
        return res.send("<h2>I'm sorry, I couldn't find that page.</h2>");
    }

    if (req.accepts('json')) {
        return res.json({ error: 'Not found' });
    }

    // default response type
    res.type('txt');
    res.send("Hmmm, couldn't find that page.");
})

app.listen(3005);
