const express = require("express");
const app = express();
const path = require("path")
const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');
const methodOverride = require('method-override')
const { uuid } = require('uuidv4');
const { log } = require("console");

//SET VIEWS
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.use(methodOverride('_method'))

//TO PARSE COMING DATA FROM FORM
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//CONNECT DATABASE WITH SERVER
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'record',
    // password: 'Your SQL password here',
});

//INSERTING DATA WITH PLACEHOLDER TO PASS VALUES DYNAMICALLY
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let users = [
//     ["01b", "aleeza_02", "aleeza45@gmail.com", "ab45@*.._"],
//     ["01c", "aleeza_03", "aleeza67@gmail.com", "ab667..*)"]
// ];

// try {
//     connection.query(q, [users], (err, result) => {
//         if (err) throw err;
//         console.log(result);

//     })
// } catch (err) {
//     console.log(err);
// }

// connection.end()


//FAKE USERS DATA GENERATOR
const createRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ]
}

//ADDING 100 USERS DATA USING FAKER IN MYSQL DB
// let data = []
// for(let i=1; i<=100; i++){
//    data.push(createRandomUser())    
// }

// //QUERY
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// try {
//     connection.query(q, [data], (err, result) => {
//         if (err) throw err;
//         console.log(result);
//     })
// } catch (err) {
//     console.log(err);
// }

// connection.end()

//ROUTING

//HOME ROUTE -> GET THE COUNT OF ALL USERS FROM DB
app.get("/", (req, res) => {
    let q = `SELECT COUNT(*) FROM user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["COUNT(*)"]
            res.render("home.ejs", { count })
        })
    } catch (err) {
        console.log(err);
        res.send("Error in DB.")
    }
})


//USERS ROUTE -> GET THE ALL USERS DATA FROM DB
app.get("/user", (req, res) => {
    let q = `SELECT * FROM user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            res.render("users.ejs", { users: result })
        })
    } catch (err) {
        console.log(err);
        res.send("Error in DB.")
    }
})

//EDIT USER ROUTE -> GET REQUEST TO RENDER EDIT FORM
app.get("/user/:id/edit", (req, res) => {
    const { id } = req.params
    let q = `SELECT * FROM user WHERE id="${id}"`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0]
            res.render("edit.ejs", { user, errorMessage : "" })
        })
    } catch (err) {
        console.log(err);
        res.send("Error in DB.")
    }
})

//UPDATE USER -> PATCH  REQUEST TO UPDATE USER IN DB
app.patch("/user/:id", (req, res) => {
    const { id } = req.params;
    const { username: newUsername, password: formPass } = req.body
    let q = `SELECT * FROM user WHERE id="${id}"`

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0]
            if (formPass != user.password) {
                res.render("edit.ejs", {user, errorMessage : "Entered wrong password."})
            } else {
                // WRITE A QUERY TO UPDATE USERNAME IN DB
                let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/user")
                })
            }
        })
    } catch (err) {
        console.log(err);
        res.send("Error in DB.")
    }
})


//ADD USER FORM
app.get("/user/add", (req, res) => {
    res.render("adduser.ejs")
})


//POST REQUEST TO ADD USER TO DB
app.post("/user", (req, res) => {
    const id = uuid()
    const { email, username, password } = req.body;
    let userInfo = [id, username, email, password];

    //QUERY TO ADD USER IN DB
    let q = `INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)`;
    try {
        connection.query(q, userInfo, (err, result) => {
            if (err) throw err;
            res.redirect("/user")
        })
    } catch (err) {
        res.send("Some error in adding user.");
    }
})


//DELETE REQUEST TO DEL USER
app.get("/user/:id/delete", (req, res) => {
    const { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0]
            res.render("deleteUser.ejs", { user, errorMessage : "" })
        })
    } catch (err) {
        console.log(err);
        res.send("Error in DB.")
    }
})


//DELETE REQUEST TO DEL USER
app.delete("/user/:id", (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body
    //QUERY TO SELECT USER WITH SPECIFIC ID
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0]
            if (user.email != email && user.password != password) {
                res.render("deleteUser.ejs", {user, errorMessage : "Incorrect email or password."})
            } else {
                // QUERY FOR DELETE
                let q2 = `DELETE FROM user WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/user")
                })
            }
        })
    } catch (err) {
        console.log(err);
        res.send("Error in DB.")
    }
})


app.listen("8080", () => {
    console.log("App is running on port 8080");
})