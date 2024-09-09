import { Router } from "express";
import { login } from "../controllers/users.controller";
import userPolicies from "../policies/users.policies";
const router = Router();

router.post("/login", login);

router.get("/whoami", userPolicies.isLoggedIn, (req: any, res) => {
  res.send(req.user.body);
});

export default router;