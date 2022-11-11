const mongoose = require('mongoose')

const userData = mongoose.Schema({
    user_id: {
        type: Object,
        required: true
    },
    posts: {
        type: [String],
        required: true
    },
    likes: {
        type: [String],
        required: true
    },
    comments: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('userData', userData)