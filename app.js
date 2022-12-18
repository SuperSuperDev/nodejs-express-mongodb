import express from 'express'
import cors from 'cors'
import logger from './middleware/logger.js'
import router from './views/router.js'
import errorHandler from './middleware/errorHandler.js'
import dotenv from 'dotenv'
dotenv.config()

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'

const app = express()

app.use(express.json())

const corsOptions = {
  origin: clientUrl,
}
app.use(cors(corsOptions))

app.use(logger)

app.use('/api', router)

app.use(errorHandler)

export default app
