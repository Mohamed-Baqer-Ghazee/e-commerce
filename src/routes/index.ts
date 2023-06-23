import { Router } from "express";
import usersRoutes from './api/users.routes';
import adminRoutes from './api/admin.routes';

const router =  Router();

router.use('/users',usersRoutes);
router.use('/admin',adminRoutes);
export default router;