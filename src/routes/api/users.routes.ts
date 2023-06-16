import { Router , Request,Response } from "express";
import * as controllers from '../../controllers/users.controller'
const router =  Router();
router.route('/')
    .get(controllers.getAllUsers)
    .post(controllers.createUser);

    router.route('/:id').get(controllers.getUserById).delete(controllers.deleteUser).patch(controllers.updateUser)
export default router;