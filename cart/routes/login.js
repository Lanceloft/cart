var crypto = require('crypto');
module.exports = function(app){
    app.get('/login',function(req,res){
        res.render('login');
    });
    app.post('/login',function(req,res){
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname,
            upwd = req.body.upwd;
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
    })
}