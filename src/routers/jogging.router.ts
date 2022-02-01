import { Router } from "express";
import validatorMiddleware from "../middlewares/validator.middleware";
import * as joggingController from "../controllers/jogging.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { createJoggingSchema, getAllJoggingSchema, updateJoggingSchema } from "../schemas/jogging.schema";

const router = Router();

router.post("/jogging", authMiddleware, validatorMiddleware(createJoggingSchema), joggingController.createJogging);
router.get("/jogging", authMiddleware, validatorMiddleware(getAllJoggingSchema), joggingController.getAllJogging);
router.get("/jogging/:id", authMiddleware, joggingController.getJoggingById);
router.get("/jogging/report", authMiddleware, joggingController.getWeeklyReport);
router.put("/jogging/:id", authMiddleware, validatorMiddleware(updateJoggingSchema), joggingController.updateJogging);
router.delete("/jogging/:id", authMiddleware, joggingController.deleteJogging);

export default router;
