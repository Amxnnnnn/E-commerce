import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { UnprocessableEntity } from "../exceptions/validation";
import { ErrorCodes } from "../exceptions/root";

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            }) as any;

            req.body = validated.body;
            req.query = validated.query;
            req.params = validated.params;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return next(
                    new UnprocessableEntity(
                        error.issues,
                        'Validation failed',
                        ErrorCodes.UNPROCESSABLE_ENTITY
                    )
                );
            }
            next(error);
        }
    };
};