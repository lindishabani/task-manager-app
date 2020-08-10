require("./db/mongoose")
const express = require("express")
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

const app = express()
const port = process.env.PORT || 3001

// app.use((req, res, next) => {
//   res.status(503).send("website is in maintnace")
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log("Server is up and running on port", port)
})

// const Task = require("./models/task")
// const User = require("./models/user")

// const main = async () => {
//   // const task = await Task.findById("5f2d6e76052bd23c7206b807")
//   // await task.populate("owner").execPopulate()
//   // console.log(task.owner) 

//   const user = await User.findById("5f2d6e4f052bd23c7206b805")
//   await user.populate("tasks").execPopulate()
//   console.log(user.tasks)
// }

// main()