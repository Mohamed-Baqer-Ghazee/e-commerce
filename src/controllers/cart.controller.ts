import cartModel from "../models/cart.model";
import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import passport from "passport";
const JwtStrategy = require('passport-jwt').Strategy;



const app = express();
const CartModel = new cartModel();
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
passport.use(JwtStrategy);
app.use(passport.initialize());


async function createOrFindCart(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req, next);
        const productId = req.params.id;
        // if the user is signed in -+
        if (userId) {
            const cart = await CartModel.createCart(userId);
            return cart;

        } else {
            const tempCartId = getCartId(req, next);
            if(tempCartId){
                const cart = await CartModel.getCartById(tempCartId);
                return cart;

            }else{
                const tempCart = await CartModel.createCart(tempCartId);
                sendCartToken(res, tempCart);
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
        const cart = await createOrFindCart(req, res, next);
        if (cart) {
            const cartId = cart.id;
            const newCart = CartModel.addProductToCart(cartId, productId);
            res.send("product added successfully");
        }else{
            res.send("something went wrong");

        }

    } catch (error) {
        next(error);
    }
};
export const getAllCarts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const carts = await CartModel.getAllCarts();
        console.log(carts);
        
        res.render("carts", { carts });

    } catch (error) {
        next(error);
    }
};
export const getCartProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const carts = await CartModel.getAllCarts();

        res.render("index", { carts });

    } catch (error) {
        next(error);
    }
};
export const getCartById = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const product = await CartModel.getCartById(req);
        if (!product)
            res.send("no product found")
        else res.render("product", { product });
    } catch (error) {
        next(error);
    }
};
export const removeProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id;
        const cart = await CartModel.removeProductById(getCartId(req, next),productId);

        if (cart)
            res.send(cart);
        else res.send("no product found");

    } catch (error) {
        next(error);
    }
};


export const deleteCartById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await CartModel.deleteCartById(req);
        res.redirect('/');

    } catch (error) {
        next(error);
    }
};

const maxAge = 30 * 24 * 60 * 60;
function sendCartToken(res: Response, cart: any) {
    try {
        const cartToken = jwt.sign({ cart }, process.env.token_secret as unknown as string, { expiresIn: maxAge });
        console.log(cartToken);
        res.cookie("jwtCart", cartToken, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect("/");

    } catch (error) {

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