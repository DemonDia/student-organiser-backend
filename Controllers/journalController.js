const User = require("../Models/userModel");
const Journal = require("../Models/journalModel");

// ========================all journals on db========================
const getJournals = async (req, res) => {};

// ========================get journal by ID========================
// check via its ID
const getJournalById = async (req, res) => {};

// ========================get all user journals========================
// check if user ID is valid
const getUserJournals = async (req, res) => {};

// ========================get all user journals by date========================
// check if user ID is valid
// check the date
const getDayMonthYearUserJournals = async (req, res) => {};

// ========================add journal to db========================
// title cannot exceed 20 characters
// content cannot exceed 100 characters
// rating cannot exceed 5
// isoDate --> autofilled
const addJournal = async (req, res) => {};

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
const deleteJournal = async (req, res) => {};

module.exports = {
    getJournals,
    getJournalById,
    getUserJournals,
    getDayMonthYearUserJournals,
    addJournal,
    updateJournal,
    deleteJournal,
};
