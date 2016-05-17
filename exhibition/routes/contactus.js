module.exports = function(app){
    app.get('/contactus',function(req,res){
        res.render('contactus');
    });
    app.post('/contactus',function(req,res) {
        var Msg = global.dbHelper.getModel('msg');
        var phone = req.body.msgPhone,
            email = req.body.msgEmail,
            msgContent = req.body.msgContent;
        Msg.create({
            phone: phone,
            email: email,
            msgContent: msgContent
        }, function (err, doc) {
            if (err) {
                res.send(500);
            } else {
                req.session.error = '创建成功';
                res.send(200);
            }
        })
    });
}