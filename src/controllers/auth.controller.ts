import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";

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
