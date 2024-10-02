const mongoose = require('mongoose');

const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/mongoRelations');
}

main().then(() => {
    console.log("Connection Successful!");
}).catch((err) => {
    console.log(err);
})

// Order schema => ONE TO MANY RELATION
const orderSchema = new mongoose.Schema({
    item: String,
    price: Number,
})
const Order = mongoose.model("Order", orderSchema)

// Customer schema => ONE TO MANY RELATION
const customerSchema = new mongoose.Schema({
    name: String,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ]
})

// POST MIDDLEWARE TO DELETE CUSTOMER WITH ALL THE RELATED ORDERS FROM ORDER COLLECTION
customerSchema.post("findOneAndDelete", async (customer) => {
    if (customer.orders.length > 0) {
        await Order.deleteMany({ _id: { $in: customer.orders }})
    }
})

const Customer = mongoose.model("Customer", customerSchema)

const addCustomers = async () => {
    let cust1 = new Customer({
        name: "alyza",
    })

    // Extract that order obj to insert in customer collection
    let order1 = await Order.findOne({ item: "chips" })
    let order2 = await Order.findOne({ item: "samosa" })

    cust1.orders.push(order1)
    cust1.orders.push(order2)

    await cust1.save()
}

// addCustomers()

const findCustomer = async () => {
    // In orders it will show only object id, use populate to see complete details of orders
    let res = await Customer.find({}).populate("orders")
    console.log(res[0]);
}

// findCustomer()

const delCustomer = async () => {
    // Find and delete customer by ID
    let res = await Customer.findByIdAndDelete("66f847d41fc21695365e105d")
    console.log(res);
}
delCustomer()

// const addOrders = async () => {
//     await Order.insertMany([
//         { item: "samosa", price: 20 },
//         { item: "burger", price: 200 },
//         { item: "chips", price: 10 },
//     ])
// }

// addOrders()
