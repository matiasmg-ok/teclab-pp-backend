import { Router } from "express";
import { login } from "../controllers/users.controller";
import userPolicies from "../policies/users.policies";
const router = Router();

router.post("/login", login);

router.get("/am-i-logged-in", userPolicies.isLoggedIn, (req, res) => {
  res.send("You are logged in");
});

export default router;