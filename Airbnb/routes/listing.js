const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../ServerSchemaValid.js");
const { isLoggedIn } = require("../middleware.js");


//MIDDLEWARE FOR VALIDATING SCHEMAS
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body) //JOI WILL VALIDATE ALL THE REQUIRED INFO IS PRESENT TO STORE IN DB 
    if (error) {
        throw new ExpressError(400, error)
    } else {
        next()
    }
}

//INDEX ROUTE
router.get("/", WrapAsync(async (req, res) => {
    const response = await Listing.find()
    res.render("listings/index.ejs", { response })
}))

//CREATE NEW LIST ROUTE
router.get("/new", isLoggedIn, (req, res) => {

    res.render("listings/new.ejs")
})

//SHOW ROUTE
router.get("/:id",  WrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews")

    if (!listing) {
        req.flash("error", "Listing does not exist!")
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}))

//CREATE ROUTE
router.post("/", validateListing, isLoggedIn, WrapAsync(async (req, res, next) => {
    let { listing } = req.body;
    const newListing = new Listing(listing)
    await newListing.save()

    req.flash("success", "New Listing Created!")
    res.redirect("/listings")
}))

// EDIT LISTING ROUTE
router.get("/:id/edit", isLoggedIn, WrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)

    if (!listing) {
        req.flash("error", "Listing does not exist!")
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing })
}))

//UPDATE ROUTE
router.put("/:id", validateListing, WrapAsync(async (req, res) => {
    let { id } = req.params;
    let { listing } = req.body;
    const updated = await Listing.findByIdAndUpdate(id, { ...listing }, { runValidators: true, new: true });

    req.flash("success", "Listing Updated Successfully!")
    res.redirect(`/listings/${id}`)
}))

//DELETE ROUTE
router.delete("/:id", isLoggedIn, WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id)

    req.flash("success", "Listing Deleted Successfully!")
    res.redirect("/listings")
}))

module.exports = router