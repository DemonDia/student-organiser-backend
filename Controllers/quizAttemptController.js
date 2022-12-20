// ========================quiz attempt schema========================
// userId --> belong to specific user
// quizName --> name of specific quiz --> taken from quiz template
// questions --> array of quiz questions --> taken from quiz template

// ========================question schema (inside quiz attempt snapshot)========================
// question --> string; what is the question? --> taken from quiz template
// correctAnswer --> string; correct answer for the qn --> taken from quiz template
// questionType --> Number --> taken from quiz template
    // 1 is open-ended
    // 2 is mcq
// options --> for MCQ (not in this release)
// explanation --> string; --> taken from quiz template
// userAnswer --> string; user's answer 

// ========================Create========================
// check if user is valid
// check if quiz is valid 
// check if userId of user matches the userId of quiz
// generating the questions in the snapshot
    // question, correctAnswer, questionType, explanation --> take from question from quiz template
    // userAnswer --> empty string as default
    // isMarked --> false as default
    // isCorrect --> false as default 
// attemptDate and isoDate --> current DateTime which snapshot is created (now)
// attemptStatus --> 1 as default (incomplete)
// noOfquestions --> number of questions inside --> default is length of question array
// quizScore --> number of questions marked "correct"
const addQuizAttempt = async(req, res)=>{
    // takes in --> userId and quizId (in body)

}

// ========================Read========================
// =============get all attempts on db=============
const getQuizAttempts = async(req, res)=>{

}

// =============get all user quiz attempts=============
// check if userId is valid
// check for quiz attempts with matching userId
const getUserQuizAttempts = async(req, res)=>{
    // takes in userId (in params)

}

// =============get quiz attempt by Id=============
// check if quizAttemptId is valid
const getQuizAttemptById = async(req, res)=>{
    // takes in quizAttemptId (in params)
    
}

// ========================Update========================
// check if quizAttemptId is valid
// check if userId is valid
// check if userId of quiz attempt and current user matches
// trigger autosave --> save everything (frontend handles this)
const updateQuizAttempt = async(req, res)=>{
    // takes in quizAttemptId (in params)
    // takes in userId (in body) 
    // takes in questions, attemptStatus, quizScore (in body)

}

// ========================Delete========================
// check if quizAttemptId is valid
// check if userId is valid
// check if userId of quiz attempt and current user matches
const deleteQuizAttempt = async(req, res)=>{
    // takes in quizAttemptId (in params)
    // takes in userId (in body)

}
module.exports = {
    addQuizAttempt,
    getQuizAttempts,
    getUserQuizAttempts,
    getQuizAttemptById,
    updateQuizAttempt,
    deleteQuizAttempt,
};