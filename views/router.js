import express from 'express'
import secureRoute from '../middleware/secureRoute.js'

import userController from '../controllers/usersController.js'
import postsController from '../controllers/postsController.js'

const router = express.Router()

//* User routes
router.route('/register').post(userController.register)
router.route('/login').post(userController.login)
router.route('/users').get(userController.list)
router.route('/whoami').get(secureRoute, userController.whoAmI)

//* Post routes
router.route('/posts').get(postsController.getAllPosts)
router.route('/posts/:id').get(postsController.getSinglePost)
router.route('/posts').post(secureRoute, postsController.createPost)
router.route('/posts/:id').put(secureRoute, postsController.updatePost)
router.route('/posts/:id').delete(secureRoute, postsController.deletePost)

export default router
