import { Request, Response, Router } from "express";
import * as ordersController from "../controllers/orders.controller";
import usersPolicies from "../policies/users.policies";
const router = Router();

router.get('/', usersPolicies.isLoggedIn, usersPolicies.isAdmin, ordersController.getAll);
router.get('/self', usersPolicies.isLoggedIn, ordersController.getMyOrders);

router.post('/', usersPolicies.isLoggedIn, ordersController.createOrder);
router.patch('/:id', usersPolicies.isLoggedIn, usersPolicies.isAdmin, ordersController.updateOrder);

export default router;