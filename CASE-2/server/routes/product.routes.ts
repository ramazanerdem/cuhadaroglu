import { Router } from 'express'
import {
  getProducts,
  createProduct,
} from '../controllers/product.controllers.ts'

const productRouter = Router()

// GET /api/v1/products - Ürünleri getir (pagination, search, filter)
productRouter.get('/', getProducts)

// POST /api/v1/products - Yeni ürün oluştur
productRouter.post('/', createProduct)

export default productRouter
