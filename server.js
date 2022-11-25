const express = require('express')

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')


const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')
const commentRoute = require('./routes/comment')
const likeRoute = require('./routes/like')


const createServer = () => {
    const app = express()
    app.use(bodyParser.json())

    // Middleware
    app.use('/api/user', authRoute)
    app.use('/api/post', postRoute)
    app.use('/api/comment', commentRoute)
    app.use('/api/like', likeRoute)

    connectDB()

    return app
}


const connectDB = () => {
    mongoose.connect(process.env.DB_CONNECT, () => {
        console.log('DB is connected...')
    })
}

const disconnectDB = async () => {
    await mongoose.disconnect()
}

module.exports.createServer = createServer
module.exports.connectDB = connectDB
module.exports.disconnectDB = disconnectDB