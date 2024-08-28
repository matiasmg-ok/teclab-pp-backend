import { Request, Response, Router } from "express";
import usersRoutes from './users.routes'
const router = Router();

router.get('/', async (req: Request, res: Response) => {  
  return res.send('Status: OK');
});

router.use('/users', usersRoutes);
router.use('/send-form', notificationRoutes);

export default router;