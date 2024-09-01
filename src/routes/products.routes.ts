import * as productController from '../controllers/products.controller';
import { Router } from 'express';

const router = Router();

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.post('/', productController.create);
router.delete('/:id', productController.delete_);

export default router;