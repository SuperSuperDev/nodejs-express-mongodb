import Post from '../models/postModel.js'
import User from '../models/userModel.js'
import { NotAuthorized, NotFound } from '../lib/errors.js'

//* Get all posts
async function getAllPosts(req, res, next) {
  try {
    const posts = await Post.find()
    res.status(200).json(posts)
  } catch (e) {
    next(e)
  }
}

//* Get a single post
async function getSinglePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      throw new NotFound('Post not found.')
    }
    res.status(200).json(post)
  } catch (e) {
    next(e)
  }
}

//* Create a post
async function createPost(req, res, next) {
  req.body.user = req.currentUser

  try {
    const user = await User.findById(req.currentUser._id)
    if (!user) {
      throw new NotFound('User not found.')
    }
    const newPost = await Post.create({ ...req.body, user: user._id })
    res.status(201).json(newPost)
  } catch (e) {
    next(e)
  }
}

//* Update a post
async function updatePost(req, res, next) {
  try {
    const currentUserId = req.currentUser._id
    const post = await Post.findById(req.params.id)

    if (!post) {
      throw new NotFound('Post not found.')
    }
    if (!currentUserId.equals(post.user)) {
      throw new NotAuthorized('You are not authorized to edit this post.')
    }
    post.set(req.body)
    post.save()
    res.status(202).json(post)
  } catch (e) {
    next(e)
  }
}

//* Delete a post
async function deletePost(req, res, next) {
  try {
    const currentUserId = req.currentUser._id
    const post = await Post.findById(req.params.id)

    if (!post) {
      throw new NotFound('Post not found.')
    }
    if (!currentUserId.equals(post.user)) {
      throw new NotAuthorized('You are not authorized to delete this post.')
    }
    await post.deleteOne()
    res.sendStatus(204)
  } catch (e) {
    next(e)
  }
}

export default {
  getAllPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
}
