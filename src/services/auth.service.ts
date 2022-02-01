import { tokenDocument } from "../interfaces/token.interface";
import { userDocument } from "../interfaces/user.interface";
import tokenModel from "../models/token.model";
import userModel from "../models/user.model";
import { signToken } from "../utils/jwt.util";

export async function validateUser(email: string, password: string): Promise<userDocument> {
  // fetch user from the database
  const user = await userModel.findOne({ email });

  // check if user exist
  if (user) {
    // validate user password and return user document
    const hasValidPassword = await user.validatePassword(password);
    if (hasValidPassword) return user;
  }

  // if user doesn't exist or has wrong password, throw Invalid credentials error
  throw {
    statusCode: 401,
    message: "Invalid credentials.",
  };
}

export async function createToken(user: userDocument): Promise<string> {
  // generate jwt access token
  const accessToken = signToken({ userId: user._id, email: user.email, role: user.role });

  // store token inside database so can be revoked(logout) [not best practice for high throughput apps]
  await tokenModel.create({ user: user._id, token: accessToken });

  return accessToken;
}

export async function getToken(userId: string, token: string): Promise<tokenDocument | false> {
  const accessToken = await tokenModel.findOne({ user: userId, token: token });

  // check if accessToken exist
  if (accessToken) {
    return accessToken;
  }

  return false;
}

export async function logout(userId: string, accesstoken: string): Promise<void> {
  const token = await getToken(userId, accesstoken);
  if (token) {
    // just delete token from database
    await token.remove();
  }
}
