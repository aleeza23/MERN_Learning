//SETUP MONGOOSE
const mongoose = require('mongoose');
const Chat = require("./models/chat")

const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatapp');
}

main().then((res) => {
    console.log("Connection Successful!");
}).catch((err) => {
    console.log(err);
})

//SAMPLE CHATS
const sampleChats = [
    {
        from: "Alex Johnson",
        to: "Emily Davis",
        msg: "Hi Emily, How have you been? I haven't heard from you in a while.",
        created_at: new Date()
    },
    {
        from: "Sarah Lee",
        to: "John Smith",
        msg: "Hello John, Just checking in on our meeting schedule for next week.",
        created_at: new Date()
    },
    {
        from: "Michael Brown",
        to: "Lisa Clark",
        msg: "Hi Lisa, Could you please send me the report by end of the day?",
        created_at: new Date()
    },
    {
        from: "Jessica Martinez",
        to: "David Wilson",
        msg: "Hey David, I'm running late for our coffee catch-up. See you soon!",
        created_at: new Date()
    },
    {
        from: "Chris Evans",
        to: "Sandra Roberts",
        msg: "Hello Sandra, Thanks for the update. I will review it and get back to you shortly.",
        created_at: new Date()
    },
    {
        from: "Morgan Taylor",
        to: "Jessica Brown",
        msg: "Hi Jessica, Could you please confirm the time for tomorrow's meeting?",
        created_at: new Date()
    },
    {
        from: "Jordan Scott",
        to: "Patricia Adams",
        msg: "Hello Patricia, I have attached the file you requested. Let me know if you need anything else.",
        created_at: new Date()
    },
    {
        from: "Taylor White",
        to: "Robert Green",
        msg: "Hi Robert, I wanted to discuss the project timeline. Are you available for a call?",
        created_at: new Date()
    },
    {
        from: "Avery Thompson",
        to: "Olivia King",
        msg: "Hello Olivia,Just wanted to remind you about the upcoming deadline for the assignment.",
        created_at: new Date()
    }
];


//INSERT DOCUMENT IN CHAT COLLECTION
Chat.insertMany(sampleChats)

