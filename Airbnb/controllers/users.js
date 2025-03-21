const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username })
        const registerdUser = await User.register(newUser, password)

        // LOGIN USER AFTER SIGNUP AUTOMATICALLY
        req.login(registerdUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings")
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }

        req.flash("success", "You are logged out!")
        res.redirect("/listings")
    })
}