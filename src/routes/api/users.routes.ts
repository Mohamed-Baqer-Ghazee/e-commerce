import express,{ Router , Request,Response } from "express";
import * as controllers from '../../controllers/users.controller'
import multer from 'multer'
import bodyParser from 'body-parser'
import authenticationMiddleware from '../../middleWares/authentication.middleware'

import cookieParser from 'cookie-parser';
const router =  Router();

// Configure multer to handle form data
const upload = multer();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(upload.none());
router.use(cookieParser());

router.route('/')
    .get(authenticationMiddleware, controllers.getAllUsers)
    .post(controllers.signUp)
    .delete(controllers.signOut);

router.route('/:id')
    .get(controllers.getUserById)
    .patch(controllers.updateUser)
    .delete(controllers.deleteUser);

router.route('/signin').post(controllers.signIn);



export default router;