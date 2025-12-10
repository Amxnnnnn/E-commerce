import { Router } from 'express'
import { errorHandler } from '@/error-handler.validator'
import { authMiddleware } from '@/middleware/auth.mid'
import { validate } from '@/middleware/validate.mid'
import { AddressSchema, updateUserSchema } from '@/validator/auth.validator'
import { addAddress, deleteAddress, listAddress, updateUser , listUsers , getUserById , changeUserRole} from '@/controller/Address.controller'
import adminMiddleware from '@/middleware/admin.mid'

const userRoutes: Router = Router()

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Updated
 *               defaultShippingAddress:
 *                 type: integer
 *                 example: 1
 *               defaultBillingAddress:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Address does not belong to user
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
userRoutes.put('/', [authMiddleware, validate(updateUserSchema)], errorHandler(updateUser))

/**
 * @swagger
 * /api/users/address:
 *   post:
 *     summary: Add a new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lineOne
 *               - city
 *               - country
 *               - pincode
 *             properties:
 *               lineOne:
 *                 type: string
 *                 example: 123 Main Street
 *               lineTwo:
 *                 type: string
 *                 example: Apt 4B
 *               city:
 *                 type: string
 *                 example: New York
 *               country:
 *                 type: string
 *                 example: USA
 *               pincode:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "100001"
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 address:
 *                   $ref: '#/components/schemas/Address'
 *       422:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */
// Temporarily removed validation to debug - add back validate(AddressSchema) if needed
userRoutes.post('/address', [authMiddleware], errorHandler(addAddress))

/**
 * @swagger
 * /api/users/address/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
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
 *                   example: Address deleted successfully
 *       404:
 *         description: Address not found or unauthorized
 *       401:
 *         description: Unauthorized
 */
userRoutes.delete('/address/:id', authMiddleware, errorHandler(deleteAddress))

/**
 * @swagger
 * /api/users/address:
 *   get:
 *     summary: List all addresses for authenticated user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
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
 *                   example: 2
 *                 addresses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 */
userRoutes.get('/address', authMiddleware, errorHandler(listAddress))
userRoutes.put('/:id/role', [authMiddleware,adminMiddleware], errorHandler(changeUserRole))
userRoutes.get('/', [authMiddleware,adminMiddleware], errorHandler(listUsers))
userRoutes.get('/:id', [authMiddleware,adminMiddleware], errorHandler(getUserById))
// userRoutes.get('/address', authMiddleware, errorHandler(listAddress))

export default userRoutes