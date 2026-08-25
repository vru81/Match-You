const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {
    validateEditProfileData,
    validateChangePasswordData,
} = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validateEditProfileData(req);

        const user = req.user;
        Object.keys(req.body).forEach((field) => (user[field] = req.body[field]));
        await user.save();

        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        validateChangePasswordData(req);
        const { oldPassword, newPassword } = req.body;
        const user = req.user;

        const isPasswordValid = await user.validatePassword(oldPassword);
        if (!isPasswordValid) {
            throw new Error("Old password is incorrect");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.send("Password updated successfully");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = profileRouter;
