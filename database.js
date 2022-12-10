const mongoose = require("mongoose");
require("dotenv").config();

async function connect() {
    database_uri = process.env.DATABASE_URI;
    // console.log(database_uri)

    try {
        await mongoose.connect(database_uri);
        console.log("Connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {connect}