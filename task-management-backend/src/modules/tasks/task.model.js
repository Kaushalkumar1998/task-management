import mongoose from "mongoose";
import { TASK_STATUS, TASK_STATUS_LIST } from "../../shared/constants/enum.js";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    status: {
      type: String,
      enum: TASK_STATUS_LIST,
      default: TASK_STATUS.PENDING,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

taskSchema.index({ status: 1, assignedTo: 1 });
taskSchema.index({ createdBy: 1, updatedAt: -1 });

export default mongoose.model("Task", taskSchema);
