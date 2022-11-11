const jwt = require('jsonwebtoken')

function auth(req,res,next) {
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).send({message: 'Access Denied'})
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    }
    catch (err) {
        return res.status(401).send({message: 'Invalid Token'})
    }
}

module.exports = auth