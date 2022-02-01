import { Router } from "express";
import authRouter from "./routers/auth.router";
import joggingRouter from "./routers/jogging.router";
import userRouter from "./routers/user.router";

const router = Router();

/**
 * Register all routes into one Router object
 */
router.use(userRouter);
router.use(authRouter);
router.use(joggingRouter);

export default router;
