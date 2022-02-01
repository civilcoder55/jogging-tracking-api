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

export async function getUserJogging(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    const page = req.query.page as string;
    const filter = { from: req.query.from as string, to: req.query.to as string };

    const joggings = await joggingService.getUserJogging(userId, page, filter);

    return res.status(200).json(joggings);
  } catch (error: any) {
    next(error);
  }
}

export async function getJogging(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    const joggingId = req.params.id;

    const jogging = await joggingService.getJogging(joggingId, userId);

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

    const jogging = await joggingService.getJogging(joggingId, userId);

    const updatedJogging = await joggingService.updateJogging(jogging, joggingData);

    return res.status(200).json(updatedJogging);
  } catch (error: any) {
    next(error);
  }
}

export async function deleteJogging(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    const joggingId = req.params.id;

    const jogging = await joggingService.getJogging(joggingId, userId);

    await joggingService.deleteJogging(jogging);

    return res.status(200).json({ message: "Jogging deleted successfully." });
  } catch (error: any) {
    next(error);
  }
}
