import { Request, Response, NextFunction } from "express";

export default (roles: string[]) =>
  async function (req: Request, res: Response, next: NextFunction) {
    for (let i = 0; i < roles.length; i++) {
      if (res.locals.user.role === roles[i]) return next();
    }

    return res.status(401).json({ message: "Unauthorized request." });
  };
