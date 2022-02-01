import jwt from "jsonwebtoken";
import config from "../config";

const jwtConfig = {
  ttl: config.ACCESS_TOKEN_TTL,
  secret: config.ACCESS_TOKEN_SECRET_KEY,
};

export function signToken(payload: Record<string, string>) {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.ttl });
}

export function validateToken(token: string) {
  try {
    const payload = jwt.verify(token, jwtConfig.secret) as Record<string, string>;
    return {
      valid: true,
      payload,
    };
  } catch (error: any) {
    return {
      valid: false,
      payload: null,
    };
  }
}
