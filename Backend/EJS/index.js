const express = require("express")
const app = express()
const path = require("path")

// USING EJS
app.set("view engine", "ejs") // EXPRESS INTERNALLY REQUIRE EJS PACKAGE SO DON'T NEED TO REQUIRE IT AT TOP
app.set("views", path.join(__dirname, "/views")) //__dirname CONATIN CURRENT WORKING DIR PATH (MERN Learning/EJS & AFTER THIS LINKING => "/view" ) TO SET THAT EJS DIR WILL KEEP THE VIEWS FOLDER => IF CALL TO SERVER MAKE THROUGH ANY OTHER DIR LIKE MAIN 

//CREATING ROUTES
app.get("/", ((req, res) => {
    res.render("singlePost.ejs")
}))

app.get("/instagram/:user", ((req, res) => {
    const { user } = req.params
    const instaUsers = require("./Data.json") //ACCESS THE DATA FILE

    if (instaUsers[user]) {
        res.render("home.ejs", { user, data: instaUsers[user] }) //TO SEND FILE AS A RESPONSE
    } else {
        res.render("404.ejs", { user })
    }

    //TO SEND STRING + OBJ etc
    // res.send("This is root path")
}))

app.get("/random", ((req, res) => {
    //ASSUME DATA IS COMING FROM DATABASE & WE ARE SENDING TO EJS FILE TO RENDER IT
    let data = Math.floor(Math.random() * 10) + 1
    const numList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    res.render("randomNum.ejs", { data, numList })
}))


app.listen(8080, () => {
    console.log(`Server is running on port ${8080}`);
})