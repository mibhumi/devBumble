const express = require('express');
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();


// get user profile
profileRouter.get("/profile", userAuth, async(req,res) => {
   
    const cookies = req.cookies;
    const {token} = cookies;

    // decode token
    try{
        const user = req.user;
        res.send(user.firstName);
    } catch(error) {
        res.status(400).send("Something went wrong");
    }
    
});

module.exports = profileRouter;