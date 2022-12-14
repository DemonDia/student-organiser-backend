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
                completed: false,
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
// done
const getAllUserTasks = async (req, res) => {
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
            await Task.find({ userId: userId })
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

// get for specific day for given user
// done
const getDayMonthYearUserTasks = async (req, res) => {
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
            filteredTasks = [];
            await Task.find({ userId: userId })
                .then((result) => {
                    result.forEach((userTask) => {
                        const {
                            year: taskYear,
                            month: taskMonth,
                            day: taskDay,
                        } = userTask.addedDate;
                        if (
                            taskYear == filterYear &&
                            taskMonth == filterMonth &&
                            taskDay == filterDay
                        ) {
                            filteredTasks.push(userTask);
                        }
                    });
                    res.send({
                        success: true,
                        data: filteredTasks,
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
// =============Edit=============
// edit task name
// done
const updateTask = async (req, res) => {
    const { userId, tags, taskName } = req.body;
    const { taskId } = req.params;
    await Task.findById(taskId).then(async (result) => {
        if (!result) {
            res.send({
                success: false,
                message: "Task does not exist!",
            });
        } else {
            if (result.userId != userId) {
                res.send({
                    success: false,
                    message: "User does not have that Task",
                });
            } else {
                if (taskName.length > 20) {
                    res.send({
                        success: false,
                        message: "Task name cannot exceed 20 characters",
                    });
                } else {
                    Task.updateOne(
                        { _id: result._id },
                        {
                            taskName,
                            tags,
                        }
                    )
                        .then((result) => {
                            res.send({
                                success: true,
                                message: "Task updated",
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
    });
};
// edit task completion status (complete or not) --> ONLY completion status
// done
const updateTaskCompletion = async (req, res) => {
    const { userId, completed } = req.body;
    const { taskId } = req.params;
    await Task.findById(taskId).then(async (result) => {
        if (!result) {
            res.send({
                success: false,
                message: "Task does not exist!",
            });
        } else {
            if (result.userId != userId) {
                res.send({
                    success: false,
                    message: "User does not have that Task",
                });
            } else {
                Task.updateOne(
                    { _id: result._id },
                    {
                        completed,
                    }
                )
                    .then((result) => {
                        res.send({
                            success: true,
                            message: "Task status updated",
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
    });
};

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
