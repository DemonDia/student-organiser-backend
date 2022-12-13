const {
    addTask,
    getTasks,
    getAllUserTasks,
    getDayMonthYearUserTasks,
    updateTask,
    deleteTask,
} = require("../Controllers/taskController");
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
router.get("/",getTasks);
router.get("/:userId",protect,getAllUserTasks)
router.get("/:year/:month/:day/:userId",protect,getDayMonthYearUserTasks)
router.post("/",protect,addTask)
router.put("/:taskId", protect, updateTask);
router.delete("/:taskId", protect, deleteTask);
module.exports = router;