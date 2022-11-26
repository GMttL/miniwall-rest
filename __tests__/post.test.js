// DEPENDENCIES

const supertest = require('supertest')
const {MongoMemoryServer} = require('mongodb-memory-server')
const mongoose = require('mongoose')
const {createServer} = require('../utils/server')
const {authorisation} = require('../utils/testData/userTestData')


const app = createServer()

const headersAuth = {
    'Content-Type': 'application/json',
    'auth-token': authorisation['auth-token']
}

const headersNoAuth = {
    'Content-Type': 'application/json'
}


describe('Post API\n', () => {
    const path = '/api/post/'
    
    // ----- CONFIG -----
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()

        await mongoose.connect(mongoServer.getUri())
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })
    
    // ----- TESTS -----
    describe('CREATE POST', () => {
        describe('Unauthorised', () => {
            // TODO
        })

        describe('Authorised', () => {
            // TODO
        })
    })


    describe('GET POSTS', () => {
        
        describe('Unauthorised', () => {
            it("should return a 401", async () => {
                const postId = 'post-123'

                const {body, status} = await supertest(app)
                        .get(`${path}${postId}`)
                        .set(headersNoAuth)
                
                expect(status).toBe(401)
            })
        })

        describe('Authorised', () => {
            // TODO
        })
    })

    describe('GET POST BY ID', () => {
        describe('Unauthorised', () => {
            // TODO
        })

        describe('Authorised', () => {
            // TODO
        })
    })

    describe('UPDATE POST', () => {
        describe('Unauthorised', () => {
            describe('Different Token', () => {
                // TODO
            })

            describe('Without Token', () => {
                // TODO
            })
        })

        describe('Authorised', () => {
            // TODO
        })
    })

    describe('DELETE POST', () => {
        describe('Unauthorised', () => {
            describe('Different Token', () => {
                // TODO
            })

            describe('Without Token', () => {
                // TODO
            })
            
        })

        describe('Authorised', () => {
            // TODO
        })
    })
})

describe('Comment API\n', () => {
    const path = '/api/comment/'

    describe('POST Comment', () => {
        describe('Unauthorised', () => {
            describe('Same Owner', () => { // trying to comment own post -- goes against specs
                // TODO
            })

            describe('Without Token', () => { // we cannot authenticate the request
                // TODO
            })
            
        })

        describe('Authorised', () => { // success case
            // TODO
        })
    })
})


describe('Like API\n', () => {
    const path = '/api/like/'

    describe('POST Like', () => {
        describe('Unauthorised', () => {
            describe('Same Owner', () => { // trying to like own post -- goes against specs
                // TODO
            })

            describe('Without Token', () => { // we cannot authenticate the request
                // TODO
            })
            
        })

        describe('Authorised', () => { // success case
            // TODO
        })
    })
})