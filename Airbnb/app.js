const express = require("express")
const app = express()
const mongoose = require('mongoose');
const path = require("path")
var methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
const session = require("express-session")
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");

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


const sessionOptions = {
    secret: "mysecretsuperkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
app.use(session(sessionOptions))
app.use(flash())
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    next()
})

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)


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