import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { userDocument } from "../interfaces/user.interface";
import canAccess from "../policies/user.policy";

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: userDocument = req.body;
    const user = await userService.createUser(userData);
    return res.status(201).json(user);
  } catch (error: any) {
    next(error);
  }
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = req.query.page as string;

    const users = await userService.getAllUsers(page);

    return res.status(200).json(users);
  } catch (error: any) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id as string;

    const user = await userService.getUser(userId);

    // check if user can access this record
    canAccess(res.locals.user, user);

    return res.status(200).json(user);
  } catch (error: any) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userDate: userDocument = req.body;
    const userId = req.params.id as string;

    const user = await userService.getUser(userId);

    // check if user can access this record
    canAccess(res.locals.user, user);

    const updatedUser = await userService.updateUser(user, userDate);

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id as string;

    const user = await userService.getUser(userId);

    if (user._id == res.locals.user.userId) return res.status(400).json({ message: "You can't delete yourself." });

    await userService.deleteUser(user);

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error: any) {
    next(error);
  }
}
