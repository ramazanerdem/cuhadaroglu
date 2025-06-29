import { Request, Response, NextFunction } from 'express'

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error = { ...err }
    error.message = err.message

    // Mongoose hatalarını handle et
    if (err.name === 'CastError') {
      const message = `Kaynak bulunamadı. Geçersiz: ${err.path}: ${err.value}`
      error = new Error(message)
      error.status = 404
    }

    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`
      error = new Error(message)
      error.status = 400
    }

    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((val: any) => val.message)
      error = new Error(message.join(', '))
      error.status = 400
    }

    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    })
  } catch (error) {
    next(error)
  }
}

export default errorMiddleware
