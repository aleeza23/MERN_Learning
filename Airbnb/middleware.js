const Review = require("./models/reviews")
const { listingSchema } = require("./ServerSchemaValid")
const ExpressError = require("./utils/ExpressError")

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

//MIDDLEWARE FOR VALIDATING SCHEMAS
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body) //JOI WILL VALIDATE ALL THE REQUIRED INFO IS PRESENT TO STORE IN DB 
    if (error) {
        throw new ExpressError(400, error)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this review!")
        return res.redirect(`/listings/${id}`)
    }
    next()
}