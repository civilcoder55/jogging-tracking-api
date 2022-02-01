import { Router } from "express";
import validatorMiddleware from "../middlewares/validator.middleware";
import * as authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/auth/login", validatorMiddleware(loginSchema), authController.login);
router.post("/auth/logout", authMiddleware, authController.logout);

export default router;
