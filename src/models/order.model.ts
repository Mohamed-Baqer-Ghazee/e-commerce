import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"
dotenv.config();

import cartProductModel from "../models/cartProduct.model";
const getPaymentAmount = new cartProductModel().getPaymentAmount;
const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class OrderModel {

    async createOrder(cartId: string, productId: string) {
        try {
            const paymentAmount = await getPaymentAmount(cartId);
          const order = await prisma.order.create({
            data: {
              cart: {
                connect: { id: cartId }
              },
              user: {
                connect: { id: productId }
              },
              payment:paymentAmount
            }
          });
    
          return order;
        } catch (error) {
          throw new Error(`Unable to add product to cart (${(error as Error).message})`);
        }
      }
    async getAllOrders() {
        try {
            const orders = await prisma.order.findMany();
            return orders;
        } catch (error) {
            throw new Error(`Error when retrieving orders ${(error as Error).message}`);
        }
    }
    async getOrderById(id:string) {
        try {
            const order = await prisma.order.findFirst({
                where: {
                    id: id
                }
            });
            return order;

        } catch (error) {
            throw new Error(`Error retrieving the order ${(error as Error).message}`);
        }
    }
    async deleteOrderById(id:string) {
        try {
            const order = await prisma.order.delete({
                where: {
                    id: id
                }
            });
            return order;

        } catch (error) {
            throw new Error(`Error deleting the order ${(error as Error).message}`);
        }
    }
    async getOrdersByUserId(userId:string) {
        try {
            const orders = await prisma.order.findMany({
                where: {
                    userId
                }
            });
            return orders;

        } catch (error) {
            throw new Error(`Error retrieving user orders ${(error as Error).message}`);
        }
    }
}

export default OrderModel;
