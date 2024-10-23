import { Router } from "express";
import { login, register, getAll, delete_ } from "../controllers/users.controller";
import userPolicies from "../policies/users.policies";
const router = Router();

router.post('/login', login);
router.post('/signup', register);

router.get('/whoami', userPolicies.isLoggedIn, (req: any, res) => {
  res.send(req.body.user);
});

router.get('/', userPolicies.isLoggedIn, userPolicies.isAdmin, getAll);

router.delete('/:id', userPolicies.isLoggedIn, userPolicies.isAdmin, delete_);

export default router;