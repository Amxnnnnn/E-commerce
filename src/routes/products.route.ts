import { createProduct, deleteProduct, getProductById, listProduct, updateProduct, searchProduct } from '@/controller/Product.controller'
import { errorHandler } from '@/error-handler.validator'
import adminMiddleware from '@/middleware/admin.mid'
import { authMiddleware } from '@/middleware/auth.mid'
import { Router } from 'express'

const productRoutes: Router = Router()

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products by name, description, or tags
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip for pagination
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records to return
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 searchQuery:
 *                   type: string
 *                   example: laptop
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 totalCount:
 *                   type: integer
 *                   example: 12
 *                 skip:
 *                   type: integer
 *                   example: 0
 *                 take:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Search query is required
 *       401:
 *         description: Unauthorized
 */
productRoutes.get('/search', [authMiddleware], errorHandler(searchProduct))

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - tags
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               description:
 *                 type: string
 *                 example: High-performance laptop
 *               price:
 *                 type: number
 *                 example: 999.99
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["electronics", "computers"]
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Admin access required
 */
productRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createProduct))

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List all products with pagination (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 25
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized - Admin access required
 */
productRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listProduct))

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - Admin access required
 */
productRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct))

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - Admin access required
 */
productRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct))

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - Admin access required
 */
productRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getProductById))

export default productRoutes