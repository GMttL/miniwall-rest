const {createServer, connectDB} = require('./utils/server')

const app = createServer()


app.listen(3000, () => {
    connectDB()
    console.log('Server is running...')
})