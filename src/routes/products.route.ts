import { createProduct, deleteProduct, getProductById, listProduct, updateProduct } from '@/controller/Product.controller'
import { errorHandler } from '@/error-handler.validator'
import adminMiddleware from '@/middleware/admin.mid'
import { authMiddleware } from '@/middleware/auth.mid'
import {Router} from 'express'

const productRoutes:Router = Router()

productRoutes.post('/',[authMiddleware,adminMiddleware],errorHandler(createProduct))
productRoutes.put('/:id',[authMiddleware,adminMiddleware],errorHandler(updateProduct))
productRoutes.delete('/:id',[authMiddleware,adminMiddleware],errorHandler(deleteProduct))
productRoutes.get('/',[authMiddleware,adminMiddleware],errorHandler(listProduct))
productRoutes.get('/:id',[authMiddleware,adminMiddleware],errorHandler(getProductById))

export default productRoutes