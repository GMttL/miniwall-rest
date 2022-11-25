const {createServer} = require('./server')

const app = createServer()

app.listen(3000, () => {
    console.log('Server is running...')
})