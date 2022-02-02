import { Request, Response, NextFunction } from "express";
import { getReports } from "../services/report.service";

export async function getReport(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId as string;
    const page = req.query.page as string;
    const all = req.query.all as string;
    const reports = await getReports(userId, page, all);

    return res.status(200).json(reports);
  } catch (error: any) {
    next(error);
  }
}
