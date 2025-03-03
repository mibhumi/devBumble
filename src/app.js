const connectDB = require("./config/database");
const { query } = require("express");
const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("./middlewares/auth");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require('dotenv').config(); 

app.use(express.json());

app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);


// get user by email
app.get("/user", async(req,res) => {
    
    const email = req.body.email;
    try {
        const userDetail = await User.findOne({email: email});

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
app.get("/feed", userAuth, async(req, res) => {

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
    const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
    try {
        if(isUpdateAllowed) {
            const updatedData = await User.findByIdAndUpdate({_id: userId}, data, {
                ReturnDocument: "before", 
                runValidators: true
            });
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
        app.listen(3001, ()=>{console.log("Server is listening on port number 3001");});
    })
    .catch(
        (error) => console.log(error)
    );
