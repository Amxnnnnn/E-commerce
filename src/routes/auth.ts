import { signup ,login} from '../controller/auth.controller'
import {Router} from 'express'
import { validate } from "../middleware/validate";
import { signupSchema, loginSchema } from '../validator/auth.validator';

const authRoutes:Router = Router()

authRoutes.post('/signup',validate(signupSchema),signup)// zod validator
authRoutes.post('/login',validate(loginSchema),login)

export default authRoutes