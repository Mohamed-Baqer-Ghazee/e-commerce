
// const LocalStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcrypt");
import passport from "passport";
import {Strategy as GoogleStrategy, Profile} from "passport-google-oauth20";
import { VerifiedCallback } from "passport-jwt";
 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// function initialize(passport:any, getUserByEmail:any) {
//   const authenticateUser = async (email:string, password:string, done:any) => {
//     const user = await getUserByEmail(email);
//     if (user == null) {
//       return done(null, false, { message: "User not found" });
//     }
 
//     try {
//         console.log(user);
        
//       if (await bcrypt.compare(`${password}${process.env.bcrypt_password}`, user.password)) {
//         return done(null, user);
//       } else {
//         return done(null, false, { message: "Invalid credentials" });
//       }
//     } catch (e) {
//       return done(e);
//     }
//   };
 
//   passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
//   passport.serializeUser((user:any, done:any) => done(null, user.email));
//   passport.deserializeUser((email:string, done:any) => {
//     return done(null, getUserByEmail(email));
//   });
// }


passport.use(new GoogleStrategy({
  clientID : process.env.oauth_client_id!,
  clientSecret: process.env.oauth_client_secret!,
  callbackURL : process.env.oauth_redirect_url,
  scope:['email','profile'],
},async (accessToken:string, refreshToken:string, profile: Profile, done: VerifiedCallback)=>{
  console.log(accessToken);
  console.log(profile);
  try{
    const name =profile._json.name;
    const email = profile._json.email;
    const user = await prisma.user.findUnique({where:{email:email}})
    if(user){
      console.log(user);
      done(null,user);
    }else{
      const newUser =await prisma.user.create({
      data:{
        name:name!,
        email: email!,
        password:'asdfasdf'
      }
    })
    console.log("logged");
    done(null,newUser);
    
    }
  }catch(error){
    throw new Error(`Error signing in the user ${(error as Error).message}`);
  }
  
}))
 
// module.exports = initialize;