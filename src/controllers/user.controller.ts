import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { userDocument } from "../interfaces/user.interface";

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: userDocument = req.body;
    const user = await userService.createUser(userData);
    return res.status(201).json(user);
  } catch (error: any) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    const user = await userService.getUser(userId);
    return res.status(200).json(user);
  } catch (error: any) {
    next(error);
  }
}
