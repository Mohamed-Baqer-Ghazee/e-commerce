import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_secret_key', // Replace with your own secret key
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // Find or validate the user based on the payload
      const user = await prisma.user.findUnique({where:{email:payload}});

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
