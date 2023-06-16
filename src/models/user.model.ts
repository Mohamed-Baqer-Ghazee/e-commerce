import express,{ Router , Request,Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
const prisma = new PrismaClient();
dotenv.config();

const app=express();
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

const hashPassword = (password: string)=> {
    const salt = parseInt(process.env.SALT as string,10);
    return bcrypt.hashSync(`${password}${process.env.BCRYPT_PASSWORD}`,salt)
  }
class UserModel{

    async create(req: Request){
        console.log(req.body);
        const { name, email, password } = req.body;
        
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword(password),
      },
    });

    console.log(user);
    // const token = jwt.sign({ userId: user.id }, secretKey, { algorithm: 'HS256' });

    return user;
  } catch (error) {
    throw new Error(`Unable to create (${name}: ${(error as Error).message})`);
  }
    }
    async getAllUsers(){
        try{
            const users = prisma.user.findMany();
            return users;
        } catch(error){
            throw new Error(`Error when retrieving users ${(error as Error).message}`);
        }
    }
    async getUserById(req: Request){
        try{
            const id= req.body.id;
            const user = prisma.user.findFirst({
                where:{
                    id:id
                }
            });
            return user;
        } catch(error){
            throw new Error(`Error retrieving the user ${(error as Error).message}`);
        }
    }
    async updateUser(req: Request){
        try{
            const id= req.body.id;
            const user = prisma.user.findFirst({
                where:{
                    id:id
                }
            });
            return user;
        } catch(error){
            throw new Error(`Error when updating users ${(error as Error).message}`);
        }
    }
    async deleteUser(req: Request){
        try{
            const id= req.body.id;
            const user = prisma.user.delete({
                where:{
                    id:id
                }
            });
            return user;
        } catch(error){
            throw new Error(`Error deleting the user ${(error as Error).message}`);
        }
    }
}


export default UserModel;