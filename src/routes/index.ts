import { Router } from "express";
import usersRoutes from './api/users.routes';
import adminRoutes from './api/admin.routes';
import productsRoutes from './api/products.routes';

const router =  Router();

router.use('/users',usersRoutes);
router.use('/admin',adminRoutes);
router.use('/products',productsRoutes);
export default router;