import { Router } from "express";
import { updateUserSchema } from "../schemas/user.schema";
import validatorMiddleware from "../middlewares/validator.middleware";
import * as profileController from "../controllers/profile.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get("/profile", authMiddleware, profileController.getMyProfile);
router.patch("/profile", authMiddleware, validatorMiddleware(updateUserSchema), profileController.updateMyProfile);
router.delete("/profile", authMiddleware, profileController.deleteMyProfile);

export default router;
