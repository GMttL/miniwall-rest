// DEPENDENCIES


const supertest = require('supertest')
const {MongoMemoryServer} = require('mongodb-memory-server')
const {createServer} = require('../utils/server')
const mongoose = require('mongoose')
const User = require('../models/User')
const {Olga, authorisation} = require('../utils/testData/userTestData')


const app = createServer()

describe('User Management\n', () => {
    const path = '/api/user/'
    const headersNoAuth = {
        'Content-Type': 'application/json'
    }

    // ----- CONFIG -----
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()

        await mongoose.connect(mongoServer.getUri())

        const user = new User(Olga)

        try {
            await user.save()
        }
        catch (err) {
            console.log('Error saving user into mongodb - memory - server')
        }
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    // ----- TESTS -----

    describe('Registration\n', () => {
        
        describe('INVALID\n', () => {
            describe('Username', () => {

                describe('is taken', () => {
                    it('400 with an explanatory error message', async () => {
                        const {body, status} = await supertest(app)
                                    .post(path + '/register')
                                    .set(headersNoAuth)
                                    .send(Olga)
                        
                        expect(status).toBe(400)
                        expect(body.message).toBe("User already exists")
                    })
                })
    
                describe('too short', () => {
                    it('400 with an explanatory error message', async () => {
                        const {body, status} = await supertest(app)
                                    .post(path + '/register')
                                    .set(headersNoAuth)
                                    .send({
                                        username: 'Olg',
                                        email: Olga.email,
                                        password: Olga.password
                                    })
                        
                        expect(status).toBe(400)
                        expect(body.message).toBe("\"username\" length must be at least 4 characters long")
                    })
                })
    
                describe('too long', () => {
                    it('400 with an explanatory error message', async () => {
                        const {body, status} = await supertest(app)
                                    .post(path + '/register')
                                    .set(headersNoAuth)
                                    .send({
                                        username: 'OlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlgaOlga+1',
                                        email: Olga.email,
                                        password: Olga.password
                                    })
                        
                        expect(status).toBe(400)
                        expect(body.message).toBe("\"username\" length must be less than or equal to 256 characters long")
                    })
                })
    
                describe('is missing', () => {
                    it('400 with an explanatory error message', async () => {
                        const {body, status} = await supertest(app)
                                    .post(path + '/register')
                                    .set(headersNoAuth)
                                    .send({
                                        email: Olga.email,
                                        password: Olga.password
                                    })
                        
                        expect(status).toBe(400)
                        expect(body.message).toBe("\"username\" is required")
                    })
                })
            })
           
            describe('Password', () => {
    
                describe('too short', () => {
                    it('400 with an explanatory error message', async () => {
                        const {body, status} = await supertest(app)
                                    .post(path + '/register')
                                    .set(headersNoAuth)
                                    .send({
                                        username: Olga.username,
                                        email: Olga.email,
                                        password: "12345"
                                    })
                        
                        expect(status).toBe(400)
                        expect(body.message).toBe("\"password\" length must be at least 6 characters long")
                    })
                })
    
                describe('too long', () => {
                    it('400 with an explanatory error message', async () => {
                        const {body, status} = await supertest(app)
                                    .post(path + '/register')
                                    .set(headersNoAuth)
                                    .send({
                                        username: Olga.username,
                                        email: Olga.email,
                                        password: "1234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678123456781234567812345678+1"
                                    })
                        
                        expect(status).toBe(400)
                        expect(body.message).toBe("\"password\" length must be less than or equal to 1024 characters long")
                    })
                })
    
                describe('is missing', () => {
                    it('400 with an explanatory error message', async () => {
                        const {body, status} = await supertest(app)
                                    .post(path + '/register')
                                    .set(headersNoAuth)
                                    .send({
                                        username: Olga.username,
                                        email: Olga.email
                                    })
                        
                        expect(status).toBe(400)
                        expect(body.message).toBe("\"password\" is required")
                    })
                })
            })
    
            describe('Email', () => {
    
                describe('is taken', () => {
                    it('400 with an explanatory error message', async () => {
                        const {body, status} = await supertest(app)
                                    .post(path + '/register')
                                    .set(headersNoAuth)
                                    .send({
                                        username: "Nick",
                                        email: Olga.email,
                                        password: Olga.password
                                    })
                        
                        expect(status).toBe(400)
                        expect(body.message).toBe("User already exists")
                    })
                })
    
                describe('too short', () => {
                    it('400 with an explanatory error message', async () => {
                        const {body, status} = await supertest(app)
                                    .post(path + '/register')
                                    .set(headersNoAuth)
                                    .send({
                                        username: "Nick",
                                        email: "m@d.t",
                                        password: Olga.password
                                    })
                        
                        expect(status).toBe(400)
                        expect(body.message).toBe("\"email\" length must be at least 6 characters long")
                    })
                })

                describe('not formatted correctly', () => {
                    it('400 with an explanatory error message', async () => {
                        const {body, status} = await supertest(app)
                                    .post(path + '/register')
                                    .set(headersNoAuth)
                                    .send({
                                        username: "Nick",
                                        email: "nick@cloudtv",
                                        password: Olga.password
                                    })
                        
                        expect(status).toBe(400)
                        expect(body.message).toBe("\"email\" must be a valid email")
                    })
                })
    
                describe('too long', () => {
                    it('400 with an explanatory error message', async () => {
                        const {body, status} = await supertest(app)
                                    .post(path + '/register')
                                    .set(headersNoAuth)
                                    .send({
                                        username: "Nick",
                                        email: "nicknicknicknicknicknicknicknicknicknicknicknicknicknicknicknick+1@cloud.tv",
                                        password: Olga.password
                                    })
                        
                        expect(status).toBe(400)
                        expect(body.message).toBe("\"email\" must be a valid email")
                    })
                })
    
                describe('is missing', () => {
                    it('400 with an explanatory error message', async () => {
                        const {body, status} = await supertest(app)
                                    .post(path + '/register')
                                    .set(headersNoAuth)
                                    .send({
                                        username: "Nick",
                                        email: "nicknicknicknicknicknicknicknicknicknicknicknicknicknicknicknick+1@cloud.tv",
                                        password: Olga.password
                                    })
                        
                        expect(status).toBe(400)
                        expect(body.message).toBe("\"email\" must be a valid email")
                    })
                })
            })
        })

        describe('VALID\n', () => {
            it('should return a User payload', async () => {
                    const payload = {
                        username: "Nick",
                        email: "nick@cloud.tv",
                        password: "123456123"
                    }

                    const {body, status} = await supertest(app)
                                .post(path + '/register')
                                .set(headersNoAuth)
                                .send(payload)
                    
                    expect(status).toBe(200)
                    expect(body.username).toBe(payload.username)
                    expect(body.email).toBe(payload.email)
                    expect(body.password !== payload.password).toBe(true)
            })
        })
    })

    describe('Login \n', () => {
        describe('INVALID\n', () => {
            describe('email', () => {
                it('400 with an explanatory error message', async () => {
                    const {body, status} = await supertest(app)
                                .post(path + '/login')
                                .set(headersNoAuth)
                                .send({
                                    email: "nick+1@cloud.tv",
                                    password: "123456123"
                                })
                    
                    expect(status).toBe(400)
                    expect(body.message).toBe("Your credentials do not match our records")
                })
            })
            
            describe('password', () => {
                it('400 with an explanatory error message', async () => {
                    const {body, status} = await supertest(app)
                                .post(path + '/login')
                                .set(headersNoAuth)
                                .send({
                                    email: "nick@cloud.tv",
                                    password: "123456123+1"
                                })
                    
                    expect(status).toBe(400)
                    expect(body.message).toBe("Your credentials do not match our records")
                })
            })
        })

        describe('VALID\n', () => {
            it('should return a signed access token', async () => {
                const {body, status} = await supertest(app)
                                .post(path + '/login')
                                .set(headersNoAuth)
                                .send({
                                    email: "nick@cloud.tv",
                                    password: "123456123"
                                })
                    
                    expect(status).toBe(200)
                    authorisation['auth-token'] = body['auth-token']
            })
        })
    })

})