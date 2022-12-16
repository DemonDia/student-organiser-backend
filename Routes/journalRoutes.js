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
const { protect } = require("../middleware/authMiddleware");

router.get("/", getJournals);
router.get("/id/:journalId", protect, getJournalById);
router.get("/:userId", protect, getUserJournals);
router.get("/:year/:month/:day/:userId", protect, getDayMonthYearUserJournals);
router.post("/", protect, addJournal);
router.put("/:journalId", protect, updateJournal);
router.delete("/:journalId", protect, deleteJournal);
module.exports = router;