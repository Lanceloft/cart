module.exports = function(app){
    app.get('/bootstrap',function(req,res){res.render('bootstrap')})
    app.get('/home',function(req,res){
        if(req.session.user){
           var Commodity = global.dbHelper.getModel('commodity');
            Commodity.find({},function(err,docs){
                console.log(docs);
                res.render('home',{Commoditys:docs});
            })
        }else {
            res.redirect('/login');
        }
    });
    app.get('/addcommodity',function(req,res){
        if(!req.session.user){
            res.redirect('/login');
        }else {
            res.render('addcommodity');
        }
    });
    app.post('/addcommodity',function(req,res){
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.create({
            name:req.body.name,
            price:req.body.price,
            imgSrc:req.body.imgSrc
        },function(err,doc){
            if(doc){
                res.send(200);
            }else {
                res.send(404);
            }
        })
    })
}