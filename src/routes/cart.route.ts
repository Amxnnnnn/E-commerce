import { Router } from 'express'
import { errorHandler } from "../error-handler.validator"
import { authMiddleware } from '@/middleware/auth.mid'
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controller/cart.controller"

const cartRoutes: Router = Router()

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cartItem:
 *                   type: object
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
cartRoutes.post('/', [authMiddleware], errorHandler(addItemToCart))

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Get user's cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 totalAmount:
 *                   type: number
 *                   example: 2999.97
 *                 cartItems:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
cartRoutes.get('/', [authMiddleware], errorHandler(getCart))

/**
 * @swagger
 * /api/carts/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Item removed from cart
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized
 */
cartRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart))

/**
 * @swagger
 * /api/carts/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cartItem:
 *                   type: object
 *       400:
 *         description: Invalid quantity
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized
 */
cartRoutes.put('/:id', [authMiddleware], errorHandler(changeQuantity))

export default cartRoutes