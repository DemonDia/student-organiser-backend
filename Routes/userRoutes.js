const {getUsers,testRoute} = require("../Controllers/userController")
const express = require("express")
const router = express.Router()
router.get("/test",testRoute)
router.get("/",getUsers)


module.exports = router