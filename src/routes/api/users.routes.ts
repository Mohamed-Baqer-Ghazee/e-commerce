import express,{ Router , Request,Response } from "express";
import * as controllers from '../../controllers/users.controller'
import multer from 'multer'
const router =  Router();
var bodyParser = require('body-parser')

// Configure multer to handle form data
const upload = multer();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(upload.none());

router.route('/')
    .get(controllers.getAllUsers)
    .post(controllers.createUser);

router.route('/:id')
    .get(controllers.getUserById)
    .patch(controllers.updateUser)
    .delete(controllers.deleteUser);

router.route('/authenticate').post(controllers.authenticate);

export default router;