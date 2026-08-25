const validator = require("validator");

const ALLOWED_EDIT_FIELDS = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"];

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(firstName.length < 2 || firstName.length > 30){
        throw new Error("First name should be between 2 and 30 characters");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid email address");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
};

const validateLoginData = (req) => {
    const { emailId, password } = req.body;

    if(!emailId || !password){
        throw new Error("Email and password are required");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid email address");
    }
};

const validateEditProfileData = (req) => {
    const isEditAllowed = Object.keys(req.body).every((field) =>
        ALLOWED_EDIT_FIELDS.includes(field)
    );

    if(!Object.keys(req.body).length){
        throw new Error("No fields provided to update");
    }
    else if(!isEditAllowed){
        throw new Error("Invalid edit request: field not allowed to update");
    }
};

const validateChangePasswordData = (req) => {
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword){
        throw new Error("Old password and new password are required");
    }
    else if(!validator.isStrongPassword(newPassword)){
        throw new Error("New password is not strong enough");
    }
    else if(oldPassword === newPassword){
        throw new Error("New password must be different from the old password");
    }
};

const validateForgotPasswordData = (req) => {
    const { emailId } = req.body;

    if(!emailId || !validator.isEmail(emailId)){
        throw new Error("Invalid email address");
    }
};

const validateResetPasswordData = (req) => {
    const { token, newPassword } = req.body;

    if(!token || !newPassword){
        throw new Error("Token and new password are required");
    }
    else if(!validator.isStrongPassword(newPassword)){
        throw new Error("New password is not strong enough");
    }
};

module.exports = {
    validateSignupData,
    validateLoginData,
    validateEditProfileData,
    validateChangePasswordData,
    validateForgotPasswordData,
    validateResetPasswordData,
};
