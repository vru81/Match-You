const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET, RESET_PASSWORD_TOKEN_EXPIRY } = require("../utils/constants");
const {
    validateSignupData,
    validateLoginData,
    validateForgotPasswordData,
    validateResetPasswordData,
} = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.send("User created successfully");
    } catch (err) {
        console.error(err);
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        validateLoginData(req);
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const token = await user.getJWT();
        res.cookie("token", token);
        res.send("Login successful");
    } catch (err) {
        console.error(err);
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.send("Logout successful");
});

authRouter.post("/forgotPassword", async (req, res) => {
    try {
        validateForgotPasswordData(req);
        const { emailId } = req.body;

        const user = await User.findOne({ emailId });
        if (user) {
            const resetToken = jwt.sign(
                { _id: user._id, purpose: "resetPassword" },
                JWT_SECRET,
                { expiresIn: RESET_PASSWORD_TOKEN_EXPIRY }
            );
            // TODO: send resetToken to the user's email once an email service is wired up
            console.log(`Password reset token for ${emailId}: ${resetToken}`);
        }

        // Respond the same way whether or not the email exists, to avoid user enumeration
        res.send("If an account with that email exists, a password reset link has been sent");
    } catch (err) {
        console.error(err);
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.patch("/resetPassword", async (req, res) => {
    try {
        validateResetPasswordData(req);
        const { token, newPassword } = req.body;

        let decodedMessage;
        try {
            decodedMessage = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            throw new Error("Invalid or expired reset token");
        }
        if (decodedMessage.purpose !== "resetPassword") {
            throw new Error("Invalid or expired reset token");
        }

        const user = await User.findById(decodedMessage._id);
        if (!user) {
            throw new Error("User not found");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.send("Password reset successful");
    } catch (err) {
        console.error(err);
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = authRouter;
