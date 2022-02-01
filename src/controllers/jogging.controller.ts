import { Request, Response, NextFunction } from "express";
import { joggingDocument } from "../interfaces/jogging.interface";
import * as joggingService from "../services/jogging.service";

export async function createJogging(req: Request, res: Response, next: NextFunction) {
  try {
    const joggingData: joggingDocument = req.body;
    const userId = res.locals.user.userId;

    const jogging = await joggingService.createJogging(joggingData, userId);

    return res.status(201).json(jogging);
  } catch (error: any) {
    next(error);
  }
}

export async function getAllJogging(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    const page = req.query.page as string;
    const filter = { from: req.query.from as string, to: req.query.to as string };
    
    const joggings = await joggingService.getAllJogging(userId, page, filter);

    return res.status(200).json(joggings);
  } catch (error: any) {
    next(error);
  }
}

export async function getJogging(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    const joggingId = req.params.id;

    const jogging = await joggingService.getJoggingById(joggingId, userId);

    return res.status(200).json(jogging);
  } catch (error: any) {
    next(error);
  }
}

export async function getWeeklyReport(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    const joggingId = req.params.id;

    const jogging = await joggingService.getWeeklyReport(joggingId, userId);
    return res.status(200).json(jogging);
  } catch (error: any) {
    next(error);
  }
}

export async function updateJogging(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    const joggingId = req.params.id;
    const joggingData: joggingDocument = req.body;

    const jogging = await joggingService.updateJogging(joggingData, joggingId, userId);

    return res.status(200).json(jogging);
  } catch (error: any) {
    next(error);
  }
}

export async function deleteJogging(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    const joggingId = req.params.id;
    await joggingService.deleteJogging(joggingId, userId);

    return res.status(200).json({ message: "Jogging deleted successfully." });
  } catch (error: any) {
    next(error);
  }
}
