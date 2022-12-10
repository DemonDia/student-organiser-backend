const express = require("express")
const app = express()
app.use(express.json())

const {connect} = require("./database")


// ==============routes==============
app.use("/api/users",require("./Routes/userRoutes"))
const PORT = 8080

connect()

app.listen(PORT,()=>{
    console.log("OK")
})