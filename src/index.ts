import dotenv from 'dotenv'
import express, { Express } from 'express'
import morgan from 'morgan'
import multer from 'multer'
import { route } from './app/routes'
import { myDataSource } from './configs'

dotenv.config()

const app: Express = express()
const port = process.env.PORT
const upload = multer()

// for parsing application/json
app.use(express.json())

// for parsing application/x-www-form-urlencoded
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

route(app)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
