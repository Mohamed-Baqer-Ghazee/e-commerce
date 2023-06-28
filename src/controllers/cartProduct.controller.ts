import cartModel from "../models/cart.model";
import cartProductModel from "../models/cartProduct.model";
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
const CartProductModel = new cartProductModel();
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
passport.use(JwtStrategy);
app.use(passport.initialize());


export async function findOrCreateCart(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req, next);
        const productId = req.params.id;
        // if the user is signed in 
        if (userId) {
            const cart = await CartModel.createCart(userId);
            return cart;

        } else {
            const tempCartId = getCartId(req, next);
            if(tempCartId){
                const cart = await CartModel.getCartById(tempCartId);
                return cart;

            }else{
                const tempCart = await CartModel.createCart("-1");
                sendCartToken(res,next, tempCart);
                return tempCart;

            }
        }

    } catch (error) {
        const err = new Error(`Unable to find or create cart (${(error as Error).message})`);
        next(err);
    }
};
export const addProductToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id;
        const cart = await findOrCreateCart(req, res, next);
        if (cart) {
            const cartId = cart.id;
            const newCart = CartProductModel.addProductToCart(cartId, productId);
            res.send("product added successfully");
        } else {
            res.send("something went wrong");

        }

    } catch (error) {
        next(error);
    }
};
export const getCartProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const cart = await findOrCreateCart(req, res, next);
        if (cart) {
            const cartId = cart.id;
            const products = await CartProductModel.getCartProducts(cartId);
            console.log(products);

            res.render("index", { products });
        } else {
            res.send("no cart found");
        }

    } catch (error) {
        next(error);
    }
};
export const removeProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id;
        const cart = await findOrCreateCart(req, res, next);
        if (cart) {
            const id = cart.id
            const newCart = await CartProductModel.removeProductById(id, productId);

            if (newCart === 0)
                res.send("product removed successfully");
            else
                res.send("product decremented successfully");
        }
        else res.send("no product found");

    } catch (error) {
        next(error);
    }
};
export const getPaymentAmount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await findOrCreateCart(req, res, next);
        if (cart) {
            const id = cart.id
            const paymentAmount = await CartProductModel.getPaymentAmount(id);
            console.log(paymentAmount);
            
            res.send(`payment amount: ${paymentAmount}`);
            
        }
        else res.send("no product found");

    } catch (error) {
        next(error);
    }
};


const maxAge = 30 * 24 * 60 * 60;
function sendCartToken(res: Response, next: NextFunction, cart: any) {
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