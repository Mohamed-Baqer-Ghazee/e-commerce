import express, { Request, Response, NextFunction } from "express";
import passport from 'passport';
const JwtStrategy = require('passport-jwt').Strategy;
import { PrismaClient } from '@prisma/client';
import { Strategy as  GoogleStrategy } from "passport-google-oauth20";
const prisma = new PrismaClient();


const handleUnauthorizedError = (next: NextFunction) => {
  const error: Error = new Error('Login Error, Please login again');
  error.name = "noAuth";
  next(error);
}


const jwtOptions = {
  jwtFromRequest: (req: Request)=>{
      let token = null;
      if(req && req.cookies)
        token = req.cookies.jwt;

      return token;
  },
  secretOrKey: process.env.token_secret, // Replace with your own secret key
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload:any, done:any) => {
    try {
      // Find or validate the user based on the payload
      const user = await prisma.user.findUnique({where:{email:payload.user.email}});
      console.log(user)
      if (user) {
        // User found
        done(null, user);
      } else {
        // User not found
        done(null, false);
      }
    } catch (error) {
      done(error, false);
    }
  })
);

passport.use(
  new GoogleStrategy({
  clientID: process.env.oauth_client_id as string,
  clientSecret: process.env.oauth_client_secret as string,
  callbackURL: "http://localhost:3000/google/edirect"
},
function(accessToken, refreshToken, profile, done) {
    //console.log(accessToken, refreshToken, profile)
    console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
    return done(null, profile)
}
))


// These functions are required for getting data To/from JSON returned from Providers
// passport.serializeUser(function(user, done) {
//   console.log('serialized')
//   done(null, user)
// })
// passport.deserializeUser(function(obj:any, done) {
//   console.log('deserialized')
//   done(null, obj)
// })