const Task = require("../models/Task");
const { validateTaskTransition } = require("../services/taskService");

exports.getProjectTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const orgId = req.headers["x-organization-id"];

    const tasks = await Task.find({
      organization: orgId,
      project: projectId,
      isDeleted: false,
    })
      .populate("assignee", "fullName email avatar")
      .populate("dependencies");

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const updatedTask = await validateTaskTransition(taskId, status);
    res.status(200).json({ success: true, data: updatedTask });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
