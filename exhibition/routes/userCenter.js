var moment = require('moment');
module.exports = function (app) {
    app.get('/userCenter', function (req,res) {
        if(req.session.user){
            if(req.session.user.admin){
                res.redirect('admin');
            }
            var User = global.dbHelper.getModel('user');
            var Cart = global.dbHelper.getModel('cart');
            User.find({"_id":req.session.user._id},function(err,docs1){
                Cart.find({"uId":req.session.user._id},function(err,docs2){
                    if(docs2.length){
                        docs2.forEach(function(doc) {
                            // item 对应每条记录
                            doc.cUseTime_string = moment(doc.cUseTime).format('YYYY-MM-DD');
                            doc.cSumbitTime_string = moment(doc.cSumbitTime).format('YYYY-MM-DD');
                        })
                    }else {
                        docs2 = {length:0}
                    }
                    res.render('userCenter',{users:docs1,carts:docs2});
                })
            });
        }else {
            res.redirect('/');
        }
    });
    app.get('/logout', function (req, res) {
        if(req.session.user){
            delete req.session.user;
        }
        res.redirect('/');
    })
}