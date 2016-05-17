Cart.remove({"_id": req.params.id}, function (err, CartDoc2) {
    //成功返回1 失败0
    if (CartDoc2 > 0) {
        res.jsonp({status: "ok"});
    }
})