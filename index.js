const express = require("express")
const cors = require("cors");

const app = express()
app.use(express.json())
app.use(cors());

const {connect} = require("./database")


// ==============routes==============
app.use("/api/users",require("./Routes/userRoutes"))
const PORT = 8000

connect()

app.listen(PORT,()=>{
    console.log("OK")
})