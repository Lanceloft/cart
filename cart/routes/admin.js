module.exports = function(app){
    app.get('/admin',function(req,res){
        if(req.session.user && req.session.user.admin){
            var Carts = global.dbHelper.getModel('cart');
            var User = global.dbHelper.getModel('user');
            Carts.find({},function(err,docs1){
                User.find({},function(err,docs2){
                    res.render('admin',{carts:docs1,users:docs2});
                });
            });

        }else {
            res.redirect('/adminLogin');
        }
    });
    app.post('/delUser',function(req,res){
        if(req.session.user && req.session.user.admin) {
            var User = global.dbHelper.getModel('user');
            var uname =  req.body.userName;
            User.remove({name:uname},function(err,doc){
                if(doc > 0){
                    res.redirect('/admin');
                }
            });
        }else {
            req.session.error = '请重新登录';
            res.redirect('/adminLogin')
        }
    })
}