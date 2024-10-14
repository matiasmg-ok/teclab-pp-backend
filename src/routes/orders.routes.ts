import { Request, Response, Router } from "express";
import * as ordersController from "../controllers/orders.controller";
import usersPolicies from "../policies/users.policies";
const router = Router();

router.get('/self', usersPolicies.isLoggedIn, ordersController.getMyOrders);
router.post('/', usersPolicies.isLoggedIn, ordersController.createOrder)

export default router;