import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
}

const UserModel: Schema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, {
  timestamps: true
});

export default mongoose.model<IUser>("users", UserModel);
