const express = require("express")
const Task = require("../models/task")
const auth = require("../middleware/auth")

const router = new express.Router()

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body, 
    owner: req.user._id
  })

  try {
    task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// GET /tasks?completed=true || false
// GET /tasks?limit=number&skip=number
// GET /tasks?sort=createdAt_asc || desc
router.get("/tasks", auth, async (req, res) => {
  const match = {
    limit: parseInt(req.query.limit),
    skip: parseInt(req.query.skip),
  }

  const sort = {}

  if(req.query.completed) {
    match.completed = req.query.completed === "true"
  }

  if(req.query.sort) {
    const parts = req.query.sort.split("_")
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1
  }
  console.log(sort)

  try {
    const tasks = await Task.find({ owner:req.user._id, completed: match.completed }, null, { limit: match.limit ,skip: match.skip, sort })
    res.status(200).send(tasks)
  } catch (e) {
    res.status(500).send()
  }
})

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOne({ _id, owner: req.user._id})

    if (!task) {
      return res.status(404).send()
    }
    res.status(200).send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ["description", "completed"]
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({error: "Invalid updates"})
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    
    if (!task) {
      res.status(404).send()
    }

    updates.forEach((update) => task[update] = req.body[update])
    await task.save()

    res.status(200).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    
    if (!task) {
      res.status(404).send()
    }
    res.status(200).send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router