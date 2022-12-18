# Node, Express, MongoDB

```bash
npm init
```

## Dependencies

### install dependencies

```bash
npm install express \
  mongoose \
  body-parser \
  cors \
  dotenv \
  bcrypt \
  jsonwebtoken \
  mongoose \
  mongoose-hidden \
  mongoose-unique-validator
```

### install dev dependencies

```bash
npm install --save-dev nodemon \
  eslint \
  @babel/core \
  @babel-eslint-parser \
  babel-core \
  concurrently \
  nodemon
```

## Mongo

### Mongo init script

Create db/init-mongo.js

```js
// @ts-ignore
db.createUser({
  user: 'Admin1',
  pwd: 'Admin1',
  roles: [
    {
      role: 'readWrite',
      db: 'mevndb',
    },
  ],
})
```

### Mongo Docker Compose

create docker-compose.yml

```yml
name: mevn

services:
  database:
    image: 'mongo'
    container_name: 'mevn-mongo-container'
    environment:
      - MONGO_INITDB_DATABASE=mevn-db
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=secret
    volumes:
      - ./db/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
      - ./db/mongo-volume:/data/db
    ports:
      - '27017-27019:27017-27019'
    networks:
      - mevn-network

networks:
  mevn-network:
    driver: bridge
```

run docker-compose

```bash
docker-compose up -d
```

## Config

Create config/enviroment.js

```js
import dotenv from 'dotenv'
dotenv.config()
export const env = process.env.NODE_ENV || 'development'

export const dbURI = process.env.DB_URI || 'mongodb://localhost:27018/mevn-db'

export const port = process.env.SERVER_PORT || 4000

export const secret =
  process.env.SECRET || 'myrandomsecretfishpengiraffeclaxonrenewedexon'
```

## Database Connection

Create db/connectToDB.js

```js
import mongoose from 'mongoose'
import { dbURI } from '../config/environment.js'

//* Connecting to the database
export default function connectToDb() {
  console.log('dbURI', dbURI)
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
  // @ts-ignore
  return mongoose.connect(dbURI, options)
}
```

## Middleware

### Error Handling

Create errorHandlers.js

```js
function errorHandler(err, req, res, next) {
  console.log('There was an error')
  console.log(err.name)
  console.log(err)

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid parameter given' })
  }

  if (err.name === 'NotFound') {
    return res
      .status(err.status)
      .json({ error: { name: err.name, message: err.message } })
  }

  if (err.name === 'NotValid') {
    return res
      .status(err.status)
      .json({ message: 'There was an error, Details provided are not valid' })
  }

  if (err.name === 'NotAuthorized') {
    return res
      .status(err.status)
      .send({ error: { name: err.name, message: err.message } })
  }

  if (err.name === 'ValidationError') {
    const errors = {}
    for (const key in err.errors) {
      errors[key] = err.errors[key].message
    }
    return res.status(422).json({
      message: 'Form Validation Error',
      errors,
    })
  }

  res.sendStatus(500)
  next(err)
}

export default errorHandler
```

Create lib/errors.js

```js
export class NotFound extends Error {
  constructor(message) {
    super()
    this.name = 'NotFound'
    this.message = message
    this.status = 404
  }
}

export class NotValid extends Error {
  constructor() {
    super()
    this.name = 'NotValid'
    this.status = 400
  }
}

export class NotAuthorized extends Error {
  constructor(message) {
    super()
    this.name = 'NotAuthorized'
    this.message = message ? message : 'Unauthorized'
    this.status = 401
  }
}
```

### Logging

Create logger.js

```js
function logger(req, res, next) {
  console.log(`Incoming Request ${req.method} for URL ${req.url} ${Date.now()}`)
  console.log(` Body: ${JSON.stringify(req.body, null, 2)}`)
  next()
}
export default logger
```

## App

Create app.js

```js
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
```

## Routes

Create router.js

```js
import express from 'express'
import secureRoute from '../middleware/secureRoute.js'

import userController from '../controllers/usersController.js'

const router = express.Router()

//* User routes
router.route('/register').post(userController.register)

router.route('/login').post(userController.login)

export default router
```

## Controllers

Create usersController.js

```js
import User from '../models/userModel.js'
import { NotValid } from '../lib/errors.js'
import { secret } from '../config/environment.js'
import jwt from 'jsonwebtoken'

//* Registering a user
async function register(req, res, next) {
  try {
    const newUser = await User.create(req.body)
    res.status(201).json(newUser)
  } catch (e) {
    next(e)
  }
}

//* Logging-in  registered user
async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      throw new NotValid(
        'Username and/or password not found. Please try again.'
      )
    }
    const isValidPw = user.validatePassword(req.body.password)
    if (!isValidPw) {
      throw new NotValid(
        'Username and/or password not found. Please try again.'
      )
    }

    // Creating a jwt and send to user
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '12h' })
    const likes = user.likes
    const playlists = user.playlists

    res.status(202).json({ message: 'Login Success!', token, likes, playlists })
  } catch (e) {
    next(e)
  }
}

export default {
  login,
  register,
}
```

## Models and Schemas

Create userModel.js

```js
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import mongooseHidden from 'mongoose-hidden'
import bcrypt from 'bcrypt'
import userSchema from './userSchema.js'

//* Hashing the password
userSchema.pre('save', function encryptPassword(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  }
  next()
})

//* Comparing hashed password given with that stored in the DB
userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password)
}

//* Virtual password
userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })
userSchema.pre('validate', function checkPassword(next) {
  if (
    this.isModified('password') &&
    this.password !== this._passwordConfirmation
  ) {
    this.invalidate('passwordConfirmation', 'should match password')
  }
  next()
})
userSchema.plugin(uniqueValidator)
userSchema.plugin(
  mongooseHidden({ defaultHidden: { password: true, email: true } })
)

export default mongoose.model('User', userSchema)
```

Create userSchema.js

```js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: {
    type: String,
    default:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  },
  about: { type: String },
})

export default userSchema
```

## Server

Create server.js

```js
import app from './app.js'
import connectToDb from './db/connectToDb.js'
import { port } from './config/environment.js'

async function startApp() {
  try {
    await connectToDb()
    console.log('Database has connected!')

    app.listen(port, () => console.log('Express is now running'))
  } catch (e) {
    console.log('Something went wrong starting express app..')
    console.log(e)
  }
}

startApp()
```

## Docker Commands

### Mongo

Connect to mongo container

```bash
docker exec -it mevn-mongo-container bash
```

Connect to mongo as Root

```bash
mongosh -u root -p secret --authenticationDatabase admin
```

Connect to mongo as database user

```bash
mongosh -u Admin1 -p Admin1 --authenticationDatabase mevn-db
```
