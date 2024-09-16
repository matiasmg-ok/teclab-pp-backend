import multer from 'multer';
import * as productController from '../controllers/products.controller';
import userPolicies from '../policies/users.policies';
import { Router } from 'express';
import path from 'path';

const validImageFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const upload = multer({
  fileFilter: (req, file, cb) => {
    if (validImageFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../public/img/products'));
    },
    filename: (req, file, cb) => {
      cb(null, `product_${new Date().getTime()}.${file.originalname.split('.')[1]}`);
    }
  })
});

const router = Router();

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.post('/', userPolicies.isLoggedIn, userPolicies.isAdmin, upload.single('image'), productController.create);
router.put('/:id', userPolicies.isLoggedIn, userPolicies.isAdmin, upload.single('image'), productController.update);
router.delete('/:id', userPolicies.isLoggedIn, userPolicies.isAdmin, productController.delete_);

export default router;