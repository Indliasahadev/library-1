if(process.env.NODE_ENV !== 'production'){
    // require('dotenv').parse()
    const dotenv = require('dotenv')
    const result = dotenv.config()

    if (result.error) {
      throw result.error
    }
    
    console.log(result.parsed)

    // const buffer = Buffer.from('DATABASE_URL=mongodb://localhost/library')
    const config = dotenv.parse(result)
}

const express = require('express')
const cookieParser = require('cookie-parser')
const serverLog = require('easy-log')('server: server')
const cors = require('cors')
const mongoose = require('mongoose')
const { Temporal } = require('@js-temporal/polyfill')

const bookRouter = require('./routes/book')

const app = express()

app.use((req, res, next) =>{
    serverLog(`${req.method} - ${req.originalUrl}`)
    next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', ()=> console.log('Connected to mongoose.'))

app.use('/books', bookRouter)

// app.get('/', (req, res)=>{
//     res.send('This is Home Page-> Server side')
// })

// app.post('/', (req, res) => {
//     const Book = new Book
//     console.log(req)
//     res.send(req.body.title)
// })

// app.post('*', (req, res)=>{
//     console.log(req.body)
//     res.send('All other requests!!!')
// })

app.listen(process.env.PORT || 9000)