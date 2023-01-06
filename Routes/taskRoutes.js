const {
    addTask,
    getTasks,
    getAllUserTasks,
    getDayMonthYearUserTasks,
    updateTask,
    updateTaskCompletion,
    deleteTask,
} = require("../Controllers/taskController");

const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/authMiddleware");
// router.get("/",getTasks);
router.get("/:userId",verifyToken,getAllUserTasks)
router.get("/:year/:month/:day/:userId",verifyToken,getDayMonthYearUserTasks)
router.post("/",verifyToken,addTask)
router.put("/:taskId", verifyToken, updateTask);
router.put("/completion/:taskId", verifyToken, updateTaskCompletion);
router.delete("/:taskId", verifyToken, deleteTask);
module.exports = router;