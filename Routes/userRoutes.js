const {
    getUsers,
    addUser,
    loginUser,
    getMe,
    verifyUser,
    sendForgetPasswordEmail,
    changeNewPassword,
    changeName,
    deleteAccount,
} = require("../Controllers/userController");

const express = require("express");
const router = express.Router();
const { verifyToken, refreshToken } = require("../Middleware/authMiddleware");
// router.get("/", getUsers);
router.post("/", addUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getMe);
router.put("/verify/:userId/:token", verifyUser);
router.put("/resetpass", sendForgetPasswordEmail);
router.put("/changename", verifyToken, changeName);
router.post("/changepass", changeNewPassword);
router.get("/refresh", refreshToken, verifyToken, getMe);
router.delete("/:userId", verifyToken, deleteAccount);
module.exports = router;
