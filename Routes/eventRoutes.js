const {
    getEvents,
    getAllUserEvents,
    getDayMonthYearUserEvents,
    getMonthYearUserEvents,
    addEvent,
    updateEvent,
    deleteEvent,
} = require("../Controllers/eventController");
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
router.get("/", getEvents);
router.get("/:userId", protect, getAllUserEvents);
router.get("/:year/:month/:userId", protect, getMonthYearUserEvents);
router.get("/:year/:month/:day/:userId", protect, getDayMonthYearUserEvents);
router.post("/", protect, addEvent);
router.put("/:eventId", protect, updateEvent);
router.delete("/:eventId", protect, deleteEvent);
module.exports = router;
