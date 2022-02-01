import { Router } from "express";
import { createUserSchema } from "../schemas/user.schema";
import validatorMiddleware from "../middlewares/validator.middleware";
import * as userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/user", validatorMiddleware(createUserSchema), userController.createUser);
router.get("/user", authMiddleware, userController.getUser);

export default router;
