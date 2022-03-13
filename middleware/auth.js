module.exports = {
    ensureAuth: function(req, res, next){
        if(req.session.username){
            return next()
        }else{
            res.redirect('/login')
        }
    },
    ensureGuest: function(req, res, next){
        if(req.session.username){
            res.redirect('/')
        }else{
            return next()
        }
    }
}