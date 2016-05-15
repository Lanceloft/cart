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
            res.redirect('/');
        }
    });
    app.post('/upload', global.upload.array('field1', 5), function (req, res) {
        req.flash('success', '文件上传成功!');
    });
    //添加展厅
    app.post('/addcommodity',function(req,res){
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.create({
            name:req.body.name,
            price:req.body.price,
            imgSrc:req.body.imgSrc,
            phone:req.body.phone,
            address:req.body.address,
            sumNum:req.body.sumNum,
            existNum:req.body.sumNum,
            usedNum:0,
            type:req.body.type,
            detail:req.body.detail,
            status:req.body.status
        },function(err,doc){
            if(doc){
                res.redirect('/admin');
            }else {
                res.send(404);
            }
        })
    });
    //下架展厅
    app.get('/exhToFalse/:id',function(req,res){
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.update({"_id":req.params.id},{$set:{status:false}},function(err,doc){
            if(doc > 0){
                res.jsonp({status:"ok"});
            }
        })
    });
    //上架展厅
    app.get('/exhToTrue/:id',function(req,res){
        //req.params.id
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.update({"_id":req.params.id},{$set:{status:true}},function(err,doc){
            if(doc > 0){
                res.jsonp({status:"ok"});
            }
        })
    });
    //删除展厅
    app.get('/delExh/:id',function(req,res){
        //req.params.id
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.remove({"_id":req.params.id},function(err,doc){
            if(doc > 0){
                res.jsonp({status:"ok"});
            }
        })
    });
    //修改展厅
    app.get('/changeExh/:id', function (req, res) {
        var Commodity = global.dbHelper.getModel('commodity');
        var uid = req.params.id,
            name = req.query.name,
            price = req.query.price,
            phone = req.query.phone,
            detail = req.query.detail;
        Commodity.update({"_id":uid},{$set:{name:name,price:price,phone:phone,detail:detail}},function(err,doc){
            if(doc > 0){
                res.jsonp({status:"ok"});
            }
        });
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
}