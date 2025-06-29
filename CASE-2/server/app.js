import 'dotenv/config'

import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'

import connectDB from './config/db.ts'
import errorMiddleware from './middlewares/error.middleware.ts'

import categoryRoutes from './routes/category.routes.ts'
import productRoutes from './routes/product.routes.ts'

const app = express()

// Güvenlik middlewares (en üstte)
app.use(helmet())
//add cors
app.use(cors())

// Logging middleware
app.use(morgan('dev'))

// Body parsing middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// API Routes
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/products', productRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  // server and db connection check
  const db = mongoose.connection
  const isDbConnected = db.readyState === 1

  if (isDbConnected) {
    console.log('Database connected')
  } else {
    console.log('Database not connected')
  }

  // Success sadece hem server hem database çalışıyorsa true
  const isHealthy = isDbConnected

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    db: isDbConnected,
    message: isHealthy
      ? 'Server is running'
      : 'Service unavailable - Database connection issue',
    timestamp: new Date().toISOString(),
  })
})

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Error handling middleware (en sonda)
app.use(errorMiddleware)

// Server başlatma
const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
  await connectDB()
})
