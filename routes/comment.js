const express = require('express')
const router = express.Router()

const verifyToken = require('../validation/tokenValidation')
const { commentValidation } = require('../validation/validations')

const Post = require('../models/Post')
const User = require('../models/User')


// POST COMMENT
router.post('/:postId', verifyToken, async(req,res) => {
    
     // Validation 1: User Input
     const {error} = commentValidation(req.body)
     if (error) {
         return res.status(400).send({message: error.details.at(0).message})
     }

    
     //Validation 2: Check User Privileges
     let user
     let post
     try {
        user = await User.findById(req.user._id)
        post = await Post.findById(req.params.postId)
        if (user.username === post.owner) {
            return res.status(401).send({message: "Cannot comment own post"})
        }
     }
     catch (err) {
        return res.send({message: err})
     }

     // UPDATE RECORD
     try {
        const comment = {
            owner: user.username,
            text: req.body.text
        }
        const updatePostById = await Post.updateOne(
            {_id: req.params.postId},
            {$push: {
                comments: comment
                }
            })
        res.status(201).send(updatePostById)
    }
    catch(err) {
        res.send({message:err})
    }
})


module.exports = router