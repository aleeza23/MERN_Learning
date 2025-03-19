const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing")
const Review = require("../models/reviews.js");
const { reviewSchema } = require("../ServerSchemaValid.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body) //JOI WILL VALIDATE ALL THE REQUIRED INFO IS PRESENT TO STORE IN DB 
    if (error) {
        throw new ExpressError(400, error)
    } else {
        next()
    }
}
//POST REVIEW ROUTE
router.post("/", isLoggedIn, validateReview, WrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview)
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!")
    res.redirect(`/listings/${listing._id}`)
}))

//DELETE REVIEW ROUTE
router.delete("/:reviewId", isAuthor, WrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)

    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${id}`)
}))

module.exports = router