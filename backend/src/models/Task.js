const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Backlog", "ToDo", "InProgress", "InReview", "Done"],
      default: "Backlog",
      index: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    dueDate: { type: Date },
    labels: [String],
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

taskSchema.index({ organization: 1, project: 1, status: 1 });
taskSchema.index({ organization: 1, assignee: 1, dueDate: 1 });
taskSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Task", taskSchema);
