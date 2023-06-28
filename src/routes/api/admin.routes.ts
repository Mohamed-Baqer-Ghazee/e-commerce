import { Router } from "express";
import * as controllers from '../../controllers/admin.controller'
import multer from 'multer'
import bodyParser from 'body-parser'
import passport from 'passport';
const JwtStrategy = require('passport-jwt').Strategy;
import cookieParser from 'cookie-parser';

const router = Router();
const upload = multer();
passport.use(JwtStrategy);
router.use(passport.initialize());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(upload.none());
router.use(cookieParser());

const authenticate = passport.authenticate('jwt', { session: false });

router.route('/users/getusers')
    .get(authenticate, controllers.getAllUsers);
router.route('/users/:id')
    .get(authenticate, controllers.getUserById)
    .put(authenticate, controllers.updateUserRole)
    .patch(authenticate, controllers.updateUserById)
    .delete(authenticate, controllers.deleteUser);

router.route('/profile').get(authenticate, controllers.getSignedUser);

export default router;