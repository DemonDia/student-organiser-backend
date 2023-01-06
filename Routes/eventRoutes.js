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
const { verifyToken,refreshToken } = require("../Middleware/authMiddleware");

// router.get("/", getEvents);
router.get("/id/:eventId", verifyToken, getEventById);
router.get("/:userId", verifyToken, getAllUserEvents);
router.get("/:year/:month/:userId", verifyToken, getMonthYearUserEvents);
router.get("/:year/:month/:day/:userId", verifyToken, getDayMonthYearUserEvents);
router.post("/", verifyToken, addEvent);
router.put("/:eventId", verifyToken, updateEvent);
router.delete("/:eventId", verifyToken, deleteEvent);
module.exports = router;
