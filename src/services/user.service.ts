import { userDocument } from "../interfaces/user.interface";
import joggingModel from "../models/jogging.model";
import tokenModel from "../models/token.model";
import userModel from "../models/user.model";
import { paginator } from "../utils/paginator.utils";

export async function createUser(userData: userDocument): Promise<userDocument> {
  // check if another user registerd with same email
  const sameUser = await userModel.findOne({ email: userData.email });

  // if so throw conflict error
  if (sameUser) {
    throw {
      statusCode: 409,
      message: "User email already exists.",
    };
  }

  // else create user and return it
  const user = await userModel.create(userData);

  return user;
}

export async function getUser(id: string): Promise<userDocument> {
  //fetch user from database
  const user = await userModel.findOne({ _id: id });

  // if user doesn't exist throw not found error [won't happend in most cases]
  if (!user) {
    throw { statusCode: 404, message: "User not found." };
  }

  return user;
}

export async function getAllUsers(page: string) {
  //fetch all users from database with pagination
  return await paginator(userModel, page, {});
}

export async function updateUser(user: userDocument, userData: userDocument): Promise<userDocument> {
  // check if another user registerd with same email
  const sameUser = await userModel.findOne({ email: userData.email });

  // if so throw conflict error
  if (sameUser && sameUser._id != user.id) {
    throw {
      statusCode: 409,
      message: "User email already exists.",
    };
  }

  Object.assign(user, userData);

  await user.save();

  return user;
}

export async function deleteUser(user: userDocument): Promise<void> {
  await tokenModel.deleteMany({ user: user._id });
  await joggingModel.deleteMany({ user: user._id });
  await user.remove();
}
