import UserModel from "../models/user.model";
import express, { Request, Response, NextFunction } from "express";
import jwt,{JwtPayload} from 'jsonwebtoken'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import passport from "passport";
const JwtStrategy = require('passport-jwt').Strategy;



const app = express();
const userModel = new UserModel();
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
passport.use(JwtStrategy);
app.use(passport.initialize());


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(isAdmin(req,next)){
            const user = await userModel.deleteUser(req);
            res.redirect('/');
    }else{
        res.send("you're not an admin");
    }
    } catch (error) {
        next(error);
    }
};
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(isAdmin(req,next)){
        const users = await userModel.getAllUsers();

        res.render("users", { users });
    }else{
        res.send("you're not an admin");
    }
    } catch (error) {
        next(error);
    }
};
export const getSignedUser = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        passport.authenticate('jwt', { session: false },function(err:any, user:any, info:any) {
        if (err) {
            
          return next(err);
        }
        if (!user) {
          // Handle failed authentication
          return res.redirect('/login');
        }
        // Successful authentication
        console.log("auth successful");
        res.render("user", { user });

      })(req, res, next);
    } catch (error) {
        next(error);
    }
};
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    
    try {if(isAdmin(req,next)){
        const user = await userModel.getUserById(req);
        if(!user)
            res.send("no user found")
        else res.render("user", { user });
    }else{
        res.send("you're not an admin");
    }
    } catch (error) {
        next(error);
    }
};
export const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(isAdmin(req,next)){
        const user = await userModel.updateUserById(req);
        if(user)
            res.send(user.name);
        else res.send("no user found");
    }else{
        res.send("you're not an admin");

    }
    } catch (error) {
        next(error);
    }
};
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(isAdmin(req,next)){
            const user = await userModel.updateUserRole(req);
            if(user)
                res.send(user);
            else res.send("no user found");

        }else{
            res.send("you're not an admin");
        }
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
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect('/');

    } catch (error) {
        next(error)
    }
}
export const signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {

        console.log("signed out");
        
        res.cookie('jwt', '', { httpOnly: true, maxAge:1 });
        res.redirect('/');

    } catch (error) {
        next(error)
    }
}

function isAdmin(req:Request,next:NextFunction){
    
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.token_secret as unknown as string) as JwtPayload;
            
            if(decodedToken.user.role === 'ADMIN')
                return 1;
            else return 0;
          } catch (error) {
            next(error);
          }
    }else{
        return 0;

    }
}
