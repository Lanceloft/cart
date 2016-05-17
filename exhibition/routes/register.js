var crypto = require('crypto');
var nodemailer = require('nodemailer');
module.exports = function(app){
    app.get('/register',function(req,res){
        res.render('register');
    });
    app.post('/register',function(req,res){
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname,
            upwd = req.body.upwd,
            uemail = req.body.uemail,
            admin = req.body.admin;
        //密码用md5保存
        var md5 = crypto.createHash('md5'),
            password = md5.update(upwd).digest('hex');
        User.findOne({email:uemail}, function (err,doc) {
            if(err){
                res.send(500,'网络异常')
            }else if(doc){
                res.send(500,'邮箱已存在')
            }else{
                User.findOne({name:uname},function(err,doc){
                    if(err){
                        res.send(500,'网络异常')
                    }else if(doc){
                        res.send(500,'用户名已存在')
                    }else {
                        User.create({
                            name:uname,
                            password:password,
                            email:uemail,
                            admin:admin
                        },function(err,doc){
                            if(err){
                                res.send(500);
                            }else {
                                req.session.error = '创建成功';
                                res.send(200);
                            }
                        })
                    }
                })
            }
        })
    });
}