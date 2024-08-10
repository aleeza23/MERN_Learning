// GETTING STARTED WITH EXPRESS JS
const express = require("express");
const app = express();


// routing => send response to specific kind of request [GET + POST]
// GET REQUESTS--------
app.get("/" , (req , res) => {
    res.send("You made get request on root path.")
})

// for search route
app.get("/search" , (req , res) => {
    res.send("You made get request on search path.")
})

// for help route 
app.get("/help" , (req , res) => {
    res.send("You made get request on help path.")
})

// dynamic route with variables => path to send request with variables http://localhost:3000/aleeza/123
app.get("/:username/:id" , (req , res) => {
    // console.log(req.params);
    let {username , id } = req.params
    res.send(`You made get request on root path with param ${username + id}`)
})

// dynamic route with query string => path to send query: http://localhost:3000/query?q=aleeza&uni=vu
app.get("/query" , (req , res) => {
    // console.log(req.query);
    let { q } = req.query
    res.send(`You made get request on query path with query ${q}`)
})

// for NOT Found route 
app.get("*" , (req , res) => {
    res.send("Wrong path.")
})


// POST REQUEST---------
app.post("/" , (req , res) => {
    res.send("You made a post request on root path")
})


// send response to any kind of request [GET + POST etc]
app.use((req , res) => {
    console.log("request recieved!");
    res.send({
        name : "aleeza",
        university : "VU"
    })
})  

// to listen the all coming requests
app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});