const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected`.cyan.underline)
    }
    catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDb