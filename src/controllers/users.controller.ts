import UserModel from "../models/user.model";
import express,{ Router , Request,Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import bodyParser  from 'body-parser'
import dotenv from 'dotenv'
dotenv.config();

const app=express();
const userModel = new UserModel();
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

export const createUser = async (req:Request, res: Response, next : NextFunction)=>{
    console.log(req.body);
    
    try{
        const user = await userModel.create(req);
        res.redirect('/');
    }catch (error){
        next(error);
    }
};
export const deleteUser = async (req:Request, res: Response, next : NextFunction)=>{
    try{
        const user = await userModel.deleteUser(req);
        res.redirect('/');
    }catch (error){
        next(error);
    }
};
export const getAllUsers = async (req:Request, res: Response, next : NextFunction)=>{
    try{
        const users = await userModel.getAllUsers();
        console.log(users);
        
        res.render("users",{users});
    }catch (error){
        next(error);
    }
};
export const getUserById = async (req:Request, res: Response, next : NextFunction)=>{
    try{
        const user = await userModel.getUserById(req);
        res.render("user",{user});
    }catch (error){
        next(error);
    }
};
export const updateUser = async (req:Request, res: Response, next : NextFunction)=>{
    try{
        const user = await userModel.updateUser(req);
        res.redirect('/');
    }catch (error){
        next(error);
    }
};
export const authenticate=async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {email, password}= req.body;
        const user = await userModel.authenticate(email,password);
        const token =jwt.sign({user}, process.env.token_secret as unknown as string);
        console.log(token);
        
        if(!user){
            return res.render("failed");
        }
        
        return res.json({
            status: 'success',
            data:{...user,token},
            message: 'user authenticated successfully',
        })

    }catch(error){
        next(error)
    }
}
