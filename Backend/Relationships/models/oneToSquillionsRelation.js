// oneToSquillions.js
// HERE WE STORE THE REFERENCE OF PARENT IN CHILD DPCUMENT
const mongoose = require('mongoose');

const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/mongoRelations');
}

main().then((res) => {
    console.log("Connection Successful!");
}).catch((err) => {
    console.log(err);
})

const userSchema = new mongoose.Schema({
    username: String,
    email: String
})

const User = mongoose.model("User", userSchema)

//order schema => ONE TO MANY RELATION
const postSchema = new mongoose.Schema({
    content: String,
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})
const Post = mongoose.model("Post", postSchema)


const addData = async () => {
    let newUser = new User({
        username : "aneela",
        email : "aneela@gmail.com"
    }) 

    let newPost = new Post({
        content : "hey this is new post",
        like : 8
    })

    newPost.user = newUser

    await newUser.save()
    await newPost.save()

}

addData()