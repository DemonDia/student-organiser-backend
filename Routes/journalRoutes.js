const {
    getJournals,
    getJournalById,
    getUserJournals,
    getDayMonthYearUserJournals,
    addJournal,
    updateJournal,
    deleteJournal,
} = require("../Controllers/journalController");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/authMiddleware")

// router.get("/", getJournals);
router.get("/id/:journalId", verifyToken, getJournalById);
router.get("/:userId", verifyToken, getUserJournals);
router.get("/:year/:month/:day/:userId", verifyToken, getDayMonthYearUserJournals);
router.post("/", verifyToken, addJournal);
router.put("/:journalId", verifyToken, updateJournal);
router.delete("/:journalId", verifyToken, deleteJournal);
module.exports = router;