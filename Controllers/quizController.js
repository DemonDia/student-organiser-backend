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
// there must be at least 1 question (frontend handles this)
// done
const addQuiz = async (req, res) => {
    const userId = req.body.userId;
    if (userId.length != 24) {
        res.send({
            success: false,
            message: "User does not exist",
        });
    } else {
        const getUser = await User.findOne({ _id: userId });
        if (!getUser) {
            res.send({
                success: false,
                message: "User does not exist",
            });
        } else {
            const { quizName, questions } = req.body;
            const newQuiz = new Quiz({
                userId,
                quizName,
                questions,
            });

            if (quizName.length > 20) {
                res.send({
                    success: false,
                    message: "Quiz name cannot exceed 30 characters",
                });
            } else {
                await Quiz.create(newQuiz)
                    .then((result) => {
                        res.send({
                            success: true,
                            message: "Quiz entry added",
                            data: newQuiz._id,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send({
                            success: false,
                            message: err,
                        });
                    });
            }
        }
    }
};

// ========================Read========================
// =============get all quizzes on db=============
// done
const getQuizzes = async (req, res) => {
    await Quiz.find()
        .then((result) => {
            res.send({
                success: true,
                data: result,
            });
        })
        .catch((err) => {
            console.log(err);
            res.send({
                success: false,
                message: err,
            });
        });
};

// =============get all user quizzes=============
// check if userId is valid
// check for quizzes with matching userId
// done
const getUserQuizzes = async (req, res) => {
    userId = req.params.userId;
    if (userId.length != 24) {
        res.send({
            success: false,
            message: "User does not exist",
        });
    } else {
        const getUser = await User.findOne({ _id: userId });
        if (!getUser) {
            res.send({
                success: false,
                message: "User does not exist",
            });
        } else {
            await Quiz.find({ userId: userId })
                .then((result) => {
                    res.send({
                        success: true,
                        data: result,
                    });
                })
                .catch((err) => {
                    res.send({
                        success: false,
                        message: err,
                    });
                });
        }
    }
};

// =============get quiz by Id=============
// check if quizId is valid
// done
const getQuizById = async (req, res) => {
    const { quizId } = req.params;
    if (quizId.length != 24) {
        res.send({
            success: false,
            message: "Quiz is not found",
        });
    } else {
        await Quiz.findById(quizId)
            .then((result) => {
                if (!result) {
                    res.send({
                        success: false,
                        message: "Quiz is not found",
                    });
                } else {
                    res.send({
                        success: true,
                        data: result,
                    });
                }
            })
            .catch((err) => {
                res.send({
                    success: false,
                    message: err,
                });
            });
    }
};

// ========================Update========================
// =============update quiz=============
// check if quizId is valid
// check if userId is valid
// check if userId of quiz and current user matches
// quiz name cannot exceed 30 characters
// there must be at least 1 question (frontend handles this)
// done
const updateQuiz = async (req, res) => {
    const { userId, quizName, questions } = req.body;
    const { quizId } = req.params;
    if (quizId.length != 24) {
        res.send({
            success: false,
            message: "Quiz does not exist",
        });
    } else {
        await Quiz.findById(quizId).then(async (result) => {
            if (!result) {
                res.send({
                    success: false,
                    message: "Quiz does not exist!",
                });
            } else {
                if (result.userId != userId) {
                    res.send({
                        success: false,
                        message: "User does not have that quiz",
                    });
                } else {
                    if (quizName.length > 20) {
                        res.send({
                            success: false,
                            message: "Quiz name cannot exceed 30 characters",
                        });
                    } else {
                        Quiz.updateOne(
                            { _id: result._id },
                            {
                                quizName,
                                questions,
                            }
                        )
                            .then((result) => {
                                res.send({
                                    success: true,
                                    message: "Quiz updated",
                                });
                            })
                            .catch((err) => {
                                res.send({
                                    success: false,
                                    message: err,
                                });
                            });
                    }
                }
            }
        });
    }
};

// ========================Delete========================
// =============delete quiz=============
// check if quizId is valid
// check if userId is valid
// check if userId of quiz and current user matches
const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { userId } = req.body;
    if (quizId.length != 24) {
        res.send({
            success: false,
            message: "Quiz does not exist!",
        });
    } else {
        await Quiz.findById(quizId).then((result) => {
            if (!result) {
                res.send({
                    success: false,
                    message: "Quiz does not exist!",
                });
            } else {
                if (result.userId != userId) {
                    res.send({
                        success: false,
                        message: "User does not have that quiz",
                    });
                } else {
                    Quiz.deleteOne(result)
                        .then((deleteResult) => {
                            res.send({
                                success: true,
                                message: "Quiz deleted",
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.send({
                                success: false,
                                message: err,
                            });
                        });
                }
            }
        });
    }
};

module.exports = {
    addQuiz,
    getQuizzes,
    getUserQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
};
