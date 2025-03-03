const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async(req, res) => {


    try {
        //validate user data
        validateSignUpData(req);

        //encrypt password
        const {password, firstName, lastName, email} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

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

authRouter.post("/login", async(req,res) => {

    try {
        const {password, email} = req.body;
        const user = await User.findOne({email: email});

        if(user) {
            const isPasswordValid = await user.validatePassword(password);
            if(isPasswordValid) {
                // set JWT token
                const token = await user.getJWT();
                res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});
                res.send("Login successful");
            } else {
                throw new Error("Invalid credential");
            }
        } else {
            throw new Error("Invalid credentials");
        }

    } catch(error) {
        res.status(400).send("Something went wrong");
    }
});

module.exports = authRouter;