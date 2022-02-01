import { Request, Response, NextFunction } from "express";
import { getToken } from "../services/auth.service";
import { validateToken } from "../utils/jwt.util";

export default async function (req: Request, res: Response, next: NextFunction) {
  const accessToken = req.header("Authorization")?.replace("Bearer ", "");
  
  if (accessToken) {
    const accessTokenData = validateToken(accessToken);
    if (accessTokenData.valid && accessTokenData.payload) {
      const token = await getToken(accessTokenData.payload.userId, accessToken);
      if (token) {
        res.locals.user = accessTokenData.payload;
        res.locals.accessToken = accessToken;
        return next();
      }
    }
  }

  return res.status(401).json({ message: "Unauthorized request." });
}
