const expressAsyncHandler = require("express-async-handler")
const Goal = require("../models/goalModel")
const User = require("../models/userModel")

const getGoals = expressAsyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id })
    res.status(200).json(goals)
})

const setGoal = expressAsyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400)
        throw new Error('Please fill the fields')
    }
    Goal.create({
        text: req.body.name,
        user: req.user.id
    })
    res.status(200).json({ messaage: 'New Goal Created' })
})

const updateGoal = expressAsyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal Not Found')
    }

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('Use are not Authorized')
    }

    // Make sure the logged in user macthers the goal user
    if (goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Use are not Authorized')
    }

    const updateGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updateGoal)
})

const deleteGoal = expressAsyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal Not Found')
    }

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('Use are not Authorized')
    }

    // Make sure the logged in user macthers the goal user
    if (goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Use are not Authorized')
    }

    await goal.remove()
    res.status(200).json({ messaage: `Goal Deleted Successfully ${req.params.id}` })
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}