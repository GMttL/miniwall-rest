// DEPENDENCIES

// External
const supertest = require('supertest')
const {MongoMemoryServer} = require('mongodb-memory-server')
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

// Internal
const {createServer} = require('../utils/server')
const {twitterTakeoverPost, twitterTakeoverComment, metasMetaversePost, Mary, Nick, twitterTakeoverPostUpdate} = require('../utils/testData/postTestData')
const User = require('../models/User')


const app = createServer()


const headersAuthMaryJWT = {
    'Content-Type': 'application/json',
    'auth-token': ''
}

const headersAuthNickJWT = {
    'Content-Type': 'application/json',
    'auth-token': ''
}

const headersNoAuth = {
    'Content-Type': 'application/json'
}


// ---------- POST API ----------
describe('Post API\n', () => {
    const path = '/api/post/'
    let createdPostId = ''
    
    // ----- CONFIG -----
    async function registerUser(usr) {
        const {body, status} = await supertest(app)
        .post('/api/user/register')
        .set(headersNoAuth)
        .send(usr)

        return status === 201
    }

    async function loginUser(usr) {
        const {body, status} = await supertest(app)
        .post('/api/user/login')
        .set(headersNoAuth)
        .send({
            email: usr.email,
            password: usr.password
        })

        return body['auth-token']
    }

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()

        await mongoose.connect(mongoServer.getUri())

        await registerUser(Mary)
        const marysToken = await loginUser(Mary)
        headersAuthMaryJWT['auth-token'] = marysToken

        await registerUser(Nick)
        const nicksToken = await loginUser(Nick)
        headersAuthNickJWT['auth-token'] = nicksToken
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })
    
    // ----- TESTS -----
    describe('CREATE POST\n', () => {
        describe('Unauthorised', () => {
            it("should return a 401", async () => {
                const {body, status} = await supertest(app)
                        .post(path)
                        .set(headersNoAuth)
                        .send(twitterTakeoverPost)
                
                expect(status).toBe(401)
                expect(body.message).toBe("Access Denied")
            })
        })

        describe('Authorised', () => {
            it("should return a 201", async () => {
                const {body, status} = await supertest(app)
                        .post(path)
                        .set(headersAuthMaryJWT)
                        .send(twitterTakeoverPost)
                
                expect(status).toBe(201)
                expect(body.title).toBe(twitterTakeoverPost.title)
                expect(body.description).toBe(twitterTakeoverPost.description)
                expect(body.owner).toBe(Mary.username)
                expect(body.text).toBe(twitterTakeoverPost.text)

                // SAVE ID for later use
                createdPostId = body._id
            })
        })
    })


    describe('GET POSTS\n', () => {
        
        describe('Unauthorised', () => {
            it("should return a 401", async () => {
                const postId = 'post-123'

                const {body, status} = await supertest(app)
                        .get(path)
                        .set(headersNoAuth)
                
                expect(status).toBe(401)
            })
        })

        describe('Authorised', () => {
            it('should return a 200', async () => {
                const {body, status} = await supertest(app)
                        .get(path)
                        .set(headersAuthMaryJWT)

                expect(status).toBe(200)
                expect(body.length > 0).toBe(true)
                
            })
            
        })
    })

    describe('GET POST BY ID\n', () => {
        describe('Unauthorised', () => {
            it("should return a 401", async () => {
                const {body, status} = await supertest(app)
                        .get(path + createdPostId)
                        .set(headersNoAuth)
                
                expect(status).toBe(401)
            })
        })

        describe('Authorised', () => {
            describe('Invalid Post ID', () => {
                it('should return a 200 with error message', async () => {
                    const {body, status} = await supertest(app)
                            .get(path + (createdPostId + "5"))
                            .set(headersAuthMaryJWT)
    
                    expect(status).toBe(200)
                    expect(body.message.name).toBe("CastError")
                })
            })

            describe('Valid Post ID', () => {
                it('should return a 200', async () => {
                    const {body, status} = await supertest(app)
                            .get(path + createdPostId)
                            .set(headersAuthMaryJWT)
    
                    expect(status).toBe(200)
                    expect(body.title).toBe(twitterTakeoverPost.title)
                    expect(body.description).toBe(twitterTakeoverPost.description)
                    expect(body.owner).toBe(Mary.username)
                    expect(body.text).toBe(twitterTakeoverPost.text)
                })
            })
            
        })
    })

    describe('UPDATE POST\n', () => {
        describe('Unauthorised', () => {
            describe('Different Token', () => {
                it("should return a 401", async () => {
                    const {body, status} = await supertest(app)
                            .patch(path + createdPostId)
                            .set({'Content-Type': 'application/json'})
                            .set({'auth-token': headersAuthMaryJWT['auth-token'] + '5'})
                            .send(twitterTakeoverPostUpdate)
                    
                    expect(status).toBe(401)
                    expect(body.message).toBe("Invalid Token")
                })
            })

            describe('Without Token', () => {
                it("should return a 401", async () => {
                    const {body, status} = await supertest(app)
                            .patch(path + createdPostId)
                            .set(headersNoAuth)
                            .send(twitterTakeoverPostUpdate)
                    
                    expect(status).toBe(401)
                    expect(body.message).toBe("Access Denied")
                })
            })
        })

        describe('Authorised', () => {
            describe('Invalid Post ID', () => {
                it('should return a 200 witn an error message', async () => {
                    const {body, status} = await supertest(app)
                            .patch(path + createdPostId + "5")
                            .set(headersAuthMaryJWT)
                            .send(twitterTakeoverPostUpdate)
                    
                    expect(status).toBe(200)
                    expect(body.message.name).toBe("CastError")
                })
            })

            describe('Valid Post ID', () => {
                it('should return a 200', async () => {
                    const {body, status} = await supertest(app)
                            .patch(path + createdPostId)
                            .set(headersAuthMaryJWT)
                            .send(twitterTakeoverPostUpdate)
                
                    expect(status).toBe(200)
                    expect(body.acknowledged).toBe(true)
                    expect(body.modifiedCount).toBe(1)
                    expect(body.matchedCount).toBe(1)
                })
            })
        })
    })

    // ---------- COMMENT API ----------
    describe('Comment API\n', () => {
        const path = '/api/comment/'

        describe('POST Comment\n', () => {
            describe('Unauthorised', () => {
                describe('Same Owner', () => { // trying to comment own post -- goes against specs
                    it('should return a 401 with a nice error message', async () => {
                        const {body, status} = await supertest(app)
                                .post(path + createdPostId)
                                .set(headersAuthMaryJWT)
                                .send(twitterTakeoverComment)

                        expect(status).toBe(401)
                        expect(body.message).toBe("Cannot comment own post")
                    })
                })

                describe('Without Token', () => { // we cannot authenticate the request
                    it('should return a 401 with a nice error message', async () => {
                        const {body, status} = await supertest(app)
                                .post(path + createdPostId)
                                .set(headersNoAuth)
                                .send(twitterTakeoverComment)

                        expect(status).toBe(401)
                        expect(body.message).toBe("Access Denied")
                    })
                })
            })

            describe('Authorised', () => {
                describe('Invalid Post ID', () => {
                    it('should return a 200 witn an error message', async () => {
                        const {body, status} = await supertest(app)
                                .post(path + createdPostId + "5")
                                .set(headersAuthNickJWT)
                                .send(twitterTakeoverComment)
                        
                        expect(status).toBe(200)
                        expect(body.message.name).toBe("CastError")
                    })
                })

                describe('Valid Post ID', () => { // success case
                    it('should return a 201', async () => {
                        const {body, status} = await supertest(app)
                                .post(path + createdPostId)
                                .set(headersAuthNickJWT)
                                .send(twitterTakeoverComment)

                        expect(status).toBe(201)
                        expect(body.acknowledged).toBe(true)
                        expect(body.modifiedCount).toBe(1)
                        expect(body.matchedCount).toBe(1)
                    })
                })
            })
        })
    })


    // ---------- LIKE API ----------
    describe('Like API\n', () => {
        const path = '/api/like/'

        describe('POST Like\n', () => {
            describe('Unauthorised', () => {
                describe('Same Owner', () => { // trying to like own post -- goes against specs
                    it('should return a 401 with a nice error message', async () => {
                        const {body, status} = await supertest(app)
                                .post(path + createdPostId)
                                .set(headersAuthMaryJWT)

                        expect(status).toBe(401)
                        expect(body.message).toBe("Cannot like own post")
                    })
                })

                describe('Without Token', () => { // we cannot authenticate the request
                    it('should return a 401 with a nice error message', async () => {
                        const {body, status} = await supertest(app)
                                .post(path + createdPostId)
                                .set(headersNoAuth)

                        expect(status).toBe(401)
                        expect(body.message).toBe("Access Denied")
                    })
                })
                
            })

            describe('Authorised', () => {
                describe('Invalid Post ID', () => {
                    it('should return a 200 witn an error message', async () => {
                        const {body, status} = await supertest(app)
                                .post(path + createdPostId + "5")
                                .set(headersAuthNickJWT)
                        
                        expect(status).toBe(200)
                        expect(body.message.name).toBe("CastError")
                    })
                })

                describe('Valid Post ID', () => { // success case
                    it('should return a 201', async () => {
                        const {body, status} = await supertest(app)
                                .post(path + createdPostId)
                                .set(headersAuthNickJWT)
                        
                        expect(status).toBe(201)
                        expect(body.acknowledged).toBe(true)
                        expect(body.modifiedCount).toBe(1)
                        expect(body.matchedCount).toBe(1)
                    })
                })
            })
        })
    })

    // ---------- DELETE ENDPOINT ----------
    describe('DELETE POST\n', () => {
        describe('Unauthorised', () => {
            describe('Different Token', () => {
                it("should return a 401", async () => {
                    const {body, status} = await supertest(app)
                            .delete(path + createdPostId)
                            .set({'Content-Type': 'application/json'})
                            .set({'auth-token': headersAuthMaryJWT['auth-token'] + '5'})
                    
                    expect(status).toBe(401)
                    expect(body.message).toBe("Invalid Token")
                })
            })

            describe('Without Token', () => {
                it("should return a 401", async () => {
                    const {body, status} = await supertest(app)
                            .delete(path + createdPostId)
                            .set(headersNoAuth)
                    
                    expect(status).toBe(401)
                    expect(body.message).toBe("Access Denied")
                })
            })
            
        })

        describe('Authorised', () => {
            describe('Invalid Post ID', () => {
                it('should return a 200 witn an error message', async () => {
                    const {body, status} = await supertest(app)
                            .delete(path + createdPostId + "5")
                            .set(headersAuthMaryJWT)
                    
                    expect(status).toBe(200)
                    expect(body.message.name).toBe("CastError")
                })
            })

            describe('Valid Post ID', () => {
                it('should return a 200', async () => {
                    const {body, status} = await supertest(app)
                            .delete(path + createdPostId)
                            .set(headersAuthMaryJWT)
                    
                    expect(status).toBe(200)
                    expect(body.acknowledged).toBe(true)
                    expect(body.deletedCount).toBe(1)
                })
            })
        })
    })
})