const supertest = require('supertest')
const {MongoMemoryServer} = require('mongodb-memory-server')
const mongoose = require('mongoose')
const {createServer, connectDB, disconnectDB} = require('../utils/server')
const app = createServer()

describe('post', () => {
    
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
    describe('get posts route', () => {
        
        describe('given the user is not authorised', () => {
            it("should return a 401", async () => {
                const postId = 'post-123'

                await supertest(app).get(`/api/post/${postId}`).expect(401)
            })
            
        })


    })

})