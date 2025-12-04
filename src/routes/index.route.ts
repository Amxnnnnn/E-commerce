import { Router } from 'express';
import authRoutes from './auth.route'
import productRoutes from './products.route';
import userRoutes from './Address.route';

const rootRouter:Router = Router()

rootRouter.use('/auth',authRoutes)
rootRouter.use('/products',productRoutes)
rootRouter.use('/users',userRoutes)

export default rootRouter