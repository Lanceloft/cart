module.exports = function (app) {
    //详情
    app.get('/exh_detail', function (req, res) {
        var Commodity = global.dbHelper.getModel('commodity');
        var User = global.dbHelper.getModel('user');
        var uid = req.query.uid;
        if(req.session.user){
            var query = {"name":req.session.user.name}
        }else {
            var query = {"name":"000"}
        }
        Commodity.findOne({"_id":uid}, function (err, docs1) {
            if (err) {
                return res.redirect('/');
            }else {
                User.find(query,function(err,docs2){
                    res.render('exh_detail',{commodity:docs1,user0:docs2});
                });
            }
        })
    })
}