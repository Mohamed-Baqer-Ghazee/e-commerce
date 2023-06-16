import UserModel from "../models/user.model";
import {Request,Response, NextFunction } from "express";

const userModel = new UserModel();

export const createUser = async (req:Request, res: Response, next : NextFunction)=>{
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
