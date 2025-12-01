import { NextFunction, Request, Response } from "express"
import { HttpException } from "../exceptions/root";

export const errorMiddleware = (
    error: HttpException ,
    req:Request,
    res:Response,
    next:NextFunction
): void =>{

    console.log("Error agyi oyee!")
    res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode,
        errors: error.errors
    })
}