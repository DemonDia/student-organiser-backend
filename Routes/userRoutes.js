const {getUsers,testRoute,addUser} = require("../Controllers/userController")
const express = require("express")
const router = express.Router()
router.get("/test",testRoute)
router.get("/",getUsers)
router.post("/",addUser)

module.exports = router