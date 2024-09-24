const express = require("express")
const app = express()
const mongoose = require('mongoose');
const path = require("path")
var methodOverride = require('method-override')
const Listing = require("./models/listing")
const ejsMate = require("ejs-mate")
const WrapAsync = require("./utils/WrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const listingSchema = require("./ServerSchemaValid.js")


//SETUP MONGOOSE
const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then((res) => {
    console.log("Connected to DB!");
}).catch((err) => {
    console.log(err);
})

// STATIC FILES FROM 'PUBLIC' DIRECTORY
app.use(express.static(path.join(__dirname, 'public')));

// USING EJS
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=PUT
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);

//MIDDLEWARE FOR VALIDATING LISTING SCHEMA
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body) //JOI WILL VALIDATE ALL THE REQUIRED INFO IS PRESENT TO STORE IN DB 
    if (error) {
        throw new ExpressError(400, error)
    } else {
        next()
    }
}


//INDEX ROUTE
app.get("/listings", WrapAsync(async (req, res) => {
    const response = await Listing.find()
    res.render("listings/index.ejs", { response })
}))

//CREATE NEW LIST ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

//SHOW ROUTE
app.get("/listings/:id", WrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
}))

//CREATE ROUTE
app.post("/listings", validateListing, WrapAsync(async (req, res, next) => {
    let { listing } = req.body
    const newListing = new Listing(listing)
    await newListing.save()
    res.redirect("/listings")
}))

// EDIT LISTING ROUTE
app.get("/listings/:id/edit", WrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
}))

//UPDATE ROUTE
app.put("/listings/:id", validateListing, WrapAsync(async (req, res) => {
    let { id } = req.params;
    let { listing } = req.body;
    const updated = await Listing.findByIdAndUpdate(id, { ...listing }, { runValidators: true, new: true });
    res.redirect(`/listings/${id}`)
}))

//DELETE ROUTE
app.delete("/listings/:id", WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))

//404
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})


//DEFINING MIDDLEWARE TO HANDLE ADDING INCORRECT INFO IN DB
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("error.ejs", { message })
    // res.status(status).send(message)
})


app.listen("8000", () => {
    console.log("Server running on port 8000");
})