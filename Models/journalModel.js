const mongoose = require("mongoose");
const journalSchema = mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Please add a user"],
    },
    journalTitle: {
        type: String,
        required: [true, "Please add a title"],
    },
    journalContent: {
        type: String,
        required: [true, "Please add some content"],
    },
    moodRating: {
        type: Number,
        required: [true, "Please rate your mood"],
    },
    tags: {
        type: Array,
        required: false,
    },
    date: {
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
    isoDate: {
        type: Date,
        required: [true, "Please add a date"],
    },
});

module.exports = mongoose.model("Journal", journalSchema);