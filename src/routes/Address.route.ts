import { Router } from 'express'
import { errorHandler } from '@/error-handler.validator'
import { authMiddleware } from '@/middleware/auth.mid'
import { validate } from '@/middleware/validate.mid'
import { AddressSchema, updateUserSchema } from '@/validator/auth.validator'
import { addAddress, deleteAddress, listAddress, updateUser } from '@/controller/Address.controller'

const userRoutes: Router = Router()

// User update route
userRoutes.put('/', [authMiddleware, validate(updateUserSchema)], errorHandler(updateUser))

// Address routes - authenticated users can manage their own addresses
userRoutes.post('/address', [authMiddleware, validate(AddressSchema)], errorHandler(addAddress))
userRoutes.delete('/address/:id', authMiddleware, errorHandler(deleteAddress))
userRoutes.get('/address', authMiddleware, errorHandler(listAddress))

export default userRoutes