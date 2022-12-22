const {
    getUsers,
    testRoute,
    addUser,
    loginUser,
    getMe,
    verifyUser,
    sendForgetPasswordEmail,
    changeNewPassword,
    changeName
} = require("../Controllers/userController");

const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
router.get("/test", testRoute);
router.get("/", getUsers);
router.post("/", addUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/verify/:userId/:token", verifyUser);
router.put("/resetpass", sendForgetPasswordEmail);
router.put("/changename",protect,changeName);
router.post("/changepass",changeNewPassword);
module.exports = router;
