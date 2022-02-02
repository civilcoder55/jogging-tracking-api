import mongoose from "mongoose";
import { userDocument } from "./user.interface";

export interface reportDocument extends mongoose.Document {
  user: userDocument["_id"];
  weekDate: Date;
  totalDistance: number;
  totalDuration: number;
  avgSpeed: number;
  createdAt: Date;
  updatedAt: Date;
}
