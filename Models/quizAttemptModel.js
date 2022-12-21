const mongoose = require("mongoose");
const quizAttemptSchema = mongoose.Schema({
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
        // QuestionObject:
            // question --> taken from Question template (readonly)
            // UserAnswer --> blank by default; user has to fill it themselves
            // Explanation --> explanation of how to get the answer (readonly) 
                // displayed in statuses 2 or 3 (marking or marked
            // isCorrect --> by default its false 
            // isMarked --> by default its false 
            // correctAnswer --> correct answer for the question
            // questionType --> type of question (not in this release; in case its developed further)
    },
    // attemptDate:{
    //     type:Object,
    //     required:[true,"Please add a date"]
    //     // date object as follows: --> for filtering in the organiser
    //     // year
    //     // month
    //     // day
    //     // time

    //     // eg: {
    //     //     year:2022,
    //     //     month:11,
    //     //     day:1,
    //     //     hour:
    //     //     minute:
    //     // }
    // },
    isoDate:{
        type:Date,
        required:[true,"Please add a date"]
    },
    attemptStatus:{
        type:Number,
        required:[true,"Please add a status"]
        // 1 --> in progress
        // 2 --> marking
        // 3 --> marked (readonly)
    },
    noOfQuestions:{
        type:Number,
        required:[true,"Please include the number of questions"]
    },
    quizScore:{
        type:Number,
        required:[true,"Please add a score number"]
        // -1 --> incomplete/marking in progress
        // 0 to noOfQuetions --> complete
    }
})
module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);