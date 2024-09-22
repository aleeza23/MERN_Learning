const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing')

//SETUP MONGOOSE
const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then((res) => {
    console.log("Connected to DB!");
}).catch((err) => {
    console.log(err);
})

const initDB = async () => {
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data)
    console.log("Data was added! ");
}
initDB();
