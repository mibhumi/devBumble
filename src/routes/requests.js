const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const requestsRouter = express.Router();


requestsRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res) => {

    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type"
            });
        }

        // connection already exists
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });

        if(existingConnectionRequest) {
            return res.status(400).json({
                message: "Connection already exists"
            });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = connectionRequest.save();


        res.json({
            message: `${fromUserId} is ${status} in ${toUserId}`,
            data
        });
    } catch(error) {
        res.status(400).send("Something went wrong");
    }

});

requestsRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {

    try {
        const user = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;
        const allowedStatus = ["accepted", "rejected"];

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            })
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: user._id,
            status: "interested"
        });

        if(!connectionRequest) {
            return res.status(400).json({
                message: "Request not found"
            });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
    } catch(error) {
        res.status(400).send("Something went wrong");
    }

});

module.exports = requestsRouter;