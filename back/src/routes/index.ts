import { Router } from "express";
import userRouter from "./users";
import eventRouter from "./events";
import { auth } from "../middlewares/auth";

const router = Router();

router.use("/users", userRouter);
router.use("/events", auth, eventRouter);

export default router;
