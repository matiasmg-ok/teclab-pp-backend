import * as productController from '../controllers/products.controller';
import userPolicies from '../policies/users.policies';
import { Router } from 'express';

const router = Router();

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.post('/', userPolicies.isLoggedIn, userPolicies.isAdmin, productController.create);
router.delete('/:id', userPolicies.isLoggedIn, userPolicies.isAdmin, productController.delete_);

export default router;