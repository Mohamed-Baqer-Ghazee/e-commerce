import { Router } from "express";
import * as controllers from '../../controllers/cartProduct.controller'
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

router.route('/')
    .get(controllers.getCartProducts)

router.route('/:id')
    .put(controllers.addProductToCart)
    .delete(controllers.removeProductById);

export default router;