import mongoose from "mongoose";
import { tokenDocument } from "../interfaces/token.interface";

const TokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

TokenSchema.methods.toJSON = function () {
  const token = this.toObject();
  delete token.user;
  delete token.__v;
  delete token.updatedAt;
  return token;
};

export default mongoose.model<tokenDocument>("Token", TokenSchema);
