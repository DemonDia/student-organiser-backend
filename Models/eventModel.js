const mongoose = require("mongoose");
const eventSchema = mongoose.Schema({
    eventName: {
        type: String,
        required: [true, "Please add a name"],
    },
    tags: {
        type: Array,
        required: false
    },
    date: {
        type: Object,
        required: [true,"Please add a date"],
        // date object as follows: --> for filtering in the organiser
            // year
            // month
            // day
            // time

            // eg: {
            //     year:2022,
            //     month:11,
            //     day:1,
            //     time:"10:30"
            // }
    },
    isoDate:{
        type:Date,
        required:[true,"Please add a date"]
    }
});

module.exports = mongoose.model("Event", eventSchema);