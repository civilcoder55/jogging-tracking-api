import { Router } from "express";
import authRouter from "./routers/auth.router";
import joggingRouter from "./routers/jogging.router";
import adminJoggingRouter from "./routers/admin/jogging.router";
import profileRouter from "./routers/profile.router";
import userRouter from "./routers/user.router";
import reportRouter from "./routers/report.router";
import swaggerRouter from "./routers/swagger.router";

const router = Router();

/**
 * Register all routes into one Router object
 */
router.use(userRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(joggingRouter);
router.use(adminJoggingRouter);
router.use(reportRouter);
router.use(swaggerRouter);

export default router;
