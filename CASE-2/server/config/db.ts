import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const DB_URI =
      process.env.MONGO_URI || 'mongodb://localhost:27017/cuhadaroglu'
    await mongoose.connect(DB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log('Error connecting to MongoDB', error)
    process.exit(1)
  }
}

export default connectDB
