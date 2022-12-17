const {
    getEvents,
    getAllUserEvents,
    getDayMonthYearUserEvents,
    getMonthYearUserEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById
} = require("../Controllers/eventController");
const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
router.get("/", getEvents);
router.get("/id/:eventId", protect, getEventById);
router.get("/:userId", protect, getAllUserEvents);
router.get("/:year/:month/:userId", protect, getMonthYearUserEvents);
router.get("/:year/:month/:day/:userId", protect, getDayMonthYearUserEvents);
router.post("/", protect, addEvent);
router.put("/:eventId", protect, updateEvent);
router.delete("/:eventId", protect, deleteEvent);
module.exports = router;
