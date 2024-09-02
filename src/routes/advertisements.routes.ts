import * as advertisementController from '../controllers/advertisements.controller';
import { Router } from 'express';

const router = Router();

router.get('/', advertisementController.getAll);
router.get('/:id', advertisementController.getOne);
router.post('/', advertisementController.create);
router.delete('/:id', advertisementController.delete_);

export default router;