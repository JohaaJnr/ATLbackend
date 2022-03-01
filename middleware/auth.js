module.exports = {
    ensureAuth: function(req, res, next){
        if(req.session.userId){
            return next()
        }else{
            res.redirect('/login')
        }
    },
    ensureGuest: function(req, res, next){
        if(req.session.userId){
            res.redirect('/')
        }else{
            return next()
        }
    }
}