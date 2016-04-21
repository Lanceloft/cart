module.exports = function (app) {
    app.get('/userCenter', function (req,res) {
        if(req.session.user){
            if(req.session.user.admin){
                res.redirect('admin');
            }
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