const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        if (!["ignored", "interested"].includes(status)) {
            throw new Error("Status must be ignored or interested");
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            throw new Error("User not found");
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if (existingRequest) {
            throw new Error("A connection request already exists between these users");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        await connectionRequest.save();

        res.status(201).json({
            message: `${req.user.firstName} marked ${toUser.firstName} as ${status}`,
            data: connectionRequest,
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const status = req.params.status;
        if (!["accepted", "rejected"].includes(status)) {
            throw new Error("Status must be accepted or rejected");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: req.params.requestId,
            toUserId: req.user._id,
            status: "interested",
        });
        if (!connectionRequest) {
            throw new Error("Connection request not found");
        }

        connectionRequest.status = status;
        await connectionRequest.save();

        res.json({
            message: `Connection request ${status}`,
            data: connectionRequest,
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;
