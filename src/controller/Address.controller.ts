import { NotFoundException } from '@/exceptions/not_found'
import { BadRequestsException } from '@/exceptions/bad_request'
import { Request, Response, NextFunction } from 'express'
import { ErrorCodes } from '@/exceptions/root'
import { prismaClient } from "../prisma_connection"
import { formatAddressWithComputedField } from '../utility/Address.formatter.utility'

export const addAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // User is already authenticated via authMiddleware
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        const { lineOne, lineTwo, city, country, pincode } = req.body;

        console.log('📍 Creating address with data:', { lineOne, lineTwo, city, country, pincode, userId: req.user.id })

        // Create address for the authenticated user
        const address = await prismaClient.address.create({
            data: {
                lineOne,
                lineTwo: lineTwo || null,
                city,
                country,
                pincode,
                userId: req.user.id
            }
        })

        console.log('✅ Address created successfully:', address)

        res.status(201).json({
            success: true,
            address: formatAddressWithComputedField(address)
        })
    } catch (error) {
        console.error('❌ Error creating address:', error)
        next(error)
    }
}

export const deleteAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        const addressId = +req.params.id;

        console.log('🗑️  Attempting to delete address:', addressId)

        // Find the address first to check ownership
        const address = await prismaClient.address.findFirst({
            where: {
                id: addressId,
                userId: req.user.id
            }
        })

        if (!address) {
            throw new NotFoundException('Address not found or unauthorized', ErrorCodes.ADDRESS_NOT_FOUND)
        }

        // Delete the address
        await prismaClient.address.delete({
            where: {
                id: addressId
            }
        })

        console.log('✅ Address deleted successfully:', addressId)

        res.json({
            success: true,
            message: 'Address deleted successfully'
        })
    } catch (error) {
        console.error('❌ Error deleting address:', error)
        next(error)
    }
}

export const listAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        console.log('📋 Fetching addresses for user:', req.user.id)

        // Get all addresses for the authenticated user
        const addresses = await prismaClient.address.findMany({
            where: {
                userId: req.user.id
            },
            orderBy: {
                created: 'desc'
            }
        })

        console.log(`✅ Found ${addresses.length} addresses`)

        res.json({
            success: true,
            count: addresses.length,
            addresses: addresses.map(formatAddressWithComputedField)
        })
    } catch (error) {
        console.error('❌ Error listing addresses:', error)
        next(error)
    }
}

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new BadRequestsException('User not authenticated', ErrorCodes.UNAUTHORIZED_EXCEPTION)
        }

        const { name, defaultShippingAddress, defaultBillingAddress } = req.body;

        console.log('👤 Updating user:', req.user.id, { name, defaultShippingAddress, defaultBillingAddress })

        // Validate shipping address if provided
        if (defaultShippingAddress) {
            try {
                const shippingAddress = await prismaClient.address.findFirstOrThrow({
                    where: {
                        id: defaultShippingAddress
                    }
                })

                if (shippingAddress.userId !== req.user.id) {
                    throw new BadRequestsException(
                        "Shipping address does not belong to user",
                        ErrorCodes.ADDRESS_DOES_NOT_BELONG
                    )
                }
            } catch (error) {
                if (error instanceof BadRequestsException) {
                    throw error;
                }
                throw new NotFoundException('Shipping address not found', ErrorCodes.ADDRESS_NOT_FOUND)
            }
        }

        // Validate billing address if provided
        if (defaultBillingAddress) {
            try {
                const billingAddress = await prismaClient.address.findFirstOrThrow({
                    where: {
                        id: defaultBillingAddress
                    }
                })

                if (billingAddress.userId !== req.user.id) {
                    throw new BadRequestsException(
                        "Billing address does not belong to user",
                        ErrorCodes.ADDRESS_DOES_NOT_BELONG
                    )
                }
            } catch (error) {
                if (error instanceof BadRequestsException) {
                    throw error;
                }
                throw new NotFoundException('Billing address not found', ErrorCodes.ADDRESS_NOT_FOUND)
            }
        }

        // Build update data object with only provided fields
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (defaultShippingAddress !== undefined) updateData.defaultShippingAddress = defaultShippingAddress;
        if (defaultBillingAddress !== undefined) updateData.defaultBillingAddress = defaultBillingAddress;

        // Update user
        const updatedUser = await prismaClient.user.update({
            where: {
                id: req.user.id
            },
            data: updateData
        })

        console.log('✅ User updated successfully:', updatedUser.id)

        // Remove password from response
        const { password, ...userWithoutPassword } = updatedUser;

        res.json({
            success: true,
            user: userWithoutPassword
        })
    } catch (error) {
        console.error('❌ Error updating user:', error)
        next(error)
    }
}