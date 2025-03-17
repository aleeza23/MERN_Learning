module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // GET THE ROUTE INFO WHICH USER WAS TRYING TO ACCESS BEFORE LOGIN
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "You must be logged in to create new listing!")
        return res.redirect("/login")
    }
    next()
}


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}