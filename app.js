const express = require('express')
const adminRoutes = require('./routes/adminRoutes')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const db = require('./config/db')
const fileUpload = require('express-fileupload')
const app = express()

dotenv.config({path: './config/config.env'})
const Port = process.env.PORT
db();
app.use(express.static(path.join(__dirname, 'public')))
app.use(fileUpload())
app.use(cors())

app.set('views', './views')
app.set('view engine', 'ejs')

app.use('/', adminRoutes)


app.listen(Port, ()=>{
    console.log(`Application running on port: ${Port}`)
})