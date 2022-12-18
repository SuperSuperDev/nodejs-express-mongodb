import User from '../models/userModel.js'
import { NotFound, NotValid } from '../lib/errors.js'
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
        // @ts-ignore
        'Username and/or password not found. Please try again.'
      )
    }
    // @ts-ignore
    const isValidPw = user.validatePassword(req.body.password)
    if (!isValidPw) {
      throw new NotValid(
        // @ts-ignore
        'Username and/or password not found. Please try again.'
      )
    }

    // Creating a jwt and send to user
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '12h' })

    res.status(202).json({ message: 'Login Success!', token })
  } catch (e) {
    next(e)
  }
}

async function list(req, res, next) {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (e) {
    next(e)
  }
}

// whoAmI is a function that will be used to check if a user is logged in
// and if so, return their user object
async function whoAmI(req, res, next) {
  try {
    const user = await User.findById(req.currentUser._id)
    if (!user) {
      throw new NotFound('User not found.')
    }
    res.status(200).json(user)
  } catch (e) {
    next(e)
  }
}

export default {
  login,
  register,
  list,
  whoAmI,
}
