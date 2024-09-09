import { Router } from "express";
import { login, register } from "../controllers/users.controller";
import userPolicies from "../policies/users.policies";
const router = Router();

router.post('/login', login);
router.post('/signup', register);

router.get('/whoami', userPolicies.isLoggedIn, (req: any, res) => {
  res.send(req.body.user);
});

export default router;