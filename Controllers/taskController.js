const User = require("../Models/userModel");
const Task = require("../Models/taskModel");
// =============Create=============
// add to db
const addTask = async (req, res) => {};
// =============Read=============
// get all from db
const getTasks = async (req, res) => {};

// get all of a given user's db
const getAllUserTasks = async (req, res) => {};

// get for specific day for given user
const getDayMonthYearUserTasks = async (req, res) => {};
// =============Edit=============
// edit
const updateTask = async (req, res) => {};

// =============Delete=============
// delete
const deleteTask = async (req, res) => {};
module.exports = {
    addTask,
    getTasks,
    getAllUserTasks,
    getDayMonthYearUserTasks,
    updateTask,
    deleteTask,
};
