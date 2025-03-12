const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");

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

        req.flash("success", "User Registered Successfully!");
        res.redirect("/listings")
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup")
    }

}))

module.exports = router