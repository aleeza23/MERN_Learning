const express = require("express");
const app = express();
const ExpressError = require("./ExpressError.js")


//MIDDLESWARES
//always define using app.use
//middlewares always written at the top of routes

//logger middleware
app.use((req, res, next) => {
    console.log(req.method, req.hostname, req.path);
    next()
})

//middlesware for only specific path
app.use("/user", (req, res, next) => {
    console.log("am only for user");
    next()
})

//middleware for api token => to protect some route
// app.use("/api", (req, res, next) => {
//     let { token } = req.query;
//     if (token === "giveaccess") {
//         next()
//     }
//     res.send("ACCESS DENIED!")
// })

// ANOTHER way to define middlewares to pass with multiple selected routes
let checkToken = (req, res, next) => {
    let { token } = req.query;
    if (token === "giveaccess") {
        next()
    }
    throw new ExpressError(401, "ACCESS DENIED!")
}

//route
app.get("/", checkToken, (req, res) => {
    res.send("am root")
})
app.get("/err", (req, res) => {
    abc = abc
})
app.get("/api", checkToken, (req, res) => {
    res.send("data")
})

app.get("/user", checkToken, (req, res) => {
    res.send("am user page")
})

app.get("/admin", (req, res) => {
    throw new ExpressError(403, "ACCESS IS FORBIDDEN!")
})

//custom error handling
app.use((err, req, res, next) => {
    let { status = 500, message= 'Something went wrong!' } = err // SETTING DEFAULT STATUS & MESSAGE
    res.status(status).send(message)
    // console.log("ERROR");   
    // next(err) //to call next error handling middlewares
})

// app.use((err, req, res, next) => {
//     console.log("ERROR 2");
//     next(err)
// })

//404 => this will execute when no path matches
app.use((req, res) => {
    res.status(404).send("page not found!");
})

// to listen the all coming requests
app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});