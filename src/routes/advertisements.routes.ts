import * as advertisementController from '../controllers/advertisements.controller';
import usersPolicies from '../policies/users.policies';

import { Router } from 'express';

const router = Router();

router.get('/', advertisementController.getAll);
router.get('/:id', advertisementController.getOne);
router.post('/', usersPolicies.isLoggedIn, usersPolicies.isAdmin, advertisementController.create);
router.delete('/:id', usersPolicies.isLoggedIn, usersPolicies.isAdmin, advertisementController.delete_);

export default router;