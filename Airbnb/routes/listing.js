const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync");
const { isLoggedIn, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

router.route("/")
    .get(WrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, WrapAsync(listingController.createListing))

//CREATE NEW LIST ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/:id")
    .get(WrapAsync(listingController.showListing))
    .put(upload.single("listing[image]"), validateListing, WrapAsync(listingController.updateListing))
    .delete(isLoggedIn, WrapAsync(listingController.deleteListing))


// EDIT LISTING ROUTE
router.get("/:id/edit", isLoggedIn, WrapAsync(listingController.renderEditForm))

module.exports = router