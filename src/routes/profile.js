const express = require('express');
const { userAuth } = require("../middlewares/auth");
const { validateProfileData } = require('../utils/validation');

const profileRouter = express.Router();


// get user profile
profileRouter.get("/profile/view", userAuth, async(req,res) => {
   
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

// edit user profile
profileRouter.patch("/profile/edit", userAuth, async(req, res)=> {

    try {
        if(!validateProfileData(req)) {
           throw new Error("Invalid edit profile edit request");
        } else {
            const userDetails = req.user;
            console.log("before: ", userDetails);
           Object.keys(req.body).forEach((key) => (userDetails[key] = req.body[key]));
           console.log("after: ", userDetails);
           await userDetails.save();
            res.json({
                message: `${userDetails.firstName}, your profile updated successfully`
            });
        }
    } catch(error) {
        res.status(400).send("Something went wrong");
    }
});

// edit user profile
profileRouter.patch("/profile/password", userAuth, async(req, res)=> {

    try {
       
    } catch(error) {
        res.status(400).send("Something went wrong");
    }
});

module.exports = profileRouter;