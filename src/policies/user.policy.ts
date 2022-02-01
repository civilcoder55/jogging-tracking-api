import { ROLES } from "../interfaces/role.interface";
import { userDocument } from "../interfaces/user.interface";

export default function canAccess(user: { userId: string; role: string }, doc: userDocument) {
  if (user.userId == doc._id) {
    return true;
  }

  if (user.role == ROLES.MANAGER) {
    return true;
  }

  if (user.role == ROLES.ADMIN) {
    return true;
  }

  // throw not found error instead of unauthorized as security practice
  throw {
    statusCode: 404,
    message: "User not found.",
  };
}
