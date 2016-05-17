var moment = require('moment');
var nodemailer = require("nodemailer");
module.exports = function(app){
    app.get('/admin',function(req,res){
        if(req.session.user && req.session.user.admin){
            var Commodities = global.dbHelper.getModel('commodity');
            var User = global.dbHelper.getModel('user');
            var Cart = global.dbHelper.getModel('cart');
            var Msg = global.dbHelper.getModel('msg');
            Commodities.find({},function(err,docs1){
                User.find({},function(err,docs2){
                    Cart.find({},function(err,docs3){
                        docs3.forEach(function(doc) {
                            // item 对应每条记录
                            doc.cUseTime_string = moment(doc.cUseTime).format('YYYY-MM-DD');
                            doc.cSumbitTime_string = moment(doc.cSumbitTime).format('YYYY-MM-DD');
                        });
                        Msg.find({}, function (err, docs4) {
                            res.render('admin',{commoditys:docs1,users:docs2,carts:docs3,msgs:docs4,admin:req.session.user});
                        })
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
    //预约提醒
    app.get('/remind/:id', function (req, res) {
        var Cart = global.dbHelper.getModel('cart');
        var User = global.dbHelper.getModel('user');
        Cart.find({"_id":req.params.id}, function (err,doc1) {
            var uId = doc1[0].uId;
            doc1[0].cUseTime_string = moment(doc1[0].cUseTime).format('YYYY-MM-DD');
            var cName =  doc1[0].cName;
            User.find({"_id":uId}, function (err,userDoc) {
                var email = userDoc[0].email;
                var transporter = nodemailer.createTransport({
                    host: "smtp.163.com",
                    port: 25,
                    auth: {
                        user: 'wangyiyun167@163.com',
                        pass: 'zhongshuai123'
                    }
                });
                var mailOptions = {
                    from: {
                        name: '江苏展览馆',
                        address: 'wangyiyun167@163.com'
                    }, // sender address
                    to: email, // list of receivers
                    name: '江苏展览馆用户预约提醒',
                    subject: '江苏展览馆用户预约提醒', // Subject line
                    text: "用户:" + userDoc[0].name
                    + "<br>您预约于"+ doc1[0].cUseTime_string +"参观" + cName +"，千万别忘记了哦！"
                    + "</a><br>请勿回复。", // plaintext body
                    html: "用户:" + userDoc[0].name
                    + "<br>您预约于"+ doc1[0].cUseTime_string +"参观" + cName +"，千万别忘记了哦！"
                    + "</a><br>请勿回复。" // html body
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }else {
                        Cart.update({"_id":req.params.id},{$set:{cRemind:true}},function(err,doc){
                            if(doc > 0){
                                res.jsonp({status:"ok"});
                            }
                        })
                    }
                });
            })
        })
    });
}