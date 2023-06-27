import { Router } from "express";
import usersRoutes from './api/users.routes';
import adminRoutes from './api/admin.routes';
import productsRoutes from './api/products.routes';
import cartsRoutes from './api/carts.routes';
import cartProductRoutes from './api/cartProduct.routes';

const router =  Router();

router.use('/users',usersRoutes);
router.use('/admin',adminRoutes);
router.use('/products',productsRoutes);
router.use('/carts',cartsRoutes);
router.use('/cartproduct',cartProductRoutes);
export default router;