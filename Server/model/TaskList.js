import mongoose from "mongoose";

const TaskSchema = mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const TaskLast = mongoose.model("TaskLast", TaskSchema);

export default TaskLast;
