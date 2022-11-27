const express = require('express')
const router = express.Router()

const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validation/validations')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


// REGISTER
router.post('/register', async(req,res) => {

    // Validation 1: User Input
    const {error} = registerValidation(req.body)
    if (error) {
        return res.status(400).send({message: error.details.at(0).message})
    }
    
    // Validation 2: Check user exists
    const emailInUse = await User.findOne({email:req.body.email})
    if (emailInUse || (emailInUse && emailInUse.username === req.body.username)) { // making sure the username is unique as well
        return res.status(400).send({message: 'User already exists'})
    }


    // HASH PASSWORDS
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    // create user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })

    // save user
    try {
        const savedUser = await user.save()
        return res.status(201).send(savedUser) 
    }
    catch (err) {
        return res.status(400).send({message:err})
    }
    
})

// LOGIN
router.post('/login', async(req,res) => {
    
     // Validation 1: User Input
     const {error} = loginValidation(req.body)
     if (error) {
         return res.status(400).send({message: error.details.at(0).message})
     }

     // Validation 2: Check user exists
    const user = await User.findOne({email:req.body.email})
    if (!user) {
        return res.status(400).send({message: 'Your credentials do not match our records'})
    }

     // Validation 3: Password
     const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
     if (!passwordValidation) {
        return res.status(400).send({message: 'Your credentials do not match our records'})
     }

     // GENERATE auth token
     const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET) 

     res.header('auth-token', token).send({'auth-token': token})
})


module.exports = router