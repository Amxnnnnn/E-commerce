import { createProduct } from '@/controller/Product.controller'
import { errorHandler } from '@/error-handler.validator'
// import { authMiddleware } from '@/middleware/auth.mid'
import {Router} from 'express'

const productRoutes:Router = Router()

productRoutes.post('/',errorHandler(createProduct))

export default productRoutes