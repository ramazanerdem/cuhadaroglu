import { Request, Response, NextFunction } from 'express'
import Product from '../models/product.model.ts'
import Category from '../models/category.model.ts'

// Ürünleri getir (pagination, search, filter)
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const search = req.query.search as string
    const category = req.query.category as string

    const skip = (page - 1) * limit

    // Filtreleme nesnesi oluştur
    let filter: any = {}

    // Kategori filtresi
    if (category) {
      filter.category = category
    }

    // Arama filtresi (ürün adında arama)
    if (search) {
      filter.name = {
        $regex: search,
        $options: 'i', // case-insensitive
      }
    }

    // Ürünleri getir ve kategori bilgilerini populate et
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Toplam ürün sayısı
    const totalProducts = await Product.countDocuments(filter)
    const totalPages = Math.ceil(totalProducts / limit)

    res.status(200).json({
      success: true,
      message: 'Ürünler başarıyla getirildi',
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Yeni ürün oluştur
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, categoryId } = req.body

    // Gerekli alanlar kontrolü
    if (!name || !price || !categoryId) {
      const error = new Error(
        'Ürün adı, fiyat ve kategori gereklidir'
      ) as Error & { status: number }
      error.status = 400
      throw error
    }

    // Fiyat kontrolü
    if (price < 0) {
      const error = new Error('Fiyat negatif olamaz') as Error & {
        status: number
      }
      error.status = 400
      throw error
    }

    // Kategori varlığı kontrolü
    const categoryExists = await Category.findById(categoryId)
    if (!categoryExists) {
      const error = new Error('Belirtilen kategori bulunamadı') as Error & {
        status: number
      }
      error.status = 404
      throw error
    }

    // Yeni ürün oluştur
    const product = await Product.create({
      name: name.trim(),
      price: parseFloat(price),
      category: categoryId,
    })

    // Oluşturulan ürünü kategori bilgisiyle birlikte getir
    const populatedProduct = await Product.findById(product._id).populate(
      'category',
      'name'
    )

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla oluşturuldu',
      data: {
        product: populatedProduct,
      },
    })
  } catch (error) {
    next(error)
  }
}
