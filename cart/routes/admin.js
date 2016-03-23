module.exports = function(app){
    app.get('/admin',function(req,res){
        if(req.session.user && req.session.user.admin){
            var Commodities = global.dbHelper.getModel('commodity');
            var User = global.dbHelper.getModel('user');
            Commodities.find({},function(err,docs1){
                User.find({},function(err,docs2){
                    res.render('admin',{commoditys:docs1,users:docs2,admin:req.session.user});
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
    });
    app.post('/updateCommodity',function(req,res){
        if(req.session.user && req.session.user.admin) {
            var Commodity = global.dbHelper.getModel('commodity');
            var oname = req.body.oname,
                nname =  req.body.nname,
                price = req.body.price,
                imgSrc = req.body.imgSrc;
            Commodity.update({name:oname},{$set:{name:nname,price:price,imgSrc:imgSrc}},function(err,doc){
                if(doc > 0){
                    res.redirect('/cart');
                }
            });
        }else {
            req.session.error = '请重新登录';
            res.redirect('/adminLogin')
        }
    });
}