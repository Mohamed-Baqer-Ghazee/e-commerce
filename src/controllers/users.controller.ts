import UserModel from "../models/user.model";
import express, { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config();


import passport from "passport";
const LocalStrategy = require('passport-local').Strategy;


const app = express();
const userModel = new UserModel();
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);

    try {
        const user = await userModel.signUp(req);
        const token = jwt.sign({ user }, process.env.token_secret as unknown as string, { expiresIn: maxAge });
        // console.log(token);
        const userId = user.id;
        // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        return res.json({
            status: 'success',
            data: { userId: userId, token },
            message: 'user authenticated successfully',
        })
        
    } catch (error) {
        next(error);
    }
};
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userModel.deleteUser(req);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
};
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userModel.getAllUsers();
        // console.log(users);

        res.render("users", { users });
    } catch (error) {
        next(error);
    }
};
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userModel.getUserById(req);
        res.render("user", { user });
    } catch (error) {
        next(error);
    }
};
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userModel.updateUser(req);
        if(user)
            res.send(user.name);
        else res.send("no user found");
    } catch (error) {
        next(error);
    }
};
const maxAge =  30 * 24 * 60 * 60;
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.signIn(email, password);
        if (!user) {
            return res.render("failed");
        }

        const token = jwt.sign({ user }, process.env.token_secret as unknown as string, { expiresIn: maxAge });
        // console.log(token);
        const userId = user.id;
        // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        return res.json({
            status: 'success',
            data: { userId: userId, token },
            message: 'user authenticated successfully',
        })

    } catch (error) {
        next(error)
    }
}
export const signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        return res.json({
            status: 'success',
            data: { userId: '', token:'' },
            message: 'user signed Out successfully',
        })

    } catch (error) {
        next(error)
    }
}
