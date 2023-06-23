import { Router} from "express";
import * as controllers from '../../controllers/admin.controller'
import multer from 'multer'
import bodyParser from 'body-parser'
import passport from 'passport';
const JwtStrategy = require('passport-jwt').Strategy;
import cookieParser from 'cookie-parser';
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
    .get(authenticate, controllers.getAllUsers)
    .post(controllers.signIn)
    .delete(authenticate,controllers.signOut);
router.route('/:id')
    .get(authenticate,controllers.getUserById)
    .patch(authenticate,controllers.updateUser)
    .delete(authenticate,controllers.deleteUser);




export default router;