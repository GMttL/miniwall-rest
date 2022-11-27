const {createServer, connectDB} = require('./utils/server')

const app = createServer()

connectDB()

app.listen(3000, () => {
    console.log('Server is running...')
})