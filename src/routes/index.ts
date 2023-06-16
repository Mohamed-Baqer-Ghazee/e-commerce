import express,{ Router , Request,Response } from "express";
import usersRoutes from './api/users.routes';

const router =  Router();

router.use(express.json());
router.use('/users',usersRoutes)

export default router;