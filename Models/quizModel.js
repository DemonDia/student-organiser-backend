const mongoose = require("mongoose");
const quizSchema = mongoose.Schema({
    userId:{
        type: String,
        required: [true, "Please add a user"],
    },
    quizName:{
        type: String,
        required: [true, "Please add a quiz name"],
    },
    questions:{
        type:Array,
        required:[true,"Please add some questions"]
    }
})
module.exports = mongoose.model("Quiz", quizSchema);