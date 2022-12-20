const {
    addQuizAttempt,
    getQuizAttempts,
    getUserQuizAttempts,
    getQuizAttemptById,
    updateQuizAttempt,
    deleteQuizAttempt,
} = require("../Controllers/quizAttemptController")
const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");

router.get("/", getQuizAttempts);
router.get("/id/:quizAttemptId", protect, getQuizAttemptById);
router.get("/:userId", protect, getUserQuizAttempts);
router.post("/", protect, addQuizAttempt);
router.put("/:quizAttemptId", protect, updateQuizAttempt);
router.delete("/:quizAttemptId", protect, deleteQuizAttempt);
module.exports = router;