const validator = require("validator");

const validateSignUpData = (req) => {
    
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName) {
        throw new Error("Enter valid name");
    } else if(!validator.isEmail(email)) {
        throw new Error("Enter valid email");
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Enter strong password");
    }
}

const validateProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "age", "about", "photoUrl", "skills", "gender"];

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    console.log("isEditAllowed: ", isEditAllowed);
    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateProfileData
};