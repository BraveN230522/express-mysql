// import { USERS } from './db'
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
// import { route } from './routes'
import multer from 'multer'
import { route } from './routes'
// import bodyParser from 'body-parser'

dotenv.config()

const app: Express = express()
const port = process.env.PORT
const upload = multer()

// for parsing application/json
app.use(express.json())

// for parsing application/xwww-
app.use(express.urlencoded({ extended: true }))

// for parsing multipart/form-data
app.use(upload.single('undefined'))
app.use(express.static('public'))

app.use(morgan('combined'))
route(app)

// app.get('/users', function (req, res) {
//   res.status(200)
//   res.json(USERS)
// })

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
