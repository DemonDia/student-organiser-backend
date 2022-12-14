const User = require("../Models/userModel");
const Task = require("../Models/taskModel");
// =================task schema=================
// userId --> belongs to specific user
// tasName --> belongs to user
// completed --> boolean; task is completed or not (default is false)
// tags --> tags involved in the controller?
// addedDate --> date object contains the following:
    // year
    // month
    // day
    // time
// addedIsoDate --> datetime object --> created based on addedDate object

// =============Create=============
// add to db
const addTask = async (req, res) => {};
// =============Read=============
// get all from db
const getTasks = async (req, res) => {
    await Task.find()
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

// get all of a given user's db
const getAllUserTasks = async (req, res) => {};

// get for specific day for given user
const getDayMonthYearUserTasks = async (req, res) => {};
// =============Edit=============
// edit task name
const updateTask = async (req, res) => {};
// edit task completion status (complete or not)
const updateTaskCompletion = async (req, res) => {};

// =============Delete=============
// delete
const deleteTask = async (req, res) => {};
module.exports = {
    addTask,
    getTasks,
    getAllUserTasks,
    getDayMonthYearUserTasks,
    updateTask,
    updateTaskCompletion,
    deleteTask,
};
