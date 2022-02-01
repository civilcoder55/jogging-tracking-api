import { Router } from "express";
import authRouter from "./routers/auth.router";
import userRouter from "./routers/user.router";

const router = Router();

/**
 * Register all routes into one Router object
 */
router.use(userRouter);
router.use(authRouter);

export default router;
