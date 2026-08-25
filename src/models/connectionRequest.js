const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["ignored", "interested", "accepted", "rejected"],
            required: true,
        },
    },
    { timestamps: true }
);

connectionRequestSchema.index(
    { fromUserId: 1, toUserId: 1 },
    { unique: true }
);

connectionRequestSchema.pre("validate", function () {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("You cannot send a connection request to yourself");
    }
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
