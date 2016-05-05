module.exports = function(app){
    require('./cart')(app);
    require('./register')(app);
    require('./home')(app);
    require('./adminLogin')(app);
    require('./admin')(app);
    require('./userCenter')(app);
    require('./forget')(app);
    require('./exhibition')(app);
    var crypto = require('crypto');
    var fs = require('fs');
    var RandExp = require('randexp');
    var ccap = require('ccap');
    //验证码
    var text = '';
    app.get('/capt/:random', function (req, res) {
        var captcha = ccap({
            width: 120, //配置验证码图片的width,default is 256
            height: 40, //配置验证码图片的 height,default is 60
            offset: 25, //验证码 文本间距,default is 40
            quality: 200, //图片质量,default is 50
            fontsize: 36, //字符字体大小,default is 57
            generate: function () { //用户自定义生成验证码的函数
                return new RandExp(/[A-Za-z0-9]{4}/).gen();
            }
        });
        var ary = captcha.get(); //ary[0] 验证码字符串,ary[1] 验证码图片数据.
        text = ary[0]; //验证码字符串
        console.log(text); //后台输出验证码字符串
        var buffer = ary[1]; //验证码图片数据
        res.end(buffer);
    });
    app.get('/',function(req,res){
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.find({},function(err,docs){
            console.log(docs);
            if(req.session.user) {
                res.render('index', {userDoc: req.session.user,Commoditys:docs});
            }else {
                res.render('index',{Commoditys:docs});
            }
        })
    });
    app.post('/login',function(req,res){
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname,
            upwd = req.body.upwd,
            code = req.body.code;
        if (code == text.toLowerCase()) {
            var md5 = crypto.createHash('md5'),
                password = md5.update(upwd).digest('hex');
            User.findOne({name:uname},function(err,doc){
                if(err){
                    res.end(500);
                    req.session.error = '网络异常';
                }else if(!doc){
                    req.session.error = '用户名不存在';
                    console.log('用户名不存在');
                    res.send(404);
                }else {
                    if(doc.password != password){
                        req.session.error = '密码错误';
                        res.send(404);
                    }else {
                        req.session.user = doc;
                        res.send(200);
                    }
                }
            })
        }else {
           req.session.error = '验证码错误';
           res.send(404);
        }
    })
}