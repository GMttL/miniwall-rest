
const Olga = {
    username: 'Olga',
    email: 'olga@cloud.tv',
    password: 'password123'
}


// This is where we store the token we need to test our APIs
// It is populated once we completed testing the login endpoint
// and everything is successful

// WARNING: DUE TO THIS OUR TESTS MUST RUN SEQUENTIALLY WITH THE AUTHENTICATION LAYER BEING FIRST
// WARNING: MAKE SURE YOU USE THE --runInBand FLAG
const authorisation = {
    'auth-token': null
}


module.exports.Olga = Olga
module.exports.authorisation = authorisation