const express = require('express')
const colors = require('colors')
const cors = require('cors')
const connectDb = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
app.use(cors())
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const server = http.createServer(app)

connectDb()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/goals', require('./routes/goalRoutes'))
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(`User Connected ${socket.id}`)

    socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data)
    })
})

server.listen(3002, () => {
    console.log("Socket server is Runing")
})