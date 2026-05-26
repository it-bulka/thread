import mongoose from 'mongoose'

const MONGO_URL = process.env.MONGO_URL!

let connectPromise: Promise<typeof mongoose> | null = null

export const connectToDb = async () => {
  mongoose.set('strictQuery', true)

  if (!MONGO_URL) {
    throw new Error('No Mongo Url')
  }

  if (mongoose.connection.readyState >= 1) {
    return
  }

  if (!connectPromise) {
    connectPromise = mongoose.connect(MONGO_URL)
  }

  await connectPromise
}