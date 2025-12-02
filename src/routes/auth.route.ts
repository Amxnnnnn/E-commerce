import { signup ,login,me} from '../controller/auth.controller'
import {Router} from 'express'
import { validate } from "../middleware/validate.mid";
import { signupSchema, loginSchema } from '../validator/auth.validator';
import { errorHandler } from '../error-handler.validator';
import { authMiddleware } from '@/middleware/auth.mid';
import adminMiddleware from '@/middleware/admin.mid';

const authRoutes:Router = Router()

authRoutes.post('/signup',validate(signupSchema),errorHandler(signup))// zod validator
authRoutes.post('/login',validate(loginSchema),errorHandler(login))
authRoutes.get('/me',authMiddleware,errorHandler(me))

export default authRoutes