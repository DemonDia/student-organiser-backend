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
// time (can ignore)
// addedIsoDate --> datetime object --> created based on addedDate object

// =============Create=============
// add to db 
// dont need to worry about clashing
// done
const addTask = async (req, res) => {
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
            const { taskName, tags, addedDate } = req.body;
            const { year, month, day } = addedDate;
            const newTask = new Task({
                userId,
                taskName,
                tags,
                addedDate,
                completed:false,
                addedIsoDate: new Date(year, month, day),
            });
            if (taskName.length > 20) {
                res.send({
                    success: false,
                    message: "Task name cannot exceed 20 characters",
                });
            } else {
                await Task.create(newTask)
                    .then((result) => {
                        res.send({
                            success: true,
                            message: "Task added",
                            data: newTask._id,
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
};
// =============Read=============
// get all from db
// done
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
