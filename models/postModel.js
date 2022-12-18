import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: 'https://via.placeholder.com/600x800.png' },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
})

export default mongoose.model('Post', postSchema)
