require('dotenv').config(); 

const mongoose = require("mongoose");
const connectionString = process.env.DATABASE_URL;

const connectDB = async() => {
    await mongoose.connect(connectionString);
}

module.exports = connectDB;