import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import { secret } from '../config/environment.js'
import { NotAuthorized } from '../lib/errors.js'


export default function secureRoute(req, res, next) {
  const rawToken = req.headers.authorization
  if (!rawToken || !rawToken.startsWith('Bearer')) {
    throw new NotAuthorized()
  }
  const token = rawToken.replace('Bearer ', '')

  jwt.verify(token, secret, async (err, payload) => {
    if (err) {
      throw new NotAuthorized()
    }
    const user = await User.findById(payload.userId)

    if (!user) {
      throw new NotAuthorized()
    }
    req.currentUser = user
    next()
  })
}
