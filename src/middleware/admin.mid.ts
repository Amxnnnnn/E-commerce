import { UnauthorizedException } from "../exceptions/unauthorized.ex";
import { NextFunction, Response,Request } from "express";
import { ErrorCodes } from "../exceptions/root";
import { JWT_SECRET } from "../secret.validator";
import jwt from "jsonwebtoken"; 
import { prismaClient } from "../prisma_connection";


export const adminMiddleware = async(
    
    req: Request,
    res:Response,
    next:NextFunction
) =>{
    const user = req.user
    if(user.role == 'ADMIN'){
         next()
    }
    else{
        next(new UnauthorizedException('Unauthorized',ErrorCodes.UNAUTHORIZED_EXCEPTION))
    }
}


export default adminMiddleware