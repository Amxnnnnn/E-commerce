import { NotFoundException } from '@/exceptions/not_found'
import { ErrorCodes } from '@/exceptions/root'
import { prismaClient } from '@/prisma_connection'
import { CreateCartSchema } from '@/validator/auth.validator'
import { Product } from '@prisma/client'
import { Request, Response } from 'express'
import { success } from 'zod'

export const addItemToCart = async (req:Request, res: Response)=>{
    const validatedDate = CreateCartSchema.parse(req.body)

    let product: Product;

    try{
        product = await prismaClient.product.findFirstOrThrow({
            where:{
                id:validatedDate.productId
            }
        })
    } catch(err){
      throw new NotFoundException("Product not found",ErrorCodes.PRODUCT_NOT_FOUND)
    }
    const cart = await prismaClient.cartItem.create({
        data:{
            userId: req.user.id,
            productId: product.id,
            quantity: validatedDate.quantity
        }
    })
    res.json(cart)
}
export const deleteItemFromCart = async (req:Request, res: Response)=>{
    await prismaClient.cartItem.delete({
        where:{
            id: +req.params.id
        }
    })
    res.json({success: true})
}
export const changeQuantity = async (req:Request, res: Response)=>{
    
}
export const getCart = async (req:Request, res: Response)=>{

}