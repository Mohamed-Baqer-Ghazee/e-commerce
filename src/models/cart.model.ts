import express, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { exitCode } from "process";
dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class CartModel {

    async createCart(userId: string) {
        try {
            if(userId === "-1"){
                const cart = await prisma.cart.create({ 
                    data:{ }
                });
                return cart
            }
            const exsitingCart = await prisma.cart.findUnique({
                where: {
                    userId
                }
            })
            if (exsitingCart) {
                
                return exsitingCart;
            } else {
                const cart = await prisma.cart.create({
                    data: {
                        user: {
                            connect: { id: userId }
                        }
                    },
                });
                return cart;

            }
        } catch (error) {
            throw new Error(`Unable to create cart ( ${(error as Error).message})`);
        }
    }
    
    async getAllCarts() {
        try {
            const carts = await prisma.cart.findMany();
            return carts;
        } catch (error) {
            throw new Error(`Error when retrieving carts ${(error as Error).message}`);
        }
    }
    async getCartById(id:string) {
        try {
            const cart = await prisma.cart.findUnique({
                where: {
                    id: id
                }
            });
            return cart;

        } catch (error) {
            throw new Error(`Error retrieving the cart ${(error as Error).message}`);
        }
    }
    async deleteCartById(req: Request) {
        try {
            const id: string = req.params.id;

            const cart = await prisma.cart.delete({
                where: {
                    id: id
                }
            });
            if (!cart)
                throw new Error(`no user found with that id`);
            return cart;
        } catch (error) {
            throw new Error(`Error deleting the user ${(error as Error).message}`);
        }
    }
}


export default CartModel;