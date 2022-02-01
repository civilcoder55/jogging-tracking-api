import mongoose from "mongoose";
import { ROLES } from "./role.interface";

export interface userDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  role: ROLES;
  createdAt: Date;
  updatedAt: Date;
  validatePassword(inputPassword: string): Promise<boolean>;
}
