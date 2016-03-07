var crypto = require('crypto');
module.exports = function(app){
    app.get('/register',function(req,res){
        res.render('register');
    });
    app.post('/register',function(req,res){
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname,
            upwd = req.body.upwd;
        //密码用md5保存
        var md5 = crypto.createHash('md5'),
            password = md5.update(upwd).digest('hex');

        User.findOne({name:uname},function(err,doc){
            if(err){
                res.send(500);
                req.session.error = '网络异常';
            }else if(doc){
                req.session.error = '用户名已存在';
            }else {
                User.create({
                    name:uname,
                    password:password,
                    admin:false
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
    });
}