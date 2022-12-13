const mongoose = require("mongoose");
const taskSchema = mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Please add a user"],
    },
    taskName: {
        type: String,
        required: [true, "Please add task name"],
    },
    completed: {
        type: Boolean,
        required: [true, "Please add a status"],
    },
    tags: {
        type: Array,
        required: false,
    },
    addedDate: {
        type: Object,
        required: [true, "Please add a date"],
        // date object as follows: --> for filtering in the organiser
        // year
        // month
        // day
        // time

        // eg: {
        //     year:2022,
        //     month:11,
        //     day:1,
        //     hour:
        //     minute:
        // }
    },
    addedIsoDate: {
        type: Date,
        required: [true, "Please add a date"],
    },
});

module.exports = mongoose.model("Task", taskSchema);
