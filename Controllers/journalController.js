const User = require("../Models/userModel");
const Journal = require("../Models/journalModel");

// ========================all journals on db========================
// done
const getJournals = async (req, res) => {
    await Journal.find()
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

// ========================get journal by ID========================
// check via its ID
// done
const getJournalById = async (req, res) => {
    const {journalId} = req.params;
    if (journalId.length != 24) {
        res.send({
            success: false,
            message: "Event is not found",
        });
    } else {
        await Journal.findById(journalId)
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
};

// ========================get all user journals========================
// check if user ID is valid
// done
const getUserJournals = async (req, res) => {
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
            await Journal.find({ userId: userId })
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

// ========================get all user journals by date========================
// check if user ID is valid
// check the date
// done
const getDayMonthYearUserJournals = async (req, res) => {
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
            filteredJournalEntries = [];
            await Journal.find({ userId: userId })
                .then((result) => {
                    result.forEach((journalEntry) => {
                        const {
                            year: eventYear,
                            month: eventMonth,
                            day: eventDay,
                        } = journalEntry.date;
                        if (
                            eventYear == filterYear &&
                            eventMonth == filterMonth &&
                            eventDay == filterDay
                        ) {
                            filteredJournalEntries.push(journalEntry);
                        }
                    });
                    res.send({
                        success: true,
                        data: filteredJournalEntries,
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

// ========================add journal to db========================
// title cannot exceed 20 characters
// content cannot exceed 100 characters
// rating cannot exceed 5
// isoDate --> autofilled
// done
const addJournal = async (req, res) => {
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
            const { journalTitle, journalContent, moodRating,tags, date } = req.body;
            const { year, month, day, hour, minute } = date;
            const newJournal = new Journal({
                userId,
                journalTitle,
                journalContent,
                moodRating,
                tags,
                date,
                isoDate: new Date(year, month, day, hour, minute),
            });

            if (journalTitle.length > 20) {
                res.send({
                    success: false,
                    message: "Journal title cannot exceed 20 characters",
                });
            } else {
                if (journalContent.length > 100) {
                    res.send({
                        success: false,
                        message: "Journal content cannot exceed 20 characters",
                    });
                } else {
                    await Journal.create(newJournal)
                        .then((result) => {
                            res.send({
                                success: true,
                                message: "Journal entry added",
                                data: newJournal._id,
                            });
                        })
                        .catch((err) => {
                            console.log(err)
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

// ========================edit journal from========================
// ========may not be needed if created record is non-editable
// check if journal record exists & user has it
// check via its ID
// check if json user ID matches user ID in journal entry

// title cannot exceed 20 characters
// content cannot exceed 100 characters
// rating cannot exceed 5
const updateJournal = async (req, res) => {};

// ========================delete journal========================
// check if journal record exists
// check if user ID matches
const deleteJournal = async (req, res) => {
    const { journalId } = req.params;
    const { userId } = req.body;
    if (journalId.length != 24) {
        res.send({
            success: false,
            message: "Journal entry does not exist!",
        });
    } else {
        await Journal.findById(journalId).then((result) => {
            if (!result) {
                res.send({
                    success: false,
                    message: "Journal entry does not exist!",
                });
            } else {
                if (result.userId != userId) {
                    res.send({
                        success: false,
                        message: "User does not have that journal entry",
                    });
                } else {
                    Journal.deleteOne(result)
                        .then((deleteResult) => {
                            res.send({
                                success: true,
                                message: "Journal entry deleted",
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
    getJournals,
    getJournalById,
    getUserJournals,
    getDayMonthYearUserJournals,
    addJournal,
    updateJournal,
    deleteJournal,
};
