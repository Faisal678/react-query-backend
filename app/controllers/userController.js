const expressAsyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const getUsers = expressAsyncHandler(async (req, res) => {
    const users = await User.find()
    res.status(200).json(users)
})

const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, fname, email, phone, designation, password } = req.body

    if (!name || !fname || !email || !phone || !designation || !password) {
        res.status(400)
        throw new Error('Please fill all the fields')
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('Email already exists')
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const user = User.create({ name, fname, email, phone, designation, password: hashPassword })

    if (user) {
        res.status(201).json({ messaage: 'New User Created', token: generateToken(user._id) })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user._id)
        const { _id, name, fname, email, phone, designation } = user
        res.json({ _id, name, fname, email, phone, designation, token })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

const userProfile = expressAsyncHandler(async (req, res) => {
    // const user = await User.findById(req.user.id).select('-password')
    res.status(200).json(req.user)
})

const updateUser = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(400)
        throw new Error('User Not Found')
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updateUser)
})

const deleteUser = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(400)
        throw new Error('User Not Found')
    }
    await user.remove()
    res.status(200).json({ messaage: `User Deleted Successfully ${req.params.id}` })
})

module.exports = {
    getUsers,
    registerUser,
    loginUser,
    generateToken,
    userProfile,
    updateUser,
    deleteUser
}