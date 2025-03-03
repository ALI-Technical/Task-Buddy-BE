import { Schema, model, Document } from "mongoose";

interface ITask extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
  reminder: boolean;
}

const TaskModel = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    reminder: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<ITask>("tasks", TaskModel);
