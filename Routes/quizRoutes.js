const {
    addQuiz,
    getQuizzes,
    getUserQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
} = require("../Controllers/quizController");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/authMiddleware");

// router.get("/", getQuizzes);
router.get("/id/:quizId", verifyToken, getQuizById);
router.get("/:userId", verifyToken, getUserQuizzes);
router.post("/", verifyToken, addQuiz);
router.put("/:quizId", verifyToken, updateQuiz);
router.delete("/:quizId", verifyToken, deleteQuiz);
module.exports = router;
