import { Request, Response, NextFunction } from "express";
import { userDocument } from "../interfaces/user.interface";
import * as authService from "../services/auth.service";
import { createUser } from "../services/user.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: userDocument = req.body;
    const user = await createUser(userData);
    return res.status(201).json(user);
  } catch (error: any) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);
    const accessToken = await authService.createToken(user);
    return res.status(200).json({ accessToken });
  } catch (error: any) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = res.locals.user.userId;
    const accessToken = res.locals.accessToken;
    await authService.logout(userId, accessToken);
    return res.status(200).json({ message: "Success." });
  } catch (error: any) {
    next(error);
  }
}
