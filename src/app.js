console.log("starting a new project");
const connectDB = require("./config/database");
const { query } = require("express");
const express = require("express");
const bcrypt = require("bcrypt");
const { adminAuth } = require("./middlewares/auth");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");

app.use(express.json());

app.post("/signup", async(req, res) => {

    console.log(req.body);

    try {
        //validate user data
        validateSignUpData(req);

        //encrypt password
        const {password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        console.log("hashpassword", hashPassword);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPassword
        });
        
        const result = await user.save(); // return promise
        res.send("user added successfully");
    } catch(error) {
        res.status(401).send("Bad Request" + " " + error.toString());
    }
    
});

// get user by email
app.get("/user", async(req,res) => {
    
    const email = req.body.email;
    console.log("email", email);
    try {
        const userDetail = await User.findOne({email: email});
        console.log("userDetail: ", userDetail);

        if(userDetail) {
            res.status(200).send("User found");
        } else {
            res.status(404).send("User not found");
        }

    } catch(error) {
        res.status(400).send("Something went wrong");
    }
});

//get all the user from database
app.get("/feed", async(req, res) => {

    try {
        const users = await User.find({});
        res.status(200).send(users)
    } catch(error) {
        res.status(400).send("Something went wrong")
    }
});

// delete user
app.delete("/deleteUser", async(req,res) => {
    try {
        const userId = req.body.userId;
        const data = await User.findByIdAndDelete({_id: userId});
        res.status(200).send(data)
    } catch(error) {
        res.status(400).send("Something went wrong")
    }
});

// update user data
app.patch("/updateUser/:userId", async(req, res) => {
    const userId = req.param?.userId;
    const data = req.body;
    const ALLOWED_UPDATES = ["gender", "age"];
    console.log(Object.keys(data));
    const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
    console.log("isUpdateAllowed", isUpdateAllowed);
    try {
        if(isUpdateAllowed) {
            const updatedData = await User.findByIdAndUpdate({_id: userId}, data, {
                ReturnDocument: "before", 
                runValidators: true
            });
            console.log(updatedData);
            res.status(200).send("User updated sucessfully");
        } else {
            res.status(401).send("Update not allowed");
        }

    } catch(error) {
        res.status(400).send("Something went wrong")
    }
});

connectDB()
    .then( () => {
        console.log("connected to DB");
        app.listen(3001, ()=>{console.log("Server is listening on port number 3001");});
    })
    .catch(
        (error) => console.log(error)
    );

// //admin auth
// app.use("/admin", adminAuth, (req,res)=>{res.send("hello 2nd");});

// // request handler
// app.use("/test", (req,res, next) => {
//     console.log(req.query);
//    // res.send({name: "Bhumi"});
//     next();
// },
// (req, res)=>{
//     console.log("next called");
//    res.send("successfully calling next");
// }
// );

// app.use("/home/:id", (req,res) => {
//     console.log(req.params);
//     res.send("Welcome to Home");
// });

// app.use("/", (req,res) => {
//     res.send("Hello Bhumi");
// });

