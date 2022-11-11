const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')


mongoose.connect(process.env.DB_CONNECT, () => {
    console.log('DB is connected...')
})

app.listen(3000, () => {
    console.log('Server is running...')
})