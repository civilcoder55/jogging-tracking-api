import mongoose from "mongoose";
import { joggingDocument } from "../interfaces/jogging.interface";

const JoggingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String },
  distance: { type: Number },
  time: { type: Number },
  date: { type: Date, default: Date.now },
});

JoggingSchema.methods.toJSON = function () {
  const jogging = this.toObject();
  delete jogging.user;
  delete jogging.__v;
  return jogging;
};

export default mongoose.model<joggingDocument>("Jogging", JoggingSchema);
