const mongoose = require('mongoose');

const main = async () => {
    await mongoose.connect('Your connection string here');
}

main().then((res) => {
    console.log("Connection Successful!");
}).catch((err) => {
    console.log(err);
})

//SCHEMA VALIDATION
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true //VALIDATION OPTIONS
    },
    author: {
        type: String,
    },
    price: {
        type: Number,
        min: 1
    },
    discount: {
        type: Number,
        default: 10 //VALIDATION OPTIONS
    },
    category: {
        type: String,
        enum: ["fiction", "non-fiction"] //SCHEMA VALIDATION OPTIONS
    },
    genre: [String] //CAN STORE STRINGS IN ARRAY 
})

const Book = mongoose.model("Book", bookSchema)

//SCHEMA VALIDATION USING UPDATE
Book.findByIdAndUpdate('66ca1ddca2c6cfb0b5f9e3d0', { price: -500 }, { runValidators: true }).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
})

const book1 = new Book({
    title: "book-one",
    author: "aleeza rubab",
    price: "10",
    // category : "comics" // WILL THROW AN ERROR BCZ COMICS IS NOT IN ENUM CATEGORY
    category: "fiction", // WILL NOT THROW ANY ERROR
    genre: ['fiction', 'non-fiction']
})


book1.save().then((res) => {
    console.log(res);
}).catch((err) => { console.log(err) })