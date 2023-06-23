import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Error from '../interfaces/error.interface'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(cookieParser());
const handleUnauthorizedError = (next: NextFunction) => {
  const error: Error = new Error('Login Error, Please login again');
  error.name = "noAuth";
  error.status = 401;
  next(error);
}

const validateTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;  //use with cookies only
    
    if(token){
      jwt.verify(token, process.env.token_secret as string ,(error:any, decodeToken:any)=>{
        if(error){
          console.log(error.message);
          res.redirect('/login');
          
        }else{
          
          next();
        }
      });
    }else{
      res.redirect('/signin');
    }

    // const authHeader = req.get('Authorization');
    // console.log(authHeader);
    // if (authHeader) {
    //   const bearer = authHeader.split(' ')[0].toLowerCase()
    //   const token = authHeader.split(' ')[1]
    //   if (token && bearer === 'bearer') {
    //     const decode = jwt.verify(
    //       token,
    //       process.env.token_secret as unknown as string
    //     )

    //     if (decode) {

    //       next()
    //     } else {
    //       // Failed to authenticate user.
    //       handleUnauthorizedError(next)
    //     }
    //   } else {
    //     // token type not bearer
    //     handleUnauthorizedError(next)
    //   }
    // } else {
    //   // No Token Provided.
    //   handleUnauthorizedError(next)
    // }
  } catch (err) {
    handleUnauthorizedError(next)
  }
}

export default validateTokenMiddleware