const supertest = require('supertest')
const {createServer, connectDB, disconnectDB} = require('../server')
const app = createServer()

describe('post', () => {

    describe('get posts route', () => {
        
        describe('given the user is not authorised', () => {
            it("should return a 401", async () => {
                const postId = 'post-123'

                await supertest(app).get(`/api/post/${postId}`).expect(401)
            })
            
        })


    })
    
    afterAll(async () => {
        await disconnectDB()
    })
    
})