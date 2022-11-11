const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 4,
        max: 144
    },
    owner: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    likes: {
        type: [String]
    },
    comments: {
        type: [{
            owner: String,
            timestamp: {type: Date, default: Date.now()},
            text: {type: String, max: 1024}     // seems big enough for a comment
        }]
    }
})

module.exports = mongoose.model('posts', postSchema)