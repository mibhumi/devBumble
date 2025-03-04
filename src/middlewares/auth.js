const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config(); 

//authenticate user
const userAuth = async(req, res, next) => {

    try {
        const {token} = req.cookies;
        const decodedToken = await jwt.verify(token, process.env.SECRET, {expiresIn: "1d"});
        const {_id} = decodedToken;
        const user = await User.findById(_id);

        if(!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch(error) {
        res.status(400).send("Something went wrong on auth");
    }

};

module.exports = { 
    userAuth,
};