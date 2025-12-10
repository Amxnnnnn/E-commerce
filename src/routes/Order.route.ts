import { Router } from 'express'
import { errorHandler } from '@/error-handler.validator'
import { authMiddleware } from '@/middleware/auth.mid'
import adminMiddleware from '@/middleware/admin.mid'
import { createOrder, listOrder, cancelOrder, getOrderById, listAllOrders, changeOrderStatus, listUserOrders } from '@/controller/Order.controller'

const orderRoutes: Router = Router()

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create order from cart items
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   type: object
 *       400:
 *         description: Cart is empty or shipping address not set
 *       404:
 *         description: Shipping address not found
 *       401:
 *         description: Unauthorized
 */
orderRoutes.post('/', [authMiddleware], errorHandler(createOrder))

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List all orders for authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
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
 *                   example: 5
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
orderRoutes.get('/', [authMiddleware], errorHandler(listOrder))

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   type: object
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
orderRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById))

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
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
 *                   example: Order cancelled successfully
 *       400:
 *         description: Order cannot be cancelled
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
orderRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder))

/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: List all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACCEPTED, OUT_FOR_DELIVERY, DELIVERED, CANCELED]
 *         description: Filter by order status
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */
orderRoutes.get('/admin/all', [authMiddleware, adminMiddleware], errorHandler(listAllOrders))

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Change order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, ACCEPTED, OUT_FOR_DELIVERY, DELIVERED, CANCELED]
 *                 example: ACCEPTED
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized - Admin access required
 */
orderRoutes.put('/:id/status', [authMiddleware, adminMiddleware], errorHandler(changeOrderStatus))

/**
 * @swagger
 * /api/orders/user/{id}:
 *   get:
 *     summary: List orders for specific user (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: User orders retrieved successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */
orderRoutes.get('/user/:id', [authMiddleware, adminMiddleware], errorHandler(listUserOrders))

export default orderRoutes