import express, { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { exitCode } from "process";
dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class CartProductModel {

    async addProductToCart(cartId: string, productId: string) {
        try {
            const cartProduct = await prisma.cartProduct.create({
                data: {
                    cart: {
                        connect: { id: cartId }
                    },
                    product: {
                        connect: { id: productId }
                    },
                    quantity: 1
                }
            });

            return cartProduct;
        } catch (error) {
            throw new Error(`Unable to add product to cart (${(error as Error).message})`);
        }
    }

    async getCartProductById(id: string) {
        try {
            const cartProduct = await prisma.cartProduct.findUnique({
                where: {
                    id
                }
            });
            return cartProduct;
        } catch (error) {
            throw new Error(`Error retrieving the cart (${(error as Error).message})`);
        }
    }

    async getCartProducts(id: string) {
        try {
          const cart = await prisma.cart.findUnique({
            where: {
              id
            },
            include: {
              cartProducts: {
                include: {
                  product: true
                }
              }
            }
          });
      
          if (cart) {
            const cartProducts = cart.cartProducts;
            return cartProducts;
          }
        } catch (error) {
          throw new Error(`Error retrieving cart products (${(error as Error).message})`);
        }
      }
      
    async removeProductById(cartId: string, productId: string) {
        try {
          const cartProduct = await prisma.cartProduct.findFirst({
            where: {
              AND: [
                { cartId: cartId },
                { productId: productId },
              ],
            },
          });
          if(cartProduct){
            const id = cartProduct.id;
            const newCartProduct = await prisma.cartProduct.delete({
              where: {
                id
              },
            });
            
          return cartProduct;
          }else{
            throw new Error(`No cart found with that id`);
          }
          

        } catch (error) {
          throw new Error(`Error when removing product from cartProduct (${(error as Error).message})`);
        }
      }
      

    async deleteCartProductById(req: Request) {
        try {
            const id: string = req.params.id;

            const cart = await prisma.cartProduct.delete({
                where: {
                    id
                }
            });

            if (!cart)
                throw new Error(`No cartProduct found with that id`);

            return cart;
        } catch (error) {
            throw new Error(`Error deleting the cartProduct (${(error as Error).message})`);
        }
    }
}

export default CartProductModel;
