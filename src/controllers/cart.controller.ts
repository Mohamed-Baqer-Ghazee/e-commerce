import cartModel from "../models/cart.model";
import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import bodyParser from "body-parser"
import dotenv from "dotenv"
dotenv.config();
import cookieParser from "cookie-parser";
import passport from "passport";
const JwtStrategy = require("passport-jwt").Strategy;



const app = express();
const CartModel = new cartModel();
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
passport.use(JwtStrategy);
app.use(passport.initialize());

export const getAllCarts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const carts = await CartModel.getAllCarts();
        
        res.render("carts", { carts });

    } catch (error) {
        next(error);
    }
};
export const getCartById = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const id = req.params.id;
        const cart = await CartModel.getCartById(id);
        if (!cart)
            res.send("no cart found")
        else res.render("cart", { cart });
    } catch (error) {
        next(error);
    }
};


export const deleteCartById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await CartModel.deleteCartById(req);
        res.redirect("/");

    } catch (error) {
        next(error);
    }
};

const maxAge = 30 * 24 * 60 * 60;
function sendCartToken(res: Response,next:NextFunction, cart: any) {
    try {
        const cartToken = jwt.sign({ cart }, process.env.token_secret as unknown as string, { expiresIn: maxAge });
        console.log(cartToken);
        res.cookie("jwtCart", cartToken, { httpOnly: true, maxAge: maxAge * 1000 });

    } catch (error) {
        next(error);
    }

}


function getCartId(req: Request, next: NextFunction) {
    const cartToken = req.cookies.jwtCart;
    if (cartToken) {
        try {
            const decodedToken = jwt.verify(cartToken, process.env.token_secret as unknown as string) as JwtPayload;
            const cartId = decodedToken.cart.id;
            if (cartId)
                return cartId;
            else return 0;
        } catch (error) {
            next(error)
        }
    } else {
        return 0;

    }
}

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