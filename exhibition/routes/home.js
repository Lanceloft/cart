module.exports = function(app){
    app.get('/home',function(req,res){
        var Commodity = global.dbHelper.getModel('commodity');
        var type = req.query.type||'全部';
        var address = req.query.address||'全部';
        var searchText = req.query.searchText;
        var nSearchText = new RegExp(searchText);
        console.log(type+''+address);
        type = (type=="undefined"?'全部':type);
        address = (address=="undefined"?'全部':address);
        if(!searchText){
            var query;
            if(type == '全部' && address != '全部'){
                type = '';
                query = {address:address}
            }else if(address == '全部' && type != '全部'){
                address = '';
                query = {type:type}
            }else if(type == '全部' && address == '全部'){
                query = {}
            }else {
                query = {type:type,address:address}
            }
            Commodity.find(query,function(err,doc){
                if(doc){
                    res.render('home',{Commoditys:doc});
                }else {
                    console.log(err);
                }
            });
        }else {
            //搜索
            Commodity.find({name:nSearchText},function(err,doc){
                if(doc){
                    res.render('home',{Commoditys:doc});
                }else {
                    console.log(err);
                }
            });
        }
    });
}