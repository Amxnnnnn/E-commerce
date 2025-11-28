import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@/secrets';
import { SignupInput , loginInput } from '../validator/auth.validator';
import { ErrorCodes } from '../exceptions/root';
import { BadRequestsException } from '../exceptions/bad_request';

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
        next(err);  // ← Pass to errorHandler middleware
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
            throw new BadRequestsException('User not found', ErrorCodes.INCORRECT_PASSWORD)
        }

        if (!compareSync(password, user.password)) {
            throw new BadRequestsException('Incorrect password', ErrorCodes.INCORRECT_PASSWORD)
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET
        );

        return res.json({ user, token });
    } catch (error) {
        next(error);  // ← Pass to errorHandler middleware
    }
};