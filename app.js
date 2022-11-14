const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')


app.use(bodyParser.json())

const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')
const commentRoute = require('./routes/comment')

// Middleware
app.use('/api/user', authRoute)
app.use('/api/post', postRoute)
app.use('/api/comment', commentRoute)


mongoose.connect(process.env.DB_CONNECT, () => {
    console.log('DB is connected...')
})

app.listen(3000, () => {
    console.log('Server is running...')
})