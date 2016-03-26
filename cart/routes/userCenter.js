module.exports = function (app) {
    app.get('/userCenter', function (req,res) {
        if(req.session.user){
            res.render('userCenter');
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