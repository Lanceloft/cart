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
    });
    //查询该日期剩余席位
    app.post('/getRemainSeat', function (req,res) {
        var Commodity = global.dbHelper.getModel('commodity');
        var remainSeat = global.dbHelper.getModel('remainSeat');
        var cId = req.body.cId;
        var cUseTime = req.body.cUseTime;
        remainSeat.find({cId:cId,date:new Date(cUseTime)}, function (err, docs1) {
            if(docs1.length == 0){
                Commodity.find({"_id":cId}, function (err, docs2) {
                    res.send(200,{remainSeat:docs2});
                })
            }else {
                res.send(200,{remainSeat:docs1});
            }
        })
    })
}