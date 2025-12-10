import { Request , Response, NextFunction} from "express"
import { prismaClient } from "../prisma_connection"
import { NotFoundException } from "@/exceptions/not_found";
import { ErrorCodes } from "@/exceptions/root";
import { error } from "console";
import { BadRequestsException } from "@/exceptions/bad_request";

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

export const updateProduct = async(req:Request,res:Response) =>{
    try{
       const product = req.body;
       if(product.tags){
        product.tags= product.tags.join(',') // Tags(Arry) to comma saperated strings
       }
       const updateProduct = await prismaClient.product.update({
        where:{
            id: +req.params.id // req.param.id --> "String" || so '+'req.param.id ~~> Converts ~~> string to Number  || alternatives : id:Number(req.params.id) && id: parseInt(req.params.id)
        },
        data: product
       })
       res.json(updateProduct)

    }catch(err){
       throw new NotFoundException('Product not found',ErrorCodes.PRODUCT_NOT_FOUND)
    }
}
export const deleteProduct = async(req:Request,res:Response) =>{
    try{
        const product = req.body;
        const deleteProducts = await prismaClient.product.delete({
            where : {
                id: +req.params.id
            }
        })
        console.log("Product deleted successfully!",deleteProducts)
        res.json(deleteProducts)

    } catch (err){
         throw new NotFoundException('Product not found - for deletion',ErrorCodes.PRODUCT_NOT_FOUND)
        }
    }
    
export const listProduct = async(req:Request,res:Response) =>{
        const count = await prismaClient.product.count()
        const products = await prismaClient.product.findMany({
            skip: Number(req.query.skip) || 0,
            take:5
        })
        res.json({
            count,data:products
        })
    }
export const getProductById = async(req:Request,res:Response) =>{
        
        try{
            const product = await prismaClient.product.findFirstOrThrow({
                where:{
                    id:+req.params.id
                }
            })
            res.json(product)
        }catch{
            console.log(error)
            throw new NotFoundException('Product not found - for getProductById',ErrorCodes.PRODUCT_NOT_FOUND)
            
    }
}

export const searchProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get search query from query parameter
        const searchQuery = req.query.q as string

        // Validate search query
        if (!searchQuery || searchQuery.trim().length === 0) {
            throw new BadRequestsException(
                'Search query is required. Use ?q=yourSearchTerm',
                ErrorCodes.INTERNAL_EXCEPTION
            )
        }

        const query = searchQuery.toLowerCase().trim()

        // Get pagination parameters
        const skip = parseInt(req.query.skip as string) || 0
        const take = parseInt(req.query.take as string) || 10

        // Search products by name, description, or tags
        const products = await prismaClient.product.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive' // Case-insensitive search
                        }
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        tags: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            skip,
            take,
            orderBy: {
                name: 'asc' // Sort by name alphabetically
            }
        })

        // Get total count of matching products
        const totalCount = await prismaClient.product.count({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        tags: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        })

        res.json({
            success: true,
            searchQuery: query,
            count: products.length,
            totalCount,
            skip,
            take,
            data: products
        })
    } catch (error) {
        next(error)
    }
}