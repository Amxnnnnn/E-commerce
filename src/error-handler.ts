import { NextFunction, Request, Response } from "express"
import { HttpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-exception"
import { ErrorCodes } from "./exceptions/root"

export const errorHandler = (method: Function)=>{
    return (req:Request, res:Response, next:NextFunction) =>{
        Promise.resolve(method(req,res,next))  // ✓ Wrap in Promise.resolve()
            .catch((error:any) => {
                let exception:HttpException
                if(error instanceof HttpException){
                    exception = error;
                } else {
                    exception = new InternalException('Something went wrong!', error, ErrorCodes.INTERNAL_EXCEPTION)
                }
                next(exception)
            })
    }
}