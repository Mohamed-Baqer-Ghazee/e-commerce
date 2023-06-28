import orderModel from "../models/order.model";
import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import bodyParser from "body-parser"
import dotenv from "dotenv"
dotenv.config();
import cookieParser from "cookie-parser";
import passport from "passport";
const JwtStrategy = require("passport-jwt").Strategy;
import { findOrCreateCart } from "./cartProduct.controller";


const app = express();
const OrderModel = new orderModel();
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
passport.use(JwtStrategy);
app.use(passport.initialize());

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req,next);
        const cart = await findOrCreateCart(req,res,next);
        if(userId&& cart){
            const order = await OrderModel.createOrder(userId,cart.id);
            res.render("order", { order });
        }else{
            res.send("something went wrong");
        }

    } catch (error) {
        next(error);
    }
};
export const getOrdersByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getUserId(req,next);
        if(userId){
            const order = await OrderModel.getOrdersByUserId(userId);
    
            res.render("order", { order });

        }

    } catch (error) {
        next(error);
    }
};
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await OrderModel.getAllOrders();

        res.render("order", { orders });

    } catch (error) {
        next(error);
    }
};
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const id = req.params.id;
        const order = await OrderModel.getOrderById(id);
        if (!order)
            res.send("no order found");
        else res.render("order", { order });
    } catch (error) {
        next(error);
    }
};

export const deleteOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const order = await OrderModel.deleteOrderById(id);
        if(order)
            res.send("order deleted successfully");
        else
            res.send ("no order found");
    } catch (error) {
        next(error);
    }
};


function getUserId(req: Request, next: NextFunction) {
    const userToken = req.cookies.jwt;
    if (userToken) {
        try {
            const decodedToken = jwt.verify(userToken, process.env.token_secret as unknown as string) as JwtPayload;
            const userId = decodedToken.user.id;
            if (userId)
                return userId;
            else return 0;
        } catch (error) {
            next(error)
        }
    } else {
        return 0;

    }
}
