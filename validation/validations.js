const joi = require('joi')

// WARNING: THESE ARE NOT SANITISED FOR SECURITY (XSS, etc.) ONLY FOR INPUT VALIDATION

// REASON : Outside of scope at time of development


const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username: joi.string().required().min(4).max(256),
        email: joi.string().required().min(6).max(256).email(),
        password: joi.string().required().min(6).max(1024)
    })

    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email: joi.string().required().min(6).max(256).email(),
        password: joi.string().required().min(6).max(1024)
    })

    return schemaValidation.validate(data)
}

// TODO: Post Validation
const postValidation = (data) => {
    const schemaValidation = joi.object({
        title: joi.string().required().min(4).max(144),
        owner: joi.string().required().min(6).max(256).email(),
        description: joi.string().required(),
        text: joi.string().required()
    })

    return schemaValidation.validate(data)
}

// TODO: Comment Validation
const commentValidation = (data) => {
    const schemaValidation = joi.object({
        text: joi.string().required().max(1024),
        owner: joi.string().required().min(4).max(256)
    })

    return schemaValidation.validate(data)
}



module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postValidation = postValidation
module.exports.commentValidation = commentValidation