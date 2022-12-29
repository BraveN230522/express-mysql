// import { USERS } from './db'
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { route } from './routes'
import multer from 'multer'
import { myDataSource } from './configs'
// import { route } from './routes'
// import bodyParser from 'body-parser'import { DataSource } from 'typeorm'

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

// establish database connection
myDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })

// app.get('/users', function (req, res) {
//   console.log(123)
//   var sql = 'SELECT * FROM users'
//   mysqlCon.query(sql, function (err, results) {
//     if (err) throw err
//     res.send(results)
//   })
// })

route(app)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
