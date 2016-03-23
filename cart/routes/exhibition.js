module.exports = function (app) {
    //商品名模糊查询->正则
    app.get('/search',function(req,res){
        if(req.session.user && req.session.user.admin) {
            var Commodity = global.dbHelper.getModel('commodity');
            var searchText = req.query.searchText;
            var nSearchText = new RegExp(searchText);
            Commodity.find({name:nSearchText},function(err,doc){
                if(doc){
                    res.render('search',{search:doc});
                }else {
                    console.log(err);
                }
            });
        }else {
            req.session.error = '请重新登录';
            res.redirect('/login')
        }
    });
    //详情
    app.get('/exh_detail', function (req, res) {
        var Commodity = global.dbHelper.getModel('commodity');
        var uid = req.query.uid;
        Commodity.findOne({"_id":uid}, function (err, doc) {
            if (err) {
                return res.redirect('/');
            }else {
                res.render('exh_detail',{
                    commodity:doc
                });
            }
        })
    })
}