import express, { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hashPassword = (password: string) => {
    const salt = parseInt(process.env.SALT as string, 10);
    return bcrypt.hashSync(`${password}${process.env.BCRYPT_PASSWORD}`, salt)
}

class UserModel {

    async signUp(req: Request) {
        const { name, email, password } = req.body;

        try {
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashPassword(password),
                },
            });
            return user;
        } catch (error) {
            throw new Error(`Unable to create (${name}: ${(error as Error).message})`);
        }
    }
    async getAllUsers() {
        try {
            const users = await prisma.user.findMany();
            return users;
        } catch (error) {
            throw new Error(`Error when retrieving users ${(error as Error).message}`);
        }
    }
    async getUserById(req: Request) {
        try {
            const id = req.params.id;

            const user = await prisma.user.findFirst({
                where: {
                    id: id
                }
            });
            return user;

        } catch (error) {
            throw new Error(`Error retrieving the user ${(error as Error).message}`);
        }
    }
    async updateUserById(req: Request) {
        try {
            const { id, name, email } = req.body;
            const user = await prisma.user.findUnique({
                where: {
                    id: id
                }
            });

            return user;
        } catch (error) {
            throw new Error(`Error when updating users ${(error as Error).message}`);
        }
    }
    async updateCurrentUser(id: string, req: Request) {
        try {
            const { name, email } = req.body;
            const user = await prisma.user.update({
                where: {
                    id: id
                },data:{
                    name,
                    email
                }
            });


            return user;
        } catch (error) {
            throw new Error(`Error when updating users ${(error as Error).message}`);
        }
    }
    async updateUserRole(req: Request) {
        try {
            const id = req.params.id;
            const user = await prisma.user.update({
                where: {
                    id
                },
                data: {
                    role: 'SELLER',
                },
            });

            return user;
        } catch (error) {
            throw new Error(`Error when updating users ${(error as Error).message}`);
        }
    }
    async deleteUser(req: Request) {
        try {
            const id: string = req.params.id;
            console.log(id);

            const user = await prisma.user.delete({
                where: {
                    id: id
                }
            });
            if (!user)
                throw new Error(`no user found with that id`);
            return user;
        } catch (error) {
            throw new Error(`Error deleting the user ${(error as Error).message}`);
        }
    }
    async signIn(email: string, password: string) {

        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                },
            });
            if (user) {

                const { password: hashPassword } = user;
                const isPassword = bcrypt.compareSync(
                    `${password}${process.env.bcrypt_password}`,
                    hashPassword
                )
                if (isPassword) {
                    return user;
                }
            }

            return null;

        } catch (error) {
            throw new Error(`Unable to login: ${(error as Error).message}`);
        }
    }
}


export default UserModel;