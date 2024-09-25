import multer from 'multer';
import * as advertisementController from '../controllers/advertisements.controller';
import usersPolicies from '../policies/users.policies';

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
      cb(null, path.join(__dirname, '../../public/img/advertisements'));
    },
    filename: (req, file, cb) => {
      cb(null, `advertisement_${new Date().getTime()}.${file.originalname.split('.')[1]}`);
    }
  })
});

const router = Router();

router.get('/', advertisementController.getAll);
router.get('/:id', advertisementController.getOne);
router.post('/', usersPolicies.isLoggedIn, usersPolicies.isAdmin, upload.single('image'), advertisementController.create);
router.delete('/:id', usersPolicies.isLoggedIn, usersPolicies.isAdmin, upload.single('image'), advertisementController.delete_);

export default router;