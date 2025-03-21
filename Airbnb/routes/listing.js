const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js")


//INDEX ROUTE
router.get("/", WrapAsync(listingController.index))

//CREATE NEW LIST ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm)

//SHOW ROUTE
router.get("/:id", WrapAsync(listingController.showListing))

//CREATE ROUTE
router.post("/", validateListing, isLoggedIn, WrapAsync(listingController.createListing))

// EDIT LISTING ROUTE
router.get("/:id/edit", isLoggedIn, WrapAsync(listingController.renderEditForm))

//UPDATE ROUTE
router.put("/:id", validateListing, WrapAsync(listingController.updateListing))

//DELETE ROUTE
router.delete("/:id", isLoggedIn, WrapAsync(listingController.deleteListing))

module.exports = router