const User = require("../Models/userModel");
const Event = require("../Models/eventModel");

// ========================all events on db========================
const getEvents = async (req, res) => {
    await Event.find()
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

// ========================all events of user========================
// get the user ID
const getAllUserEvents = async (req, res) => {
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
            await Event.find({ userId: userId })
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

// ========================all events of user with specific month & year========================
// get the user ID first
// get the month & year
const getMonthYearUserEvents = async (req, res) => {};

// ========================add event========================
// check if event clashes (same year, month, day and time)
// event name cannot exceed 20 char
const addEvent = async (req, res) => {};

// ========================update event========================
// check if event clashes (same year, month, day and time)
// event name cannot exceed 20 char
// check if user ID matches
const updateEvent = async (req, res) => {};

// ========================delete event========================
// check if event exists
// check if user ID matches
const deleteEvent = async (req, res) => {};
module.exports = {
    getEvents,
    getAllUserEvents,
    getMonthYearUserEvents,
    addEvent,
    updateEvent,
    deleteEvent,
};
