import { NextFunction , Request, Response } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodType<any,any,any>)=>(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
    });

    if(!result.success){
        return res.status(400).json({
            error: "Validation failed",
            details: result.error.issues
        });
    }
    req.body = result.data.body; // if valid - req.body me valid data daal do!

    next();
}