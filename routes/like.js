const express = require('express')
const router = express.Router()

const verifyToken = require('../validation/tokenValidation')

const Post = require('../models/Post')
const User = require('../models/User')


// POST (Create data)
router.post('/:postId', verifyToken, async(req,res) => {
    
     //Validation: Check User Privileges
     let user
     let post
     try {
        user = await User.findById(req.user._id)
        post = await Post.findById(req.params.postId)
        if (user.username === post.owner) {
            return res.status(401).send({message: "Cannot like own post"})
        }
     }
     catch (err) {
        return res.send({message: err})
     }

     try {
        const updatePostById = await Post.updateOne(
            {_id: req.params.postId},
            {$push: {
                likes: user.username
                }
            })
        res.send(updatePostById)
    }
    catch(err) {
        res.send({message:err})
    }
})


module.exports = router