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
const { verifyToken } = require("../Middleware/authMiddleware");

// router.get("/", getQuizAttempts);
router.get("/id/:quizAttemptId", verifyToken, getQuizAttemptById);
router.get("/:userId", verifyToken, getUserQuizAttempts);
router.post("/", verifyToken, addQuizAttempt);
router.put("/:quizAttemptId", verifyToken, updateQuizAttempt);
router.delete("/:quizAttemptId", verifyToken, deleteQuizAttempt);
module.exports = router;