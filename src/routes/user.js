const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();
const USER_SAFE_FIELDS = "firstName lastName age gender photoUrl about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const requests = await ConnectionRequest.find({
            toUserId: req.user._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_FIELDS);

        res.json({ data: requests });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const requests = await ConnectionRequest.find({
            $or: [
                { fromUserId: req.user._id, status: "accepted" },
                { toUserId: req.user._id, status: "accepted" },
            ],
        })
            .populate("fromUserId", USER_SAFE_FIELDS)
            .populate("toUserId", USER_SAFE_FIELDS);

        const connections = requests.map((request) =>
            request.fromUserId._id.equals(req.user._id)
                ? request.toUserId
                : request.fromUserId
        );

        res.json({ data: connections });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(
            Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
            50
        );
        const skip = (page - 1) * limit;

        const requests = await ConnectionRequest.find({
            $or: [
                { fromUserId: req.user._id },
                { toUserId: req.user._id },
            ],
        }).select("fromUserId toUserId");

        const hiddenUserIds = new Set([req.user._id.toString()]);
        requests.forEach((request) => {
            hiddenUserIds.add(request.fromUserId.toString());
            hiddenUserIds.add(request.toUserId.toString());
        });

        const users = await User.find({
            _id: { $nin: [...hiddenUserIds] },
        })
            .select(USER_SAFE_FIELDS)
            .skip(skip)
            .limit(limit);

        res.json({ data: users, page, limit });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = userRouter;