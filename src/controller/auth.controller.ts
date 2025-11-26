import { Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@/secrets';
import { SignupInput , loginInput } from '../validator/auth.validator';

export const signup = async (
    req: Request<{},{},SignupInput>,
    res: Response
) => {
    try {
        const { email, password, name } = req.body;

        let user = await prismaClient.user.findFirst({ where: { email } });
        if (user) {
            return res.status(400).json({ 
                error: 'User already exists!' 
            });
        }

        user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10)
            }
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            error: 'An error occurred during signup' 
        });
    }
};

export const login = async (
    req: Request<{},{},loginInput>,
    res: Response
) => {
    try {
        const { email, password } = req.body;

        let user = await prismaClient.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(404).json({ 
                error: 'User does not exist!' 
            });
        }

        if (!compareSync(password, user.password)) {
            return res.status(401).json({ 
                error: 'Incorrect password' 
            });
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET
        );

        res.json({ user, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'An error occurred during login' 
        });
    }
};