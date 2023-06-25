import express, { Request, Response, NextFunction } from "express";
import passport from 'passport';
const JwtStrategy = require('passport-jwt').Strategy;
import { PrismaClient } from '@prisma/client';
import { Strategy as GoogleStrategy,Profile } from "passport-google-oauth20";
import { VerifiedCallback } from "passport-jwt";
const prisma = new PrismaClient();


const jwtOptions = {
  jwtFromRequest: (req: Request) => {
    let token = null;
    if (req && req.cookies)
      token = req.cookies.jwt;

    return token;
  },
  secretOrKey: process.env.token_secret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload: any, done: any) => {
    try {

      // Find or validate the user based on the payload
      const user = await prisma.user.findUnique({ where: { email: payload.user.email } });
      if (user) {
        // User found
        return done(null, user);
      } else {
        // User not found
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);



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
      }
    })
    console.log("logged");
    done(null,newUser);
    
    }
  }catch(error){
    throw new Error(`Error signing in the user ${(error as Error).message}`);
  }
  
}))




// passport.use(
//   new GoogleStrategy({
//     clientID: process.env.oauth_client_id as string,
//     clientSecret: process.env.oauth_client_secret as string,
//     callbackURL: "http://localhost:3000/google/edirect"
//   },
//     function (accessToken, refreshToken, profile, done) {
//       //console.log(accessToken, refreshToken, profile)
//       console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
//       return done(null, profile)
//     }
//   ))

