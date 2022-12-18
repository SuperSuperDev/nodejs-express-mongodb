import express from 'express'
import secureRoute from '../middleware/secureRoute.js'

import userController from '../controllers/usersController.js'

const router = express.Router()

//* User routes
router.route('/register').post(userController.register)

router.route('/login').post(userController.login)

router.route('/users').get(userController.list)

export default router
