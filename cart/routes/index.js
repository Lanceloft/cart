module.exports = function(app){
    require('./login')(app);
    require('./cart')(app);
    //require('./logout')(app);
    require('./register')(app);
    require('./home')(app);
    require('./adminLogin')(app);
    require('./admin')(app);
    require('./forget')(app);
}