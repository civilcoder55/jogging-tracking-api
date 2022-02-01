import mongoose from "mongoose";
import { userDocument } from "./user.interface";

export interface joggingDocument extends mongoose.Document {
  user: userDocument["_id"];
  name: string;
  distance: number; //distance in meters
  time: number; // time in seconds
  date: Date;
}
