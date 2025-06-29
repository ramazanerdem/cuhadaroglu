import { Request, Response, NextFunction } from 'express'
import Category from '../models/category.model.ts'

// Tüm kategorileri getir
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'Kategoriler başarıyla getirildi',
      data: {
        categories,
        count: categories.length,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Yeni kategori oluştur
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body

    // Kategori adı kontrolü
    if (!name || name.trim() === '') {
      const error = new Error('Kategori adı gereklidir') as Error & {
        status: number
      }
      error.status = 400
      throw error
    }

    // Aynı isimde kategori var mı kontrolü
    const existingCategory = await Category.findOne({
      name: name.trim().toLowerCase(),
    })

    if (existingCategory) {
      const error = new Error(
        'Bu isimde bir kategori zaten mevcut'
      ) as Error & { status: number }
      error.status = 409
      throw error
    }

    // Yeni kategori oluştur
    const category = await Category.create({
      name: name.trim(),
    })

    res.status(201).json({
      success: true,
      message: 'Kategori başarıyla oluşturuldu',
      data: {
        category,
      },
    })
  } catch (error) {
    next(error)
  }
}
