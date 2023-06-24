import express, { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class ProductModel {

    async createProduct(userId: string, req: Request) {
        try {
            const { name, description, price : priceString, imageUrl } = req.body;
            
            const price = parseFloat(priceString);
            const product = await prisma.product.create({
                data: {
                    name,
                    description,
                    price,
                    imageUrl,
                    user:{
                        connect:{id:userId}
                    }
                },
            });
            return product;
        } catch (error) {
            throw new Error(`Unable to create product ( ${(error as Error).message})`);
        }
    }
    async getAllProducts() {
        try {
            const products = await prisma.product.findMany();
            return products;
        } catch (error) {
            throw new Error(`Error when retrieving products ${(error as Error).message}`);
        }
    }
    async getProductById(req: Request) {
        try {
            const id = req.params.id;

            const product = await prisma.product.findUnique({
                where: {
                    id: id
                }
            });
            return product;

        } catch (error) {
            throw new Error(`Error retrieving the product ${(error as Error).message}`);
        }
    }
    async updateProductById(userId:string, req: Request) {
        try {
            const id= req.params.id;
            const { name, description, price: priceString, imageUrl } = req.body;
            const price = parseFloat(priceString);
            const product = await prisma.product.update({
                where: {
                    id: id
                }, data: {
                    name,
                    description,
                    price,
                    imageUrl,

                }
            });

            return product;
        } catch (error) {
            throw new Error(`Error when updating products ${(error as Error).message}`);
        }
    }
    async deleteProductById(req: Request) {
        try {
            const id: string = req.params.id;
            console.log(id);

            const product = await prisma.product.delete({
                where: {
                    id: id
                }
            });
            if (!product)
                throw new Error(`no user found with that id`);
            return product;
        } catch (error) {
            throw new Error(`Error deleting the user ${(error as Error).message}`);
        }
    }
}


export default ProductModel;