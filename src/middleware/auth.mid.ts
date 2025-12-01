import { UnauthorizedException } from "../exceptions/unauthorized.ex";
import { NextFunction, Response,Request } from "express";
import { ErrorCodes } from "../exceptions/root";
import { JWT_SECRET } from "../secret.validator";
import jwt from "jsonwebtoken"; 
import { prismaClient } from "../prisma_connection";


export const authMiddleware = async(req: Request,res:Response,next:NextFunction) =>{

    let token = req.headers.authorization?.split(' ')[1]

      if (!token) {
    return next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED_EXCEPTION));
}

try{
    const payload = jwt.verify(token,JWT_SECRET) as {userId:number}

    const user = await prismaClient.user.findFirst({
        where:{id:payload.userId}
    })
    
    if(!user){
            return next(
                new UnauthorizedException(
                    "Unauthorized - User not found",
                    ErrorCodes.UNAUTHORIZED_EXCEPTION
                )
            );
        }
    req.user = user
    next()

    }catch(error){
          next(
            new UnauthorizedException(
                'Un-auhtorized!',
                ErrorCodes.UNAUTHORIZED_EXCEPTION
            )
        )
    }
}