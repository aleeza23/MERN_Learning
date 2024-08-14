const express = require("express")
const app = express()
const path = require("path")
const instaUsers = require("./Data.json") //ACCESS THE DATA FILE
const { uuid } = require('uuidv4');
var methodOverride = require('method-override')


// USING EJS
app.set("view engine", "ejs") // EXPRESS INTERNALLY REQUIRE EJS PACKAGE SO DON'T NEED TO REQUIRE IT AT TOP
app.set("views", path.join(__dirname, "/views")) //__dirname CONATIN CURRENT WORKING DIR PATH (MERN Learning/EJS & AFTER THIS LINKING => "/view" ) TO SET THAT EJS DIR WILL KEEP THE VIEWS FOLDER => IF CALL TO SERVER MAKE THROUGH ANY OTHER DIR LIKE MAIN 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// override with POST having ?_method=PUT
app.use(methodOverride('_method'))

//CREATING ROUTES

// DISPLAY UERS PROFILE
app.get("/instagram/:user", ((req, res) => {
    const { user } = req.params

    if (instaUsers[user]) {
        res.render("home.ejs", { user, data: instaUsers[user] }) //TO SEND FILE AS A RESPONSE
    } else {
        res.render("404.ejs", { user })
    }

    //TO SEND STRING + OBJ etc
    // res.send("This is root path")
}))

//******************ROUTES FOR POSTS******************

// FORM ROUTE TO ADD NEW POST
app.get("/posts/new/:user", ((req, res) => { 
    let { user } = req.params
    
    res.render("newPost.ejs", {user})
}))

// SUBMIT NEW POST ROUTE
app.post("/posts/:user", ((req, res) => {
    let { user } = req.params
    let { image, content } = req.body
    const likes = 1000
    const comments = 50
    const id = uuid()
    let allPosts = instaUsers[user]
    allPosts.posts.push({ id, image, content, likes, comments })
    // console.log(allPosts);

    res.redirect(`/instagram/${user}`)
}))

// OPEN SINGLE POST
app.get("/posts/:user/:id", ((req, res) => { 
    const { id, user } = req.params
    let allPosts = instaUsers[user]
    let singlePost = allPosts.posts.find((p) => id === p.id)

    res.render("singlePost.ejs", { singlePost, allPosts, user })
}))

// EDIT POST ROUTE
app.put("/posts/:user/:id/edit", ((req, res) => {
    let { id, user } = req.params
    let newContent = req.body.content;
    let allPosts = instaUsers[user]

    let singlePost = allPosts.posts.find((p) => id === p.id)
    singlePost.content = newContent
    // console.log(singlePost);

    res.redirect(`/posts/${user}/${id}`)
}))
// ********************

// DICE ROLL PRACTICE
app.get("/random", ((req, res) => {
    //ASSUME DATA IS COMING FROM DATABASE & WE ARE SENDING TO EJS FILE TO RENDER IT
    let data = Math.floor(Math.random() * 10) + 1
    const numList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    res.render("randomNum.ejs", { data, numList })
}))


app.listen(8080, () => {
    console.log(`Server is running on port ${8080}`);
})