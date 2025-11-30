import { Request , Response} from "express"
import { prismaClient } from "../index.validator"

export const creatProduct = async(req:Request,res:Response) =>{
    const product = await prismaClient.products.create({
        data:{
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })

    res.json(product)
}