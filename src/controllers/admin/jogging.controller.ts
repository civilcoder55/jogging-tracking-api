import { Request, Response, NextFunction } from "express";
import { joggingDocument } from "../../interfaces/jogging.interface";
import * as joggingService from "../../services/jogging.service";

export async function getAllJogging(req: Request, res: Response, next: NextFunction) {
  try {
    const page = req.query.page as string;
    const filter = { from: req.query.from as string, to: req.query.to as string };

    const joggings = await joggingService.getAllJogging(page, filter);

    return res.status(200).json(joggings);
  } catch (error: any) {
    next(error);
  }
}

export async function getJogging(req: Request, res: Response, next: NextFunction) {
  try {
    const joggingId = req.params.id;

    const jogging = await joggingService.getJogging(joggingId);

    return res.status(200).json(jogging);
  } catch (error: any) {
    next(error);
  }
}

export async function updateJogging(req: Request, res: Response, next: NextFunction) {
  try {
    const joggingId = req.params.id;
    const joggingData: joggingDocument = req.body;

    const jogging = await joggingService.getJogging(joggingId);

    const updatedJogging = await joggingService.updateJogging(jogging, joggingData);

    return res.status(200).json(updatedJogging);
  } catch (error: any) {
    next(error);
  }
}

export async function deleteJogging(req: Request, res: Response, next: NextFunction) {
  try {
    const joggingId = req.params.id;

    const jogging = await joggingService.getJogging(joggingId);

    await joggingService.deleteJogging(jogging);

    return res.status(200).json({ message: "Jogging deleted successfully." });
  } catch (error: any) {
    next(error);
  }
}
