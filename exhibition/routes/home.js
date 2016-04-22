module.exports = function(app){
    app.get('/home',function(req,res){
       var Commodity = global.dbHelper.getModel('commodity');
        Commodity.find({},function(err,docs){
            console.log(docs);
            res.render('home',{Commoditys:docs});
        })
    });
}