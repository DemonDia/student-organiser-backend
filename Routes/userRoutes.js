const {
    getUsers,
    addUser,
    loginUser,
    getMe,
    verifyUser,
    sendForgetPasswordEmail,
    changeNewPassword,
    changeName,
    deleteAccount
} = require("../Controllers/userController");

const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
// router.get("/", getUsers);
router.post("/", addUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/verify/:userId/:token", verifyUser);
router.put("/resetpass", sendForgetPasswordEmail);
router.put("/changename",protect,changeName);
router.post("/changepass",changeNewPassword);
router.delete("/:userId",protect,deleteAccount);
module.exports = router;
