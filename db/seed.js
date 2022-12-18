import mongoose from 'mongoose'
import connectToDb from './connectToDb.js'

// * Importing the models
import User from '../models/userModel.js'
import Post from '../models/postModel.js'

// * Importing the data
import userData from './data/userData.js'
import postData from './data/postData.js'

async function seedDatabase() {
  try {
    // * Connecting to the database
    await connectToDb()
    console.log('🤖 Database has connected!')

    // * Deleting all the data
    await mongoose.connection.db.dropDatabase()
    console.log('🤖 Database has been dropped!')

    //* Seed Users
    const users = await User.create(userData)
    console.log(`🤖 ${users.length} users have been created!`)

    //* Seed Posts
    const postDataWithUser = postData.map((post) => {
      return { ...post, user: users[0]._id }
    })
    const posts = await Post.create(postDataWithUser)
    console.log(`🤖 ${posts.length} posts have been created!`)

    // * Add posts to user
    const userWithPosts = await User.findByIdAndUpdate(
      users[0]._id,
      { addedPosts: posts.map((post) => post._id) },
      { new: true, runValidators: true }
    )
    console.log(
      `🤖 ${userWithPosts?.addedPosts.length} posts have been added to user[0]!`
    )

    // * Closing the database
    await mongoose.connection.close()
    console.log('🤖 Database has been closed!')
  } catch (e) {
    console.log('🤖 Something went wrong seeding the database..')
    console.log(e)
  }
}

seedDatabase()
