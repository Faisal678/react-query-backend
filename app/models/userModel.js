const mongoose = require('mongoose')

const userSechema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        fname: {
            type: String,
            required: [true, "Father name is required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true
        },
        phone: {
            type: String,
            required: [true, "Phone is required"]
        },
        designation: {
            type: String,
            required: [true, "Designation is required"]
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSechema)