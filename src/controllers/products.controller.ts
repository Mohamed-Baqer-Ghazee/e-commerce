import productModel from "../models/product.model";
import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import passport from "passport";
const JwtStrategy = require('passport-jwt').Strategy;



const app = express();
const ProductModel = new productModel();
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
passport.use(JwtStrategy);
app.use(passport.initialize());


export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId= getUserId(req, next)
        if(userId){
            const product = await ProductModel.createProduct(userId, req);
            res.redirect(`/api/products/${product.id}`)

        }else{
            res.send('you are not a seller');
        }
        
    } catch (error) {
        const err = new Error(`Unable to create (${(error as Error).message})`);
        next(err);
    }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await ProductModel.getAllProducts();

        res.render("index", { products });
    
    } catch (error) {
        next(error);
    }
};
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const product = await ProductModel.getProductById(req);
        if (!product)
            res.send("no product found")
        else res.render("product", { product });
    } catch (error) {
        next(error);
    }
};
export const updateProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await ProductModel.updateProductById(getUserId(req,next),req);
        if (product)
            res.send(product);
        else res.send("no product found");

    } catch (error) {
        next(error);
    }
};


export const deleteProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
            const user = await ProductModel.deleteProductById(req);
            res.redirect('/');
    
    } catch (error) {
        next(error);
    }
};


function getUserId(req: Request, next: NextFunction) {

    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.token_secret as unknown as string) as JwtPayload;
            const user= decodedToken.user;
            if(user.role ==='ADMIN' || user.role === 'SELLER')
                return user.id;
            else return 0;
        } catch (error) {
            next(error)
        }
    } else {
        return 0;

    }
}