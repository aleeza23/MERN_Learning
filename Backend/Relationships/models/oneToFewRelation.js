// HERE WE DIRECTLY WIRTE THE CHILD DOCUMENT(NOT THE ITS REFERENCE) IN PARENT DPCUMENT
const mongoose = require('mongoose');

const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/mongoRelations');
}

main().then((res) => {
    console.log("Connection Successful!");
}).catch((err) => {
    console.log(err);
})

//user schema => ONE TO FEW RELATION
const userSchema = new mongoose.Schema({
    username: String,

    addresses: [{
        _id: false, //if we dont want to give id to each address document 
        country: String,
        city: String
    }]
})

//user model/collection
const User = mongoose.model("User", userSchema)

//Insert doc
const addUser = async () => {
    let user1 = new User({
        username: "aleeza",
        addresses: [
            {
                country: "pak",
                city: "chakwal",
            },
        ]
    })
    user1.addresses.push({ country: "china", city: "hongkong" })
    let res = await user1.save()
    console.log(res);

}

addUser();


