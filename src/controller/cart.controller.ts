import { NotFoundException } from '@/exceptions/not_found'
import { BadRequestsException } from '@/exceptions/bad_request'
import { ErrorCodes } from '@/exceptions/root'
import { prismaClient } from '@/prisma_connection'
import { ChangeQuantitySchema, CreateCartSchema } from '@/validator/auth.validator'
import { Request, Response, NextFunction } from 'express'

export const addItemToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        const validatedDate = CreateCartSchema.parse(req.body)

        let product

        try {
            product = await prismaClient.product.findFirstOrThrow({
                where: {
                    id: validatedDate.productId
                }
            })
        } catch (err) {
            throw new NotFoundException("Product not found", ErrorCodes.PRODUCT_NOT_FOUND)
        }

        // Check if item already exists in cart
        const existingCartItem = await prismaClient.cartItem.findFirst({
            where: {
                userId: req.user.id,
                productId: product.id
            }
        })

        let cart
        if (existingCartItem) {
            // Update quantity if item already exists
            cart = await prismaClient.cartItem.update({
                where: {
                    id: existingCartItem.id
                },
                data: {
                    quantity: existingCartItem.quantity + validatedDate.quantity
                },
                include: {
                    product: true
                }
            })
        } else {
            // Create new cart item
            cart = await prismaClient.cartItem.create({
                data: {
                    userId: req.user.id,
                    productId: product.id,
                    quantity: validatedDate.quantity
                },
                include: {
                    product: true
                }
            })
        }

        res.status(201).json({
            success: true,
            cartItem: cart
        })
    } catch (error) {
        next(error)
    }
}

export const deleteItemFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        const cartItemId = +req.params.id

        // Check if cart item exists and belongs to user
        const cartItem = await prismaClient.cartItem.findFirst({
            where: {
                id: cartItemId,
                userId: req.user.id
            }
        })

        if (!cartItem) {
            throw new NotFoundException('Cart item not found or unauthorized', ErrorCodes.PRODUCT_NOT_FOUND)
        }

        await prismaClient.cartItem.delete({
            where: {
                id: cartItemId
            }
        })

        res.json({
            success: true,
            message: 'Item removed from cart'
        })
    } catch (error) {
        next(error)
    }
}

export const changeQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        const cartItemId = +req.params.id
        const validatedDate = ChangeQuantitySchema.parse(req.body)

        // Check if cart item exists and belongs to user
        const cartItem = await prismaClient.cartItem.findFirst({
            where: {
                id: cartItemId,
                userId: req.user.id
            }
        })

        if (!cartItem) {
            throw new NotFoundException('Cart item not found or unauthorized', ErrorCodes.PRODUCT_NOT_FOUND)
        }

        const updatedCart = await prismaClient.cartItem.update({
            where: {
                id: cartItemId
            },
            data: {
                quantity: validatedDate.quantity
            },
            include: {
                product: true
            }
        })

        res.json({
            success: true,
            cartItem: updatedCart
        })
    } catch (error) {
        next(error)
    }
}

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        const cart = await prismaClient.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const totalAmount = cart.reduce((total: number, item: typeof cart[0]) => {
            return total + (item.quantity * Number(item.product.price))
        }, 0)

        res.json({
            success: true,
            count: cart.length,
            totalAmount,
            cartItems: cart
        })
    } catch (error) {
        next(error)
    }
}