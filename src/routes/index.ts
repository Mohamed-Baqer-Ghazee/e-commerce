import express,{ Router , Request,Response } from "express";
import usersRoutes from './api/users.routes';
import authRoutes from './api/auth.routes';

const router =  Router();

router.use('/users',usersRoutes);
router.use('/auth',authRoutes);

export default router;