const express = require("express");
const router = express.Router({ mergeParams: true });

const WrapAsync = require("../utils/WrapAsync");
const Listing = require("../models/listing");
const listingSchema = require("../ServerSchemaValid.js")
const ExpressError = require("../utils/ExpressError.js")


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
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

//SHOW ROUTE
router.get("/:id", WrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs", { listing })
}))

//CREATE ROUTE
router.post("/", validateListing, WrapAsync(async (req, res, next) => {
    let { listing } = req.body;
    console.log("Parsed Listing Data:", listing); // Log the parsed listing data
    const newListing = new Listing(listing)
    console.log('new listing', newListing);

    await newListing.save()
    res.redirect("/listings")
}))

// EDIT LISTING ROUTE
router.get("/:id/edit", WrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
}))

//UPDATE ROUTE
router.put("/:id", validateListing, WrapAsync(async (req, res) => {
    let { id } = req.params;
    let { listing } = req.body;
    const updated = await Listing.findByIdAndUpdate(id, { ...listing }, { runValidators: true, new: true });
    res.redirect(`/listings/${id}`)
}))

//DELETE ROUTE
router.delete("/:id", WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))

module.exports = router