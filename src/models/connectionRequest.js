const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignore", "interested", "accepeted", "rejected"],
            message: `{VALUE} not a valid status `
        }
    }
},{
    timestamps: true
});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", function() {
    const connectionRequest = this;

    // check from and to user ID is same
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
        throw new Error("You can not send request to yourself");
    }
    next();
});

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;