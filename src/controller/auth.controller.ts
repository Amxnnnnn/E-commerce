import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '../index.validator';
import { hashSync, compareSync } from 'bcrypt';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../secret.validator';
import { SignupInput , loginInput } from '../validator/auth.validator';
import { ErrorCodes } from '../exceptions/root';
import { BadRequestsException } from '../exceptions/bad_request';
import { NotFoundException } from '../exceptions/not_found';
import { UnauthorizedException } from '../exceptions/unauthorized.ex';

export const signup = async (
    req: Request<{},{},SignupInput>,
    res: Response,
    next:NextFunction
) => {
    try {
        const { email, password, name } = req.body;

        let user = await prismaClient.user.findFirst({ where: { email } });
        if (user) {
            throw new BadRequestsException('User already exists!', ErrorCodes.USER_ALREADY_EXIST)
        }
        
        user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10)
            }
        });

        return res.status(201).json(user);
    } catch (err: any) {
        next(err); 
    }
};

export const login = async (
    req: Request<{},{},loginInput>,
    res: Response,
    next:NextFunction
) => {
    try {
        const { email, password } = req.body;

        let user = await prismaClient.user.findFirst({ where: { email } });
        if (!user) {
            throw new NotFoundException('User not found', ErrorCodes.USER_NOT_FOUND)
        }

        if (!compareSync(password, user.password)) {
            throw new BadRequestsException('Incorrect password', ErrorCodes.INCORRECT_PASSWORD)
        }

        const token = jwt.sign(
            { userId: user.id ,
               role:user.role 
            },
            JWT_SECRET
        );
        
        return res.json({ user, token });
    } catch (error) {
        next(error);  
    }
};

export const me = async (
    req: Request,
    res: Response,
    next:NextFunction
) => {
    try{
     console.log(" Me endpoint called...");
     console.log("req.user : ",req.user);

     if(!req.user){
        console.log("No user found in request");
        throw new UnauthorizedException(
            'Unauthorized - Nouser found',
            ErrorCodes.UNAUTHORIZED_EXCEPTION
        );
     }
    return res.status(200).json({
        success: true,
        user: req.user
    });

    } catch(error){
        console.log("Error in me endpoint : ",error);
        next(error);
    }
} 
