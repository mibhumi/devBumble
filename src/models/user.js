const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 12
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "others"].includes(value)) {
                throw new error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
    },
    about: {
        type: String
    },
    skills: {
        type: [String]
    }
},
{
    timestamps: true
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;