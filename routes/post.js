const express = require('express')
const router = express.Router()

const verifyToken = require('../validation/tokenValidation')
const { postValidation } = require('../validation/validations')

const Post = require('../models/Post')
const User = require('../models/User')


// POST (Create data)
router.post('/', verifyToken, async(req,res) => {
    
     // Validation 1: User Input
     const {error} = postValidation(req.body)
     if (error) {
         return res.status(400).send({message: error.details.at(0).message})
     }

     let user
     try {
        user = await User.findById(req.user._id)
     }
     catch (err) {
        return res.send({message: err})
     }

    // Creating Post
    const postData = new Post({
        title: req.body.title,
        owner: user.username,
        description: req.body.description,
        text: req.body.text,
        timestamp: Date.now()
    })

    // Inserting into DB
    try {
        const postToSave = await postData.save()
        res.send(postToSave)
    }
    catch (err) {
        res.send({message:err})
    }
})

// GET ALL
router.get('/', verifyToken, async(req,res) => {

    // TODO: Present posts in DESC ORDER by number of likes
    //       If equal number of likes, NEWER POSTS first (CHRONOLOGICAL ORDER)
    try {
        const getPosts = await Post.find().sort({likes: 'desc', timestamp: 'desc'})
        res.send(getPosts)
    }
    catch (err) {
        res.send({message:err})
    }
})

// GET BY ID
router.get('/:postId', verifyToken, async(req,res) => {
    try {
        const getPosts = await Post.findById(req.params.postId)
        res.send(getPosts)
    }
    catch (err) {
        res.send({message:err})
    }
})

// UPDATE 
router.patch('/:postId', verifyToken, async(req,res) => {

     // Validation 1:  User Input
     const {error} = postValidation(req.body)
     if (error) {
         return res.status(400).send({message: error.details.at(0).message})
     }

     //Validation 2: Check User Privileges
     let post
     try {
        const user = await User.findById(req.user._id)
        post = await Post.findById(req.params.postId)
        if (user.username !== post.owner) {
            return res.status(401).send({message: "Unauthorised"})
        }
     }
     catch (err) {
        return res.send({message: err})
     }
    
    try {
        const updatePostById = await Post.updateOne(
            {_id: req.params.postId},
            {$set: {
                title: req.body.title ? req.body.title : post.title,
                description: req.body.description ? req.body.description : post.description,
                text: req.body.text ? req.body.text : post.text,
                timestamp: Date.now()
                }
            })
        res.send(updatePostById)
    }
    catch(err) {
        res.send({message:err})
    }
})


// DELETE by ID
router.delete('/:postId', verifyToken, async(req,res) => {

     //Validation: Check User Privileges
     try {
        const user = await User.findById(req.user._id)
        const post = await Post.findById(req.params.postId)
        if (user.username !== post.owner) {
            return res.status(401).send({message: "Unauthorised"})
        }
     }
     catch (err) {
        return res.send({message: err})
     }

    try {
        const deletePostById = await Post.deleteOne({_id: req.params.postId})
        res.send(deletePostById)
    }
    catch(err) {
        res.send({message: err})
    }
})

module.exports = router