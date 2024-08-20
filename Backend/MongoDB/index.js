const mongoose = require('mongoose');

const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

main().then((res) => {
    console.log("Connection Successful!");
}).catch((err) => {
    console.log(err);
})

//CREATE SCHEMA FOR USER COLLECTION MEANS DOCUMENT STRUCTURE FOR USER COLLECTION
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    age: Number
})

//MODEL IS A CLASS WHICH IS USED TO CONTRUCT THE DOCUMENT -> IN MODEL TWO PARAMETERS ARE PASSED ONE IS COLLECTION NAME THAT IS (USER) HERE AND OTHER IS DOCUMENT STRUCTURE IN THAT COLLECTION
//MODEL IS ACTUALLY A CLASS AND MODEL NAME CAN BE SAME AS COLLECTION NAME (USER) 
const User = mongoose.model("User", userSchema)


//GET ALL DOCUMENTS
User.find({age : 20}).then((res) => {
    console.log(res[0].name);
}).catch((err) => {
    console.log(err);
})


//FIND ONE DOCUMENTS
User.find({age : 20}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
})


//FIND BY ID
User.findById("66c4e9a95eb238098658bcc5").then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
})


//INSERT MANY DOCUMENTS
User.insertMany([
    { name: "aleeza", username: "aleeza_78", email: "rubab65@gmail.com", age: "20" },
    { name: "rubab", username: "ruabab", email: "rubab65@gmail.com", age: "20" },
    { name: "arooj", username: "arooj_87", email: "rubab65@gmail.com", age: "20" },
]).then((res) => {
    console.log(res);
})


//CREATE AN OBJECT OF MODEL CLASS AND INSERT A SINGLE DOCUMENTS IN USER COLLECTION
const user2 = new User({
    name: "rubab",
    username: "rubab_98",
    email: "rubab65@gmail.com",
    age: 20
});


//TO SAVE SINGLE DOCUMENT IN DB
user2.save().then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
})