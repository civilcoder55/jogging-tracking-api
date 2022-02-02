import { Router } from "express";
import { ROLES } from "../../interfaces/role.interface";
import { getAllJoggingSchema, updateJoggingSchema } from "../../schemas/jogging.schema";
import validatorMiddleware from "../../middlewares/validator.middleware";
import guardMiddleware from "../../middlewares/guard.middleware";
import authMiddleware from "../../middlewares/auth.middleware";
import * as adminJoggingController from "../../controllers/admin/jogging.controller";

const router = Router();

router.get(
  "/admin/jogging",
  authMiddleware,
  guardMiddleware([ROLES.ADMIN]),
  validatorMiddleware(getAllJoggingSchema),
  adminJoggingController.getAllJogging
);

router.get("/admin/jogging/:id", authMiddleware, guardMiddleware([ROLES.ADMIN]), adminJoggingController.getJogging);
router.patch(
  "/admin/jogging/:id",
  authMiddleware,
  guardMiddleware([ROLES.ADMIN]),
  validatorMiddleware(updateJoggingSchema),
  adminJoggingController.updateJogging
);

router.delete("/admin/jogging/:id", authMiddleware, guardMiddleware([ROLES.ADMIN]), adminJoggingController.deleteJogging);

export default router;
