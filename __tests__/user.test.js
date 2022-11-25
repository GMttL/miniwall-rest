const supertest = require('supertest')

describe('user', () => {
    
    describe('registration', () => {
        
        describe('given credentials are invalid', () => {
            describe('username', () => {

                describe('is taken', () => {
                    // TODO
                })
    
                describe('too short', () => {
                    // TODO
                })
    
                describe('too long', () => {
                    // TODO
                })
    
                describe('is missing', () => {
                    // TODO
                })
            })
           
            describe('password', () => {
    
                describe('too short', () => {
                    // TODO
                })
    
                describe('too long', () => {
                    // TODO
                })
    
                describe('is missing', () => {
                    // TODO
                })
            })
    
            describe('email', () => {
    
                describe('is taken', () => {
                    // TODO
                })
    
                describe('too short', () => {
                    // TODO
                })
    
                describe('too long', () => {
                    // TODO
                })
    
                describe('is missing', () => {
                    // TODO
                })
            })
        })

        describe('given request is valid', () => {
            it('should return a User payload', () => {
                // TODO
            })
        })
    })

    describe('login', () => {
        describe('given the credentials are invalid', () => {
            describe('username', () => {
                // TODO
            })  
            
            describe('password', () => {
                // TODO
            })
        })

        describe('given the credentials are valid', () => {
            it('should return a signed access token', () => {
                // TODO
            })
        })
    })
})