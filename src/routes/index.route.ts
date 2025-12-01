import { Router } from 'express';
import authRoutes from './auth.route'
import productRoutes from './products.route';

const rootRouter:Router = Router()

rootRouter.use('/auth',authRoutes)
rootRouter.use('/products',productRoutes)

export default rootRouter