import { Router } from "express";
import { createJoggingSchema, getAllJoggingSchema, updateJoggingSchema } from "../schemas/jogging.schema";
import validatorMiddleware from "../middlewares/validator.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import * as joggingController from "../controllers/jogging.controller";

const router = Router();

router.post("/jogging", authMiddleware, validatorMiddleware(createJoggingSchema), joggingController.createJogging);
router.get("/jogging", authMiddleware, validatorMiddleware(getAllJoggingSchema), joggingController.getUserJogging);
router.get("/jogging/:id", authMiddleware, joggingController.getJogging);
router.patch("/jogging/:id", authMiddleware, validatorMiddleware(updateJoggingSchema), joggingController.updateJogging);
router.delete("/jogging/:id", authMiddleware, joggingController.deleteJogging);

export default router;
