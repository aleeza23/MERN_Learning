const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// USER SIGNUP ROUTES

// GET ROUTE
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})

// POST ROUTE
router.post("/signup", WrapAsync(async (req, res) => {
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
}))


// USER LOGIN ROUTES

// GET ROUTE
router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

// POST REQ
router.post("/login", saveRedirectUrl, passport.authenticate("local",
    { failureRedirect: "/login", failureFlash: true }),
    async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust!")
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl)
    })

// LOGOUT USER
router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }

        req.flash("success", "You are logged out!")
        res.redirect("/listings")
    })
})



module.exports = router