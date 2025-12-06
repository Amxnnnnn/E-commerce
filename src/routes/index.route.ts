import { Router } from 'express';
import authRoutes from './auth.route'
import productRoutes from './products.route';
import userRoutes from './Address.route';
import cartRoutes from './cart.route';
import orderRoutes from './Order.route';

const rootRouter:Router = Router()

rootRouter.use('/auth',authRoutes)
rootRouter.use('/products',productRoutes)
rootRouter.use('/users',userRoutes)
rootRouter.use('/carts',cartRoutes)
rootRouter.use('/orders',orderRoutes)

export default rootRouter