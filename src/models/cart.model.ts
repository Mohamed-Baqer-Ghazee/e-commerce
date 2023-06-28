import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"
dotenv.config();

const prisma = new PrismaClient();
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
                    id
                }
            });
            return cart;

        } catch (error) {
            throw new Error(`Error retrieving the cart ${(error as Error).message}`);
        }
    }
    async deleteCartById(id:string) {
        try {
            const cartProduct = await prisma.cartProduct.deleteMany({
                where:{
                    cartId:id
                }
            })
            if(cartProduct){
                const cart = await prisma.cart.delete({
                    where: {
                        id
                    }
                });
                if (!cart)
                    throw new Error(`no cart found with that id`);
                return cart;
            }
        } catch (error) {
            throw new Error(`Error deleting the cart ${(error as Error).message}`);
        }
    }
}

export default CartModel;