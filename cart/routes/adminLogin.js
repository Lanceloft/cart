module.exports = function(app){
    app.get('/adminLogin',function(req,res){
        res.render('adminLogin');
    });
    app.post('/adminLogin',function(req,res){
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname,
            upwd = req.body.upwd;
        User.findOne({name:uname},function(err,doc){
            if(err){
                res.end(500);
                req.session.error = '网络异常';
            }else if(!doc){
                req.session.error = '用户名不存在';
                console.log('用户名不存在');
                res.send(404);
            }else {
                if(doc.password != upwd){
                    req.session.error = '密码错误';
                    res.send(404);
                }else if(doc.admin=='True'){
                    req.session.user = doc;
                    res.redirect('/admin');
                    res.send(200);
                }else {
                    req.session.error = '你不是管理员';
                    res.send(404);
                }
            }
        })
    })
}