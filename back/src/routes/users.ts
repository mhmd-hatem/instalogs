import { Router, Response, Request } from "express";
import { loginUser, logout, signupUser } from "../controllers";

const router = Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/logout", logout);

export default router;
