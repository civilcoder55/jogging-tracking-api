import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { userDocument } from "../interfaces/user.interface";

export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId as string;

    const user = await userService.getUser(userId);

    return res.status(200).json(user);
  } catch (error: any) {
    next(error);
  }
}

export async function updateMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userDate: userDocument = req.body;
    const userId = res.locals.user.userId as string;

    const user = await userService.getUser(userId);

    const updatedUser = await userService.updateUser(user, userDate);

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    next(error);
  }
}

export async function deleteMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId as string;

    const user = await userService.getUser(userId);

    await userService.deleteUser(user);

    return res.status(200).json({ message: "Profile deleted successfully." });
  } catch (error: any) {
    next(error);
  }
}
