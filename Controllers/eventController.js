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

// ========================get event by id========================
const getEventById = async(req,res)=>{
    const {eventId} = req.params;
    if (eventId.length != 24) {
        res.send({
            success: false,
            message: "Event is not found",
        });
    } else {
        await Event.findById(eventId)
            .then((result) => {
                if (!result) {
                    res.send({
                        success: false,
                        message: "Event is not found",
                    });
                } else {
                    res.send({
                        success: true,
                        data: result,
                    });
                }
            })
            .catch((err) => {
                res.send({
                    success: false,
                    message: err,
                });
            });
    }
}

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
// get the user ID first --> done
// get the month & year --> done
const getMonthYearUserEvents = async (req, res) => {
    const { userId, year: filterYear, month: filterMonth } = req.params;
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
            filteredEvents = [];
            await Event.find({ userId: userId })
                .then((result) => {
                    result.forEach((userEvent) => {
                        const { year: eventYear, month: eventMonth } =
                            userEvent.date;
                        // console.log(eventYear, eventMonth);
                        if (
                            eventYear == filterYear &&
                            eventMonth == filterMonth
                        ) {
                            filteredEvents.push(userEvent);
                        }
                    });
                    res.send({
                        success: true,
                        data: filteredEvents,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.send({
                        success: false,
                        message: err,
                    });
                });
        }
    }
};

// ========================all events of user with specific day & month & year========================
const getDayMonthYearUserEvents = async (req, res) => {
    const {
        userId,
        year: filterYear,
        month: filterMonth,
        day: filterDay,
    } = req.params;
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
            filteredEvents = [];
            await Event.find({ userId: userId })
                .then((result) => {
                    result.forEach((userEvent) => {
                        const {
                            year: eventYear,
                            month: eventMonth,
                            day: eventDay,
                        } = userEvent.date;
                        if (
                            eventYear == filterYear &&
                            eventMonth == filterMonth &&
                            eventDay == filterDay
                        ) {
                            filteredEvents.push(userEvent);
                        }
                    });
                    res.send({
                        success: true,
                        data: filteredEvents,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.send({
                        success: false,
                        message: err,
                    });
                });
        }
    }
};

// ========================add event========================
// check if event clashes (same year, month, day and time) --> done
// event name cannot exceed 20 char --> done
const addEvent = async (req, res) => {
    const userId = req.body.userId;
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
            const { eventName, tags, date } = req.body;
            const { year, month, day, hour, minute } = date;
            const newEvent = new Event({
                userId,
                eventName,
                tags,
                date,
                isoDate: new Date(year, month, day, hour, minute),
            });
            // get all events of user --> filter
            const getClashingEvents = await Event.findOne({
                userId: newEvent.userId,
                isoDate: newEvent.isoDate,
            });
            if (eventName.length > 20) {
                res.send({
                    success: false,
                    message: "Event name cannot exceed 20 characters",
                });
            } else {
                if (getClashingEvents) {
                    res.send({
                        success: false,
                        message: "There is a clashing event",
                    });
                } else {
                    await Event.create(newEvent)
                        .then((result) => {
                            res.send({
                                success: true,
                                message: "Event added",
                                data: newEvent._id,
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
        }
    }
};

// ========================update event========================
// check if event clashes (same year, month, day and time) --> must be an event other than it
// event name cannot exceed 20 char --> done
// check if user ID matches --> done
const updateEvent = async (req, res) => {
    const { userId, eventName, tags, date } = req.body;
    const { eventId } = req.params;
    console.log(eventId);
    await Event.findById(eventId).then(async (result) => {
        if (!result) {
            res.send({
                success: false,
                message: "Event does not exist!",
            });
        } else {
            if (result.userId != userId) {
                res.send({
                    success: false,
                    message: "User does not have that event",
                });
            } else {
                if (eventName.length > 20) {
                    res.send({
                        success: false,
                        message: "Event name cannot exceed 20 characters",
                    });
                } else {
                    const { year, month, day, hour, minute } = date;
                    const isoDate = new Date(year, month, day, hour, minute);
                    // check for clash
                    await Event.findOne({
                        _id: { $ne: eventId },
                        userId: userId,
                        isoDate,
                    })
                        .then((clashingEvent) => {
                            if (!clashingEvent) {
                                Event.updateOne(
                                    { _id: result._id },
                                    {
                                        eventName,
                                        tags,
                                        date,
                                        isoDate,
                                    }
                                )
                                    .then((result) => {
                                        res.send({
                                            success: true,
                                            message: "Event updated",
                                        });
                                    })
                                    .catch((err) => {
                                        res.send({
                                            success: false,
                                            message: err,
                                        });
                                    });
                            } else {
                                res.send({
                                    success: false,
                                    message: "There is a clashing event",
                                });
                            }
                        })
                        .catch((err) => {
                            res.send({
                                success: false,
                                message: err,
                            });
                        });
                }
            }
        }
    });
};

// ========================delete event========================
// check if event exists --> done
// check if user ID matches --> done
const deleteEvent = async (req, res) => {
    const { eventId } = req.params;
    const { userId } = req.body;
    if (eventId.length != 24) {
        res.send({
            success: false,
            message: "Event does not exist!",
        });
    } else {
        await Event.findById(eventId).then((result) => {
            if (!result) {
                res.send({
                    success: false,
                    message: "Event does not exist!",
                });
            } else {
                if (result.userId != userId) {
                    res.send({
                        success: false,
                        message: "User does not have that Event",
                    });
                } else {
                    Event.deleteOne(result)
                        .then((deleteResult) => {
                            res.send({
                                success: true,
                                message: "Event deleted",
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.send({
                                success: false,
                                message: err,
                            });
                        });
                }
            }
        });
    }
};
module.exports = {
    getEvents,
    getAllUserEvents,
    getDayMonthYearUserEvents,
    getMonthYearUserEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById
};
