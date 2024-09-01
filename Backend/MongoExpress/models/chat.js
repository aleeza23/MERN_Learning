const mongoose = require('mongoose');

//CREATE SCHEMA
const chatSchema = new mongoose.Schema({
    from : {
        type : String ,
        required : true
    },
    to : {
        type : String,
        required : true
    },
    msg : {
        type : String,
        maxLength : 100
    },
    created_at : {
        type : Date,
        required : true
    }
})

//CREATE MODEL
const Chat = mongoose.model("Chat", chatSchema)

module.exports = Chat