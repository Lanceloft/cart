module.exports = function(app){
    app.get('/admin',function(req,res){
        if(req.session.user && req.session.user.admin){
            var Carts = global.dbHelper.getModel('cart');
            Carts.find({},function(err,docs){
                console.log(docs);
                res.render('admin',{carts:docs});
            })
        }else {
            res.redirect('/adminLogin');
        }
    })
}