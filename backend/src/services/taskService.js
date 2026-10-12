const Task = require("../models/Task");

exports.validateTaskTransition = async (taskId, targetStatus) => {
  const task = await Task.findById(taskId).populate("dependencies");
  if (!task) throw new Error("Task not found");

  if (targetStatus === "Done") {
    const incompleteDeps = task.dependencies.filter(
      (dep) => dep.status !== "Done",
    );
    if (incompleteDeps.length > 0) {
      throw new Error(
        `Cannot complete task. ${incompleteDeps.length} dependent task(s) are not yet Done.`,
      );
    }
  }

  task.status = targetStatus;
  await task.save();
  return task;
};
