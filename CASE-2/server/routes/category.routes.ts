import { Router } from 'express'
import {
  getCategories,
  createCategory,
} from '../controllers/category.controllers.ts'

const categoryRouter = Router()

// GET /api/v1/categories - Tüm kategorileri getir
categoryRouter.get('/', getCategories)

// POST /api/v1/categories - Yeni kategori oluştur
categoryRouter.post('/', createCategory)

export default categoryRouter
