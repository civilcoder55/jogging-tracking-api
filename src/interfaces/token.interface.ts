import mongoose from "mongoose";
import { userDocument } from "./user.interface";

export interface tokenDocument extends mongoose.Document {
  user: userDocument["_id"];
  token: string;
  createdAt: Date;
  updatedAt: Date;
}
