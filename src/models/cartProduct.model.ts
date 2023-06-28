import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { exitCode } from "process";
dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class CartProductModel {

  async addProductToCart(cartId: string, productId: string) {
    try {
      const id = await this.getCartProductId(cartId,productId);
      if(id !== "-1") {
        const cartProduct = await prisma.cartProduct.update({
          where: { id }, data: {
            quantity: { increment: 1 }
          }
        });
        return cartProduct;
      }
      const cartProduct = await prisma.cartProduct.create({
        data: {
          cart: {
            connect: { id: cartId }
          },
          product: {
            connect: { id: productId }
          }
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
  async getPaymentAmount(id: string) {
    try {
      const cartProducts = await this.getCartProducts(id);
      let paymentAmount = 0;
  
      if (cartProducts) {
        for (const cartProduct of cartProducts) {
          paymentAmount += cartProduct.product.price * cartProduct.quantity;
        }
      }
  
      console.log('Payment Amount:', paymentAmount);
      return paymentAmount;
    } catch (error) {
      throw new Error(`Error retrieving cart products (${(error as Error).message})`);
    }
  }
  
  async removeProductById(cartId: string, productId: string) {
    try {
      const id = await this.getCartProductId(cartId,productId);
      if(id !== "-1") {
        const cart = await prisma.cartProduct.findUnique({
          where: {
            id
          },
          include: {
                product: true
          }
        });
        if(cart && cart.quantity > 1){
          const newCartProduct = await prisma.cartProduct.update({
            where:{
              id
            },data:{
              quantity:{decrement:1}
            }
          });
          
          return newCartProduct;
        }
        const newCartProduct = await prisma.cartProduct.delete({
          where: {
            id
          },
        });

        return 0;
      } else {
        throw new Error(`no user cart with that id`);
      }

    } catch (error) {
      const err = new Error(`Error when removing product from cartProduct (${(error as Error).message})`);
      err.name="product doesn't exist in cart";
      throw err;
      // throw new Error(`Error when removing product from cartProduct (${(error as Error).message})`);
    }
  }
  
  async getCartProductId(cartId:string, productId:string) {
      try{
      const cartProduct = await prisma.cartProduct.findFirst({
        where: {
          AND: [
            { cartId: cartId },
            { productId: productId },
          ],
        },
      });
      if (cartProduct) {
        return cartProduct.id;
      }
      else{
        return "-1";
      }
      }catch(error){
        throw new Error(`Error when finding cartProduct (${(error as Error).message})`);
      }
  }
}

export default CartProductModel;
