const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestsRouter = express.Router();


requestsRouter.post("/sendConnectionRequest", userAuth, async(req, user) => {

    try {
        const user = req.user;
        res.send(user.firstName + " sent a connection request");
    } catch(error) {
        res.status(400).send("Something went wrong");
    }

});

module.exports = requestsRouter;