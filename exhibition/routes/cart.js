var moment = require('moment');
module.exports = function(app) {
    app.get('/cart', function (req, res) {
        var Cart = global.dbHelper.getModel('cart');
        if (!req.session.user) {
            req.session.error = "用户已过期，请重新登录";
            res.redirect('/');
        } else {
            Cart.find({"uId": req.session.user._id, "cStatus": false}, function (err, docs) {
                res.render('cart', {carts: docs});
            });
        }
    });
    //添加到预约订单
    app.get('/addToCart/:id', function (req, res) {
        var uId = req.session.user._id;
        var uName = req.query.uName;
        var uPhone = req.query.uPhone;
        var uMsg = req.query.uMsg;
        var cId = req.params.id;
        var uQuantity = req.query.uQuantity;
        var cUseTime = req.query.cUseTime;
        var cUseTime1 = req.query.cUseTime1;
        var cSumbitTime = req.query.cSumbitTime;
        var cStatus = req.query.cStatus;
        if (!req.session.user) {
            res.redirect('/');
        } else {
            var Commodity = global.dbHelper.getModel('commodity'),
                Cart = global.dbHelper.getModel('cart'),
                RemainSeat = global.dbHelper.getModel('remainSeat');
            Commodity.findOne({"_id": cId}, function (err, CommodityDoc) {
                if (CommodityDoc) {
                    Cart.create({
                        uId: uId,
                        uName: uName,
                        uPhone: uPhone,
                        uMsg: uMsg,
                        cId: cId,
                        cName: CommodityDoc.name,
                        cPrice: (CommodityDoc.price) * uQuantity,
                        cImgSrc: CommodityDoc.imgSrc,
                        cQuantity: uQuantity,
                        cSumbitTime: cSumbitTime,
                        cUseTime: cUseTime,
                        cStatus: cStatus
                    }, function (err, doc) {
                        if (doc) {
                            RemainSeat.findOne({"cId": cId, "date": new Date(cUseTime)}, function (err, RemainSeatDoc) {
                                if (RemainSeatDoc) {
                                    RemainSeat.update({"cId": cId, "date": new Date(cUseTime)}, {
                                        $set: {
                                            usedNum: parseInt(RemainSeatDoc.usedNum) + parseInt(uQuantity),
                                            existNum: RemainSeatDoc.existNum - uQuantity
                                        }
                                    }, function (err, RemainSeatDoc1) {
                                        if (RemainSeatDoc1) {
                                            res.send(200);
                                        }
                                    })
                                } else {
                                    RemainSeat.create({
                                        cId: cId,
                                        date: cUseTime,
                                        sumNum: CommodityDoc.sumNum,
                                        usedNum: uQuantity,
                                        existNum: CommodityDoc.sumNum - uQuantity
                                    }, function (err, doc) {
                                        res.send(200);
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
    //删除
    app.get('/delFromCart/:id', function (req, res) {
        //req.params.id 获取商品id
        var Cart = global.dbHelper.getModel('cart');
        var RemainSeat = global.dbHelper.getModel('remainSeat');
        var delNum = req.query.delNum;
        var cUseTime = req.query.cUseTime;
        Cart.findOne({"_id": req.params.id}, function (err, cartDoc1) {
            if (cartDoc1) {
                RemainSeat.findOne({"cId": cartDoc1.cId, "date": new Date(cUseTime)}, function (err, RemainSeatDoc1) {
                    if (RemainSeatDoc1) {
                        RemainSeat.update({"cId": cartDoc1.cId, "date": new Date(cUseTime)}, {
                            $set: {
                                usedNum: RemainSeatDoc1.usedNum - delNum,
                                existNum: parseInt(RemainSeatDoc1.existNum) + parseInt(delNum)
                            }
                        }, function (err, RemainSeatDoc2) {
                            if (RemainSeatDoc2) {
                                RemainSeat.remove({usedNum:0}, function (err,RemainSeatDoc3) {
                                    if(RemainSeatDoc2){
                                        Cart.remove({"_id": req.params.id}, function (err, CartDoc2) {
                                            //成功返回1 失败0
                                            if (CartDoc2 > 0) {
                                                res.jsonp({status: "ok"});
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
    //一周内确认
    app.get('/cartToTrue/:id', function (req, res) {
        //req.params.id
        var Cart = global.dbHelper.getModel('cart');
        Cart.update({"_id": req.params.id}, {$set: {cStatus: true}}, function (err, doc) {
            if (doc > 0) {
                res.jsonp({status: "ok"});
            }
        })
    });
    //预约修改
    app.get('/changeCart/:id', function (req, res) {
        var Cart = global.dbHelper.getModel('cart');
        var RemainSeat = global.dbHelper.getModel('remainSeat');
        var id = req.params.id,
            uPhone = req.query.uPhone,
            cQuantity = req.query.cQuantity,
            cUseTime = req.query.cUseTime,
            uMsg = req.query.uMsg,
            cStatus = req.query.cStatus,
            cPrice = req.query.cPrice;
        Cart.findOne({"_id": id}, function (err, cartDoc1) {
            if (cartDoc1) {
                RemainSeat.findOne({
                    "cId": cartDoc1.cId,
                    "date": new Date(cartDoc1.cUseTime)
                }, function (err, remainDoc1) {
                    if (remainDoc1) {
                        cartDoc1.cUseTime_string = moment(cartDoc1.cUseTime).format('YYYY-MM-DD');
                        console.log(cartDoc1.cUseTime_string == cUseTime);
                        if (cartDoc1.cUseTime_string == cUseTime) {
                            RemainSeat.update({"cId": cartDoc1.cId, "date": new Date(cartDoc1.cUseTime)}, {
                                $set: {
                                    usedNum: remainDoc1.usedNum - cartDoc1.cQuantity + parseInt(cQuantity),
                                    existNum: parseInt(remainDoc1.existNum) + parseInt(cartDoc1.cQuantity) - parseInt(cQuantity)
                                }
                            }, function (err, remainDoc2) {
                                if (remainDoc2) {
                                    Cart.update({"_id": id}, {
                                        $set: {
                                            uPhone: uPhone,
                                            cStatus: cStatus,
                                            uMsg: uMsg,
                                            cPrice: cPrice,
                                            cQuantity: cQuantity,
                                            cUseTime: cUseTime,
                                            cRemind: false
                                        }
                                    }, function (err, doc) {
                                        if (doc > 0) {
                                            res.jsonp({status: "ok"});
                                        }
                                    });
                                }
                            })
                        } else {
                            RemainSeat.update({"cId": cartDoc1.cId, "date": new Date(cartDoc1.cUseTime)}, {
                                $set: {
                                    usedNum: remainDoc1.usedNum - cartDoc1.cQuantity,
                                    existNum: parseInt(remainDoc1.existNum) + parseInt(cartDoc1.cQuantity)
                                }
                            }, function (err, remainDoc2) {
                                if (remainDoc2) {
                                    RemainSeat.findOne({
                                        "cId": id,
                                        "date": new Date(cUseTime)
                                    }, function (err, RemainSeatDoc) {
                                        console.log(RemainSeatDoc);
                                        if (RemainSeatDoc) {
                                            console.log("1");
                                            RemainSeat.update({"cId": id, "date": new Date(cUseTime)}, {
                                                $set: {
                                                    usedNum: parseInt(RemainSeatDoc.usedNum) + parseInt(cartDoc1.cQuantity),
                                                    existNum: RemainSeatDoc.existNum - cartDoc1.cQuantity
                                                }
                                            }, function (err, RemainSeatDoc1) {
                                                if (RemainSeatDoc1) {
                                                    res.jsonp({status: "ok"});
                                                }
                                            })
                                        } else {
                                            RemainSeat.create({
                                                cId: cartDoc1.cId,
                                                date: cUseTime,
                                                sumNum: remainDoc1.sumNum,
                                                usedNum: cQuantity,
                                                existNum: remainDoc1.sumNum - cQuantity
                                            }, function (err, RemainSeatDoc3) {
                                                if (RemainSeatDoc3) {
                                                    RemainSeat.remove({usedName:0}, function (err,RemainSeatDoc4) {
                                                        if(RemainSeatDoc4){
                                                            Cart.update({"_id": id}, {
                                                                $set: {
                                                                    uPhone: uPhone,
                                                                    cStatus: cStatus,
                                                                    uMsg: uMsg,
                                                                    cPrice: cPrice,
                                                                    cQuantity: cQuantity,
                                                                    cUseTime: cUseTime,
                                                                    cRemind: false
                                                                }
                                                            }, function (err, doc) {
                                                                if (doc > 0) {
                                                                    res.jsonp({status: "ok"});
                                                                }
                                                            });
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    });
}