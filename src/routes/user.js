const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl";

userRouter.get("/user/requests/received", userAuth, async(req, res) => {

    try {
        const user = req.user;

        const connectionRequest = ConnectionRequest.find({
            status: "interested",
            toUserId: user._id
        }).populate("fromUserId", USER_SAFE_DATA);
        // }).populate("fromUserId", ["firstName", "lastName"]);

        res.json({
            message: "request found successfully",
            data: connectionRequest
        });

    } catch(error) {
        res.status(400).send("Something went wrong");
    }
});

userRouter.get("/user/connections", userAuth, async(req, res) => {

    try {
        const user = req.user;
        console.log("user", user);
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {toUserId: user._id, status: "accepted"},
                {fromUserId: user._id, status: "accepted"},
            ]
        })
       .populate("toUserId", USER_SAFE_DATA)
       .populate("fromUserId", USER_SAFE_DATA);
        console.log("connectionRequest", connectionRequest)

        const data = connectionRequest.map((d) => {
            if(d.fromUserId._id.toString() === user._id.toString()) {
                return d.toUserId;
            }
            return d.fromUserId;
        });

        console.log(data);

        res.json({
            message: "Connections found",
            data
        });
    } catch (error) {
        res.status(400).send("Something went wrong " + error);
    }
});

module.exports = userRouter;