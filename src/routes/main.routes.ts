import { Request, Response, Router } from "express";
import usersRoutes from './users.routes'
const router = Router();

router.get('/', async (req: Request, res: Response) => {  
  return res.send('API - Hello world!');
});

router.use('/users', usersRoutes);

export default router;