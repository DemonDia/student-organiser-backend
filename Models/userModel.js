const mongoose = require("mongoose");
const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
    },
    activated: {
        type: Boolean,
        required: [true],
    }
});

module.exports = mongoose.model("Event", eventSchema);