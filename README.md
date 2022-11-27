# Academic Declaration

## I have read and understood the sections of plagiarism in the College Policy on assessment offences and confirm that the work is my own, with the work of others clearly acknowledged. I give my permission to submit my report to the plagiarism testing database that the College is using and test it using plagiarism detection software, search engines, or meta-searching software.

</br></br>

# Commands

- npm run test -- will run all tests suites in reverse alphabetical order
- npm start -- will start the app on local port 3000
- npm run dev -- will start the app using nodemon for dynamic re-interpretation

</br></br>

# Endpoints

### User Auth

- POST /api/user/register
- POST /api/user/login

### Posts

- POST /api/post/
- GET /api/post/
- GET /api/post/:ID
- PATCH /api/post/:ID
- DELETE /api/post/:ID

### Comments

- POST /api/comment/:ID

### Likes

- POST /api/like/:ID

</br></br>

# Example Usage

## User Auth

    POST /api/user/register
        content-type: application/json
        {
            username: "John",
            email: "john123@email.com",
            password: "password"
        }


    POST /api/user/login
        content-type: application/json
        {
            email: "john123@email.com",
            password: "password"
        }

## Posts

    POST /api/post/
        content-type: application/json
        auth-token: token
        {
            title: "title",
            description: "description",
            text: "text"
        }

    GET /api/post/
        auth-token: token

    GET /api/post/:ID
        auth-token: token

    PATCH /api/post/:ID
        content-type: application/json
        auth-token: token
        {
            title: "new title", (optional)
            description: "new description", (optional)
            text: "new text" (optional)
        }

    DELETE /api/post/:ID
        auth-token: token

## Comments

    POST /api/comment/:ID
        content-type: application/json
        auth-token: token
        {
            text: "comment text"
        }

## Likes

    POST /api/like/:ID
        auth-token: token
