var moment = require('moment');
module.exports = function(app){
    app.get('/cart',function(req,res){
        var Cart = global.dbHelper.getModel('cart');
        if(!req.session.user){
            req.session.error = "用户已过期，请重新登录";
            res.redirect('/');
        }else {
            Cart.find({"uId":req.session.user._id,"cStatus":false},function(err,docs){
                res.render('cart',{carts:docs});
            });
        }
    });
    //添加到预约订单
    app.get('/addToCart/:id',function(req,res){
        var uId = req.session.user._id;
        var uName = req.query.uName;
        var uPhone =req.query.uPhone;
        var uMsg = req.query.uMsg;
        var cId = req.params.id;
        var uQuantity = req.query.uQuantity;
        var cUseTime = req.query.cUseTime;
        var cSumbitTime = req.query.cSumbitTime;
        var cStatus = req.query.cStatus;
        if(!req.session.user){
            res.redirect('/');
        }else {
            var Commodity = global.dbHelper.getModel('commodity'),
                Cart = global.dbHelper.getModel('cart');
                Commodity.findOne({"_id":cId},function(err,doc){
                    if(doc){
                        Cart.create({
                            uId:uId,
                            uName:uName,
                            uPhone:uPhone,
                            uMsg:uMsg,
                            cId:cId,
                            cName:doc.name,
                            cPrice: (doc.price)*uQuantity,
                            cImgSrc: doc.imgSrc,
                            cQuantity : uQuantity,
                            cSumbitTime:cSumbitTime,
                            cUseTime:cUseTime,
                            cStatus:cStatus
                        },function(err,doc){
                            if(doc){
                                res.send(200);
                            }
                        })
                    }
                })
        }
    })
    //删除购物车商品
    app.get('/delFromCart/:id',function(req,res){
        //req.params.id 获取商品id
        var Cart = global.dbHelper.getModel('cart');
        Cart.remove({"_id":req.params.id},function(err,doc){
            //成功返回1 失败0
            if(doc > 0){
                res.jsonp({status:"ok"});
            }
        })
    });
    //一周内确认
    app.get('/cartToTrue/:id',function(req,res){
        //req.params.id
        var Cart = global.dbHelper.getModel('cart');
        Cart.update({"_id":req.params.id},{$set:{cStatus:true}},function(err,doc){
            if(doc > 0){
                res.jsonp({status:"ok"});
            }
        })
    });
    //预约修改
    app.get('/changeCart/:id', function (req, res) {
        var Cart = global.dbHelper.getModel('cart');
        var id = req.params.id,
            uPhone = req.query.uPhone,
            cQuantity = req.query.cQuantity,
            cUseTime = req.query.cUseTime,
            uMsg = req.query.uMsg,
            cStatus = req.query.cStatus,
            cPrice = req.query.cPrice;
        Cart.update({"_id":id},{$set:{
            uPhone:uPhone,
            cStatus:cStatus,
            uMsg:uMsg,
            cPrice:cPrice,
            cQuantity:cQuantity,
            cUseTime:cUseTime,
            cRemind:false
        }},function(err,doc){
            if(doc > 0){
                res.jsonp({status:"ok"});
            }
        });
    });
}