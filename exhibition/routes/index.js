module.exports = function(app){
    require('./cart')(app);
    require('./register')(app);
    require('./home')(app);
    require('./admin')(app);
    require('./userCenter')(app);
    require('./forget')(app);
    require('./exhibition')(app);
    require('./contactus')(app);
    var crypto = require('crypto');
    var fs = require('fs');
    var RandExp = require('randexp');
    var ccap = require('ccap');
    //验证码
    var text = '';
    app.get('/capt/:random', function (req, res) {
        var captcha = ccap({
            width: 130, //配置验证码图片的width,default is 256
            height: 50, //配置验证码图片的 height,default is 60
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
            if(req.session.user) {
                res.render('index', {
                    userDoc: req.session.user,
                    Commoditys:docs
                });
            }else {
                res.render('index',{
                    Commoditys:docs
                });
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
                    res.send(404,err);
                }else if(!doc){
                    res.send(404,"用户名不存在");
                }else {
                    if(doc.password != password){
                        res.send(404,"密码错误");
                    }else {
                        req.session.user = doc;
                        res.send(200);
                    }
                }
            })
        }else {
            res.send(404,"验证码错误");
        }
    })
}