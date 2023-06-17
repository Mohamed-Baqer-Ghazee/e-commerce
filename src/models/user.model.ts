import express,{ Router , Request,Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config();

const app=express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
            const users = await prisma.user.findMany();
            return users;
        } catch(error){
            throw new Error(`Error when retrieving users ${(error as Error).message}`);
        }
    }
    async getUserById(req: Request){
        try{
            const id= req.body.id;
            const user = await prisma.user.findFirst({
                where:{
                    id:id
                }
            });
            console.log(user)
            return user;

        } catch(error){
            throw new Error(`Error retrieving the user ${(error as Error).message}`);
        }
    }
    async updateUser(req: Request){
        try{
            const id= req.body.id;
            const user = await prisma.user.findFirst({
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
            const user = await prisma.user.delete({
                where:{
                    id:id
                }
            });
            return user;
        } catch(error){
            throw new Error(`Error deleting the user ${(error as Error).message}`);
        }
    }
    async authenticate(email: string, password: string){
        
        try{
            const user= await prisma.user.findUnique({
                where:{
                    email:email
                },
            });
            if(user){

            const {password:hashPassword}= user;
            const isPassword = bcrypt.compareSync(
                `${password}${process.env.bcrypt_password}`,
                hashPassword
            )
            if(isPassword){
                return user;
            }
            }
            
            return null;

        }catch(error){
            throw new Error(`Unable to login: ${(error as Error).message}`);
        }
    }
}


export default UserModel;