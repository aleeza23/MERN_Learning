const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../ServerSchemaValid.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body) //JOI WILL VALIDATE ALL THE REQUIRED INFO IS PRESENT TO STORE IN DB 
    if (error) {
        throw new ExpressError(400, error)
    } else {
        next()
    }
}
//POST REVIEW ROUTE
router.post("/", isLoggedIn, validateReview, WrapAsync(reviewController.createReview))

//DELETE REVIEW ROUTE
router.delete("/:reviewId", isAuthor, WrapAsync(reviewController.deleteReview))

module.exports = router