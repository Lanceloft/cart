
var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var sass = require('gulp-ruby-sass');
var _if = require('gulp-if');
var isWindows = /^win/.test(require('os').platform());
var lr;
var EXPRESS_PORT = 3000;
var EXPRESS_ROOT = __dirname;
var LIVERELOAD_PORT = 35729;

if(isWindows){
    gutil.log(gutil.colors.bgGreen("Is it Windows? " + isWindows));
}

// 	LIVE RELOAD //

function startLiveReload(){
    lr = require('tiny-lr')();
    lr.listen(LIVERELOAD_PORT);
}


// EXPRESS //

function startExpress(){

    // Dependencies for Express

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

}


// NOTIFY LIVE-RELOAD //

function notifyLiveReload(event) {
    var fileName = require('path').relative(EXPRESS_ROOT+'/public', event.path);

    lr.changed({
        body: {
            files: [fileName]
        }
    });
}

// RELOAD //

function reload(sass,autoprefixer,notify){

    return gulp.src('public/css/**/*.scss')
        .pipe(sass({style: 'compressed'}))
        .pipe(autoprefixer('last 15 versions'))
        .pipe(gulp.dest('public/css'))
        .pipe(_if(!isWindows, notify({ message: 'That\'s All Folks!'})));
}

//// UGLIFY //
//
//function jsUglify(uglify, concat, gutil){
//    gutil.log(gutil.colors.bgBlue('Uglifying your JavaScript!'));
//    return gulp.src(EXPRESS_ROOT+'/public/js/**/*.js')
//        .pipe(uglify({ mangle: true, compress: true}))
//        .pipe(concat('main.min.js'))
//        .pipe(gulp.dest(EXPRESS_ROOT+'/public/javascripts/min/'));
//}


// GULP //

gulp.task('default', function(){
    startExpress();
    startLiveReload();
    //jsUglify(uglify, concat, gutil);
    reload(sass, autoprefixer, notify);

    gulp.watch('views/**/*.html', notifyLiveReload);

    gulp.watch('public/css/**/*.css', notifyLiveReload);

    gulp.watch('public/js/**/*.js', notifyLiveReload);


    //gulp.watch('public/javascripts/*.js', function(){
    //    return jsUglify(uglify, concat, gutil);
    //});

    gulp.watch('public/css/**/*.scss', function(){

        return reload(sass, autoprefixer, notify);
    });


});
