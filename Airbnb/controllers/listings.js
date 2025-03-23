// ASYNC CALLBACKS OF ALL LISTING ROUTES
const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const response = await Listing.find()
    res.render("listings/index.ejs", { response })
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")

    if (!listing) {
        req.flash("error", "Listing does not exist!")
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    let { listing } = req.body;
    const newListing = new Listing(listing)
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    await newListing.save()

    req.flash("success", "New Listing Created!")
    res.redirect("/listings")
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)

    if (!listing) {
        req.flash("error", "Listing does not exist!")
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing })
}

module.exports.updateListing = async (req, res) => {

    let { id } = req.params;
    let { listing } = req.body;
    const updated = await Listing.findByIdAndUpdate(id, { ...listing }, { runValidators: true, new: true });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updated.image = { url, filename }
        await updated.save()
    }


    req.flash("success", "Listing Updated Successfully!")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id)

    req.flash("success", "Listing Deleted Successfully!")
    res.redirect("/listings")
}