const express = require("express")
const cors = require("cors");
require("dotenv").config();
const app = express()
const cookieParser = require('cookie-parser')

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json())
app.use(cors({ credentials: true, origin: process.env.USER_INTERFACE
    //  , exposedHeaders: ["set-cookie"]
}));
const {connect} = require("./database")


// ==============routes==============
app.use("/api/users",require("./Routes/userRoutes"))
app.use("/api/events",require("./Routes/eventRoutes"))
app.use("/api/tasks",require("./Routes/taskRoutes"))
app.use("/api/journals",require("./Routes/journalRoutes"))
app.use("/api/quizzes",require("./Routes/quizRoutes"))
app.use("/api/quizAttempts",require("./Routes/quizAttemptRoutes"))
const PORT = 8000

connect()

app.listen(PORT,()=>{
    console.log("OK")
})