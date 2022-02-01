import mongoose from "mongoose";

export interface userDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  validatePassword(inputPassword: string): Promise<boolean>;
}
