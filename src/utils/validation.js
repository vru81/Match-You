const validator = require("validator");

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

module.exports = { validateSignupData };
