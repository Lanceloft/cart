module.exports = function(app){
    app.get('/admin',function(req,res){
        if(req.session.user && req.session.user.admin){
            var Commodities = global.dbHelper.getModel('commodity');
            var User = global.dbHelper.getModel('user');
            var Cart = global.dbHelper.getModel('cart');
            Commodities.find({},function(err,docs1){
                User.find({},function(err,docs2){
                    Cart.find({},function(err,docs3){
                        res.render('admin',{commoditys:docs1,users:docs2,carts:docs3,admin:req.session.user});
                    })
                });
            });
        }else {
            res.redirect('/adminLogin');
        }
    });
    app.post('/addcommodity',function(req,res){
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.create({
            name:req.body.name,
            address:req.body.address,
            imgSrc:req.body.imgSrc,
            detail:req.body.detail,
            status:'true'
        },function(err,doc){
            if(doc){
                res.send(200);
            }else {
                res.send(404);
            }
        })
    });
    //下架展厅
    app.get('/delExh/:id',function(req,res){
        //req.params.id
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.update({"_id":req.params.id},{$set:{status:false}},function(err,doc){
            if(doc > 0){
                res.redirect('/admin');
            }
        })
    });
    //上架展厅
    app.get('/exhToTure/:id',function(req,res){
        //req.params.id
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.update({"_id":req.params.id},{$set:{status:true}},function(err,doc){
            if(doc > 0){
                res.redirect('/admin');
            }
        })
    });
    ////修改展厅
    //app.get('/changeExh', function (req, res) {
    //    var Commodity = global.dbHelper.getModel('commodity');
    //    var uid = req.query.uid;
    //    Commodity.findOne({"_id":uid}, function (err, doc) {
    //        if (err) {
    //            return res.redirect('/');
    //        }else {
    //            res.render('admin',{
    //                changeExh:doc
    //            });
    //        }
    //    })
    //})
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