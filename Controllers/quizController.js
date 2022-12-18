const User = require("../Models/userModel");
const Quiz = require("../Models/quizModel");
// ========================quiz schema========================
// userId --> belong to specific user
// quizName --> name of specific quiz (max 30 char)
// questions --> array of quiz questions

// ========================question schema (inside quiz)========================
// question --> string; what is the question? (max 130 char)
// correctAnswer --> string; correct answer for the qn
// questionType --> Number
// 1 is open-ended
// 2 is mcq
// options --> for MCQ (not in this release)
// explantion --> string; ( max 360 char)

// ========================Create========================
// check if userId is valid
// quiz name cannot exceed 30 characters
// there must be at least 1 question
const addQuiz = async (req, res) => {};

// ========================Read========================
// =============get all quizzes on db=============
const getQuizzes = async (req, res) => {};

// =============get all user quizzes=============
// check if userId is valid
// check for quizzes with matching userId
const getUserQuizzes = async (req, res) => {};

// =============get quiz by Id=============
// check if quizId is valid
// check if userId is valid
// check if userId of quiz and current user matches
const getQuizById = async (req, res) => {};

// ========================Update========================
// =============update quiz=============
// check if quizId is valid
// check if userId is valid
// check if userId of quiz and current user matches
// quiz name cannot exceed 30 characters
// there must be at least 1 question
const updateQuiz = async (req, res) => {};

// ========================Delete========================
// =============delete quiz=============
// check if quizId is valid
// check if userId is valid
// check if userId of quiz and current user matches
const deleteQuiz = async (req, res) => {};

module.exports = {
    addQuiz,
    getQuizzes,
    getUserQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
};
