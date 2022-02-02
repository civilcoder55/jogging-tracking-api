import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import * as reportController from "../controllers/report.controller";

const router = Router();

router.get("/reports", authMiddleware, reportController.getReport);

export default router;
