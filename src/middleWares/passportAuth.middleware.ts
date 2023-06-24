import express, { Request, Response, NextFunction } from "express";
import passport from 'passport';
const JwtStrategy = require('passport-jwt').Strategy;
import { PrismaClient } from '@prisma/client';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
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

passport.use(
  new GoogleStrategy({
    clientID: process.env.oauth_client_id as string,
    clientSecret: process.env.oauth_client_secret as string,
    callbackURL: "http://localhost:3000/google/edirect"
  },
    function (accessToken, refreshToken, profile, done) {
      //console.log(accessToken, refreshToken, profile)
      console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
      return done(null, profile)
    }
  ))

