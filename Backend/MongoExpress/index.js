const express = require("express")
const app = express()
const mongoose = require('mongoose');
const path = require("path")
var methodOverride = require('method-override')
const Chat = require("./models/chat")

//SETUP MONGOOSE
const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatapp');
}
main().then((res) => {
    console.log("Connection Successful!");
}).catch((err) => {
    console.log(err);
})


// STATIC FILES FROM 'PUBLIC' DIRECTORY
app.use(express.static(path.join(__dirname, 'public')));

// USING EJS
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// override with POST having ?_method=PUT
app.use(methodOverride('_method'))


//ROUTING
app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    res.render("index.ejs", { chats })
})

//NEW CHAT
app.get("/chats/new", (req, res) => {
    res.render("addChat.ejs")
})

//POST NEW CHATS
app.post("/chats", (req, res) => {
    const { from, to, msg } = req.body;
    const newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
    })

    newChat.save().then((res) => {
        console.log("Chat Saved!");
    }).catch((err) => {
        console.log(err);
    })

    res.redirect("/chats")
})

//EDIT ROUTE
app.get("/chats/:id/edit", async (req, res) => {
    const { id } = req.params;
    let chat = await Chat.findById(id)
    res.render("edit.ejs", { chat })
})

//UPDATE ROUTE
app.put("/chats/:id", async (req, res) => {
    const { id } = req.params;
    const { msg: updateMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id, { msg: updateMsg }, { runValidators: true, new: true })
    res.redirect("/chats")
})

//DESTROY ROUTE
app.delete("/chats/:id", async (req, res) => {
    const { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id)
    res.redirect("/chats")
})



app.listen("8080", () => {
    console.log("Server is running on port 8080");
})