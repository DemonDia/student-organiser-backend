const {getUsers,testRoute,addUser,loginUser} = require("../Controllers/userController")
const express = require("express")
const router = express.Router()
router.get("/test",testRoute)
router.get("/",getUsers)
router.post("/",addUser)
router.post("/login",loginUser)
module.exports = router