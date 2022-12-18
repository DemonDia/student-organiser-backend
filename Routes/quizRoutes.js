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
const { protect } = require("../Middleware/authMiddleware");

router.get("/", getQuizzes);
router.get("/id/:quizId", protect, getQuizById);
router.get("/:userId", protect, getUserQuizzes);
router.post("/", protect, addQuiz);
router.put("/:quizId", protect, updateQuiz);
router.delete("/:quizId", protect, deleteQuiz);
module.exports = router;
