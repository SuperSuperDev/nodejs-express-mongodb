import mongoose from 'mongoose'
import { dbURI } from '../config/environment.js'

//* Connecting to the database
export default function connectToDb() {
  console.log('dbURI', dbURI)
  const options = {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  }
  // @ts-ignore
  return mongoose.connect(dbURI, options)
}
