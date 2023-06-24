import { Router } from "express";
import * as controllers from '../../controllers/users.controller'
import multer from 'multer'
import bodyParser from 'body-parser'
import passport from 'passport';
import cookieParser from 'cookie-parser';
const JwtStrategy = require('passport-jwt').Strategy;

const router =  Router();

// Configure multer to handle form data
const upload = multer();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(upload.none());
router.use(cookieParser());

// Register JWT strategy with Passport
passport.use(JwtStrategy);
router.use(passport.initialize());

const authenticate = passport.authenticate('jwt', { session: false });

router.route('/')
    .get(authenticate, controllers.getSignedUser)
    .post(controllers.signIn)
    .patch(authenticate, controllers.updateCurrentUser)
    .delete(authenticate, controllers.signOut);

router.route('/signUp').post(controllers.signUp);



export default router;