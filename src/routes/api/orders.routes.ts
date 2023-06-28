import { Router } from "express";
import * as controllers from '../../controllers/order.controller'
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
    .get(authenticate, controllers.getAllOrders)
router.route('/:id')
    .get(authenticate, controllers.getOrderById)
    .delete(authenticate, controllers.deleteOrderById);


router.route('/checkout')
    .get(authenticate, controllers.createOrder)
router.route('/:id')
    .get(authenticate, controllers.getOrdersByUserId)

export default router;