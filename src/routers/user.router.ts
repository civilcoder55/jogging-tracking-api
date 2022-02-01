import { Router } from "express";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";
import validatorMiddleware from "../middlewares/validator.middleware";
import * as userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import guardMiddleware from "../middlewares/guard.middleware";
import { ROLES } from "../interfaces/role.interface";

const router = Router();

router.post(
  "/users",
  authMiddleware,
  guardMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  validatorMiddleware(createUserSchema),
  userController.createUser
);
router.get("/users", authMiddleware, guardMiddleware([ROLES.MANAGER, ROLES.ADMIN]), userController.getAllUsers);
router.get(
  "/users/:id",
  authMiddleware,
  guardMiddleware([ROLES.USER, ROLES.MANAGER, ROLES.ADMIN]),
  userController.getUser
);
router.patch(
  "/users/:id",
  authMiddleware,
  validatorMiddleware(updateUserSchema),
  guardMiddleware([ROLES.USER, ROLES.MANAGER, ROLES.ADMIN]),
  userController.updateUser
);
router.delete("/users/:id", authMiddleware, guardMiddleware([ROLES.MANAGER, ROLES.ADMIN]), userController.deleteUser);

export default router;
