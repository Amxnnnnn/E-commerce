import { signup ,login} from '../controller/auth.controller'
import {Router} from 'express'
import { validate } from "../middleware/validate";
import { signupSchema, loginSchema } from '../validator/auth.validator';
import { errorHandler } from '../error-handler';

const authRoutes:Router = Router()

authRoutes.post('/signup',validate(signupSchema),errorHandler(signup))// zod validator
authRoutes.post('/login',validate(loginSchema),errorHandler(login))

export default authRoutes