const express = require("express")
const app = express()
const mongoose = require('mongoose');
const path = require("path")
var methodOverride = require('method-override')
const Listing = require("./models/listing")
const ejsMate = require("ejs-mate")

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


//INDEX ROUTE
app.get("/listings", async (req, res) => {
    const response = await Listing.find()
    res.render("listings/index.ejs", { response })
})

//CREATE NEW LIST ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

//SHOW ROUTE
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
})

//CREATE ROUTE
app.post("/listings", async (req, res) => {
    let { listing } = req.body
    const newListing = new Listing(listing)
    await newListing.save()
    res.redirect("/listings")
})

// EDIT LISTING ROUTE
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
})

//UPDATE ROUTE
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let { listing } = req.body;    
    const updated = await Listing.findByIdAndUpdate(id, { ...listing }, { runValidators: true, new: true });
    res.redirect(`/listings/${id}`)
})

//DELETE ROUTE
app.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
})


app.listen("8000", () => {
    console.log("Server running on port 8000");
})





// app.get("/testListing", async (req, res) => {
//     const sampleListing = new Listing({
//         title: 'new home',
//         description: "hey this is your new home",
//         price: 20000,
//         location: "chakwal",
//         country: "pakistan"
//     })

//     //save into listing collection
//     await sampleListing.save()
//     console.log("sample ws saved");
//     res.send("success")
// })

