import mongoose from "mongoose";
import { reportDocument } from "../interfaces/report.interface";

const ReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    weekDate: { type: Date },
    totalDistance: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    avgSpeed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ReportSchema.methods.toJSON = function () {
  const Report = this.toObject();
  delete Report.user;
  delete Report.__v;
  return Report;
};

export default mongoose.model<reportDocument>("Report", ReportSchema);
