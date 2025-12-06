import { prismaClient } from '@/prisma_connection'
import { Request, Response, NextFunction } from 'express'
import { NotFoundException } from '@/exceptions/not_found'
import { BadRequestsException } from '@/exceptions/bad_request'
import { ErrorCodes } from '@/exceptions/root'

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        // Use the prismaClient directly without transaction for now
        const cartItems = await prismaClient.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            }
        })

        if (cartItems.length === 0) {
            throw new BadRequestsException('Cart is empty', ErrorCodes.INTERNAL_EXCEPTION)
        }

        const price = cartItems.reduce((prev: number, current) => {
            return prev + (current.quantity * Number(current.product.price))
        }, 0)

        const address = await prismaClient.address.findFirst({
            where: {
                id: req.user.defaultShippingAddress!
            }
        })

        if (!address) {
            throw new NotFoundException('Shipping address not found', ErrorCodes.ADDRESS_NOT_FOUND)
        }

        // Format address string
        const formattedAddress = `${address.lineOne}${address.lineTwo ? ', ' + address.lineTwo : ''}, ${address.city}, ${address.country} - ${address.pincode}`

        // Create order with products in a single transaction
        const order = await prismaClient.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: formattedAddress,
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                },
                event: true
            }
        })

        // Create initial order event
        await prismaClient.orderEvent.create({
            data: {
                orderId: order.id,
                status: 'PENDING'
            }
        })

        // Clear cart items
        await prismaClient.cartItem.deleteMany({
            where: {
                userId: req.user.id
            }
        })

        res.status(201).json({
            success: true,
            order
        })
    } catch (error) {
        next(error)
    }
}

export const listOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        const orders = await prismaClient.order.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                },
                event: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.json({
            success: true,
            count: orders.length,
            orders
        })
    } catch (error) {
        next(error)
    }
}

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        const orderId = +req.params.id

        // Find order and check ownership
        const order = await prismaClient.order.findFirst({
            where: {
                id: orderId,
                userId: req.user.id
            },
            include: {
                event: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        })

        if (!order) {
            throw new NotFoundException('Order not found', ErrorCodes.PRODUCT_NOT_FOUND)
        }

        // Check if order can be cancelled
        const latestStatus = order.event[0]?.status
        if (latestStatus === 'DELIVERED' || latestStatus === 'CANCELED') {
            throw new BadRequestsException(
                `Cannot cancel order with status: ${latestStatus}`,
                ErrorCodes.INTERNAL_EXCEPTION
            )
        }

        // Create cancel event
        await prismaClient.orderEvent.create({
            data: {
                orderId: order.id,
                status: 'CANCELED'
            }
        })

        res.json({
            success: true,
            message: 'Order cancelled successfully'
        })
    } catch (error) {
        next(error)
    }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        const orderId = +req.params.id

        const order = await prismaClient.order.findFirst({
            where: {
                id: orderId,
                userId: req.user.id
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                },
                event: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })

        if (!order) {
            throw new NotFoundException('Order not found', ErrorCodes.PRODUCT_NOT_FOUND)
        }

        res.json({
            success: true,
            order
        })
    } catch (error) {
        next(error)
    }
}

export const listAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        const skip = parseInt(req.query.skip as string) || 0
        const take = 10
        const status = req.query.status as string

        const whereClause: any = {}
        if (status) {
            whereClause.event = {
                some: {
                    status: status as any
                }
            }
        }

        const [orders, totalCount] = await Promise.all([
            prismaClient.order.findMany({
                where: whereClause,
                skip,
                take,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    products: {
                        include: {
                            product: true
                        }
                    },
                    event: {
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: 1
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prismaClient.order.count({ where: whereClause })
        ])

        res.json({
            success: true,
            count: orders.length,
            totalCount,
            skip,
            orders
        })
    } catch (error) {
        next(error)
    }
}

export const changeOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        const orderId = +req.params.id
        const { status } = req.body

        if (!status) {
            throw new BadRequestsException('Status is required', ErrorCodes.INTERNAL_EXCEPTION)
        }

        const validStatuses = ['PENDING', 'ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED']
        if (!validStatuses.includes(status)) {
            throw new BadRequestsException('Invalid status', ErrorCodes.INTERNAL_EXCEPTION)
        }

        const order = await prismaClient.order.findUnique({
            where: { id: orderId }
        })

        if (!order) {
            throw new NotFoundException('Order not found', ErrorCodes.PRODUCT_NOT_FOUND)
        }

        // Create new order event with the status
        await prismaClient.orderEvent.create({
            data: {
                orderId: order.id,
                status: status as any
            }
        })

        // Fetch updated order
        const updatedOrder = await prismaClient.order.findUnique({
            where: { id: orderId },
            include: {
                products: {
                    include: {
                        product: true
                    }
                },
                event: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })

        res.json({
            success: true,
            order: updatedOrder
        })
    } catch (error) {
        next(error)
    }
}