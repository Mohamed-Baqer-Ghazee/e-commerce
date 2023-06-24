import { Router } from "express";
import * as controllers from '../../controllers/products.controller'
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
    .get(controllers.getAllProducts)
    .post(authenticate, controllers.createProduct);

router.route('/:id')
    .get(controllers.getProductById)
    .patch(authenticate, controllers.updateProductById)
    .delete(authenticate, controllers.deleteProductById);


export default router;