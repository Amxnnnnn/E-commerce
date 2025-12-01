import { Request , Response, NextFunction} from "express"
import { prismaClient } from "../prisma_connection"

export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const { name , description, price, tags} = req.body;

        if (!name || !description || !price || !Array.isArray(tags)){
            return res.status(400).json({
                error: "Invalid input. Required: name, description, price, tags (array)"
            })
        }
        const product = await prismaClient.product.create({
            data: {
               name,
               description,
               price,
               tags:tags.join(',')
            }
        });

        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
}